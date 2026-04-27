// @ts-nocheck
import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../prisma';
import Groq from 'groq-sdk';

const router = Router();
const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

router.use(authenticate);

/**
 * POST /api/contracts/analyze
 * Analyzes a contract text for risky clauses using Groq AI
 */
router.post('/analyze', async (req: AuthRequest, res): Promise<void> => {
  const { contractText } = req.body;

  if (!contractText || contractText.trim().length < 50) {
    res.status(400).json({ error: 'Contract text must be at least 50 characters.' });
    return;
  }

  try {
    const dbUser = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!dbUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!dbUser.isPro && dbUser.queriesCount >= 10) {
      res.status(403).json({ error: 'FREE_LIMIT_REACHED', message: 'You have exhausted your 10 free queries.' });
      return;
    }

    const groq = getGroq();

    const systemPrompt = `You are Nyaya AI's Contract Risk Detection Engine, specializing in Indian contract law.
Analyze the given contract text and identify risky, unfair, or legally problematic clauses under Indian law (Indian Contract Act 1872, Consumer Protection Act, etc.).

You MUST respond ONLY with a valid JSON object (no markdown, no code fences) in exactly this schema:
{
  "overallRisk": "LOW" | "MEDIUM" | "HIGH",
  "summary": "2-3 sentence plain English summary of the contract and its risk level",
  "riskyClauses": [
    {
      "clause": "Exact text or short excerpt of the risky clause",
      "risk": "HIGH" | "MEDIUM" | "LOW",
      "reason": "Why this clause is risky under Indian law",
      "suggestion": "How to fix or negotiate this clause"
    }
  ],
  "suggestions": [
    "Overall suggestion 1 for the party signing this contract",
    "Overall suggestion 2"
  ]
}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
      temperature: 0.1,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this contract:\n\n${contractText.substring(0, 6000)}` }
      ]
    });

    let rawOutput = completion.choices[0]?.message?.content || '{}';
    rawOutput = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();

    let analysis;
    try {
      analysis = JSON.parse(rawOutput);
    } catch {
      analysis = {
        overallRisk: 'MEDIUM',
        summary: 'Analysis completed. Please review the contract manually.',
        riskyClauses: [],
        suggestions: ['Consult a licensed legal professional before signing.']
      };
    }

    // Save analysis to database
    const saved = await prisma.contractAnalysis.create({
      data: {
        userId: req.user!.userId,
        contractText: contractText.substring(0, 2000),
        overallRisk: analysis.overallRisk || 'MEDIUM',
        summary: analysis.summary || '',
        riskyClausesJson: JSON.stringify(analysis.riskyClauses || []),
        suggestionsJson: JSON.stringify(analysis.suggestions || [])
      }
    });

    // Increment usage for free users
    if (!dbUser.isPro) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { queriesCount: { increment: 1 } }
      });
    }

    res.json({
      id: saved.id,
      overallRisk: analysis.overallRisk,
      summary: analysis.summary,
      riskyClauses: analysis.riskyClauses || [],
      suggestions: analysis.suggestions || [],
      analyzedAt: saved.createdAt
    });

  } catch (error) {
    console.error('Contract Analysis Error:', error);
    res.status(500).json({ error: 'Failed to analyze contract' });
  }
});

/**
 * GET /api/contracts/history
 * Returns past contract analyses for the logged-in user
 */
router.get('/history', async (req: AuthRequest, res): Promise<void> => {
  try {
    const analyses = await prisma.contractAnalysis.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        overallRisk: true,
        summary: true,
        createdAt: true,
        contractText: true
      }
    });
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contract history' });
  }
});

export default router;
