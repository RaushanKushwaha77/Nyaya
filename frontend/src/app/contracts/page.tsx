"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale, ShieldAlert, AlertTriangle, CheckCircle,
  ChevronLeft, Loader2, FileText, Lightbulb, ClipboardPaste
} from "lucide-react";
import api from "@/lib/api";

interface RiskyClause {
  clause: string;
  risk: "HIGH" | "MEDIUM" | "LOW";
  reason: string;
  suggestion: string;
}

interface AnalysisResult {
  overallRisk: "HIGH" | "MEDIUM" | "LOW";
  summary: string;
  riskyClauses: RiskyClause[];
  suggestions: string[];
  analyzedAt: string;
}

const RISK_CONFIG = {
  HIGH:   { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)",   label: "High Risk" },
  MEDIUM: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  label: "Medium Risk" },
  LOW:    { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)",  label: "Low Risk" },
};

const SAMPLE_CONTRACT = `This Agreement is entered into between Party A (the "Company") and Party B (the "Employee").

1. The Employee agrees to work exclusively for the Company for a period of 5 years and may not seek employment elsewhere during this period.

2. The Company reserves the right to terminate this agreement at any time without notice or compensation.

3. All intellectual property created by the Employee, including personal projects outside of work hours, shall be the exclusive property of the Company.

4. The Employee waives all rights to pursue legal action against the Company in any court of law in India.

5. The Employee's salary may be revised downward at the sole discretion of the Company without prior notice.`;

export default function ContractsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [contractText, setContractText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  const analyzeContract = async () => {
    if (!contractText.trim() || contractText.trim().length < 50) {
      setError("Please paste a contract with at least 50 characters.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post("/contracts/analyze", { contractText });
      setResult(res.data);
    } catch (err: any) {
      if (err.response?.data?.error === "FREE_LIMIT_REACHED") {
        setError("You have reached your free query limit. Upgrade to Pro to continue.");
      } else {
        setError("Failed to analyze contract. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "16px 32px", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#888", borderRadius: 8, padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <ChevronLeft size={14} /> Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ShieldAlert size={20} color="#ef4444" />
          <span style={{ fontWeight: 700, fontSize: 16 }}>Contract Risk Analysis</span>
          <span style={{ fontSize: 11, color: "#888", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", padding: "2px 10px", borderRadius: 20 }}>
            Powered by Nyaya AI
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
            ⚠️ Detect Risky Clauses Before You Sign
          </h1>
          <p style={{ color: "#888", fontSize: 14, lineHeight: 1.6 }}>
            Paste any contract below. Our AI will analyze it under <strong style={{ color: "#ccc" }}>Indian Contract Act 1872</strong>, Consumer Protection Act, and other Indian laws — and highlight unfair or dangerous clauses instantly.
          </p>
        </motion.div>

        {/* Input Area */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <label style={{ fontSize: 13, color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
              <FileText size={14} /> Paste your contract text
            </label>
            <button onClick={() => setContractText(SAMPLE_CONTRACT)}
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
              <ClipboardPaste size={12} /> Try Sample Contract
            </button>
          </div>
          <textarea
            value={contractText}
            onChange={e => setContractText(e.target.value)}
            placeholder="Paste your employment agreement, rental contract, NDA, or any legal document here..."
            rows={12}
            style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#fff", fontSize: 13, padding: "14px", resize: "vertical", fontFamily: "inherit", lineHeight: 1.7, outline: "none", boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <span style={{ fontSize: 12, color: "#555" }}>{contractText.length} characters</span>
            <button onClick={analyzeContract} disabled={loading}
              style={{ background: loading ? "rgba(239,68,68,0.3)" : "linear-gradient(135deg,#ef4444,#dc2626)", border: "none", color: "#fff", borderRadius: 10, padding: "12px 28px", cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
              {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Analyzing...</> : <><ShieldAlert size={16} /> Analyze for Risks</>}
            </button>
          </div>
          {error && <div style={{ marginTop: 12, color: "#ef4444", fontSize: 13, background: "rgba(239,68,68,0.1)", padding: "10px 14px", borderRadius: 8 }}>{error}</div>}
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Overall Risk Banner */}
              <div style={{ background: RISK_CONFIG[result.overallRisk].bg, border: `1px solid ${RISK_CONFIG[result.overallRisk].border}`, borderRadius: 14, padding: "20px 24px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
                <AlertTriangle size={28} color={RISK_CONFIG[result.overallRisk].color} />
                <div>
                  <div style={{ fontSize: 11, color: RISK_CONFIG[result.overallRisk].color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                    Overall Risk Level: {RISK_CONFIG[result.overallRisk].label}
                  </div>
                  <div style={{ fontSize: 14, color: "#ddd", lineHeight: 1.6 }}>{result.summary}</div>
                </div>
              </div>

              {/* Risky Clauses */}
              {result.riskyClauses.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#ccc", marginBottom: 14 }}>
                    🚨 {result.riskyClauses.length} Risky Clause{result.riskyClauses.length > 1 ? "s" : ""} Detected
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {result.riskyClauses.map((clause, i) => {
                      const cfg = RISK_CONFIG[clause.risk];
                      return (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                          style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${cfg.border}`, borderRadius: 12, padding: "18px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: "3px 10px", borderRadius: 20 }}>
                              {cfg.label}
                            </span>
                            <span style={{ fontSize: 11, color: "#555" }}>Clause {i + 1}</span>
                          </div>
                          <blockquote style={{ margin: "0 0 10px", padding: "10px 14px", background: "rgba(0,0,0,0.3)", borderLeft: `3px solid ${cfg.color}`, borderRadius: "0 8px 8px 0", fontSize: 13, color: "#bbb", fontStyle: "italic" }}>
                            "{clause.clause}"
                          </blockquote>
                          <div style={{ fontSize: 13, color: "#f87171", marginBottom: 8 }}>
                            <strong>⚠ Risk:</strong> {clause.reason}
                          </div>
                          <div style={{ fontSize: 13, color: "#86efac" }}>
                            <strong>✓ Suggestion:</strong> {clause.suggestion}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 14, padding: "20px 24px" }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#10b981", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <Lightbulb size={16} /> Overall Recommendations
                  </h2>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                    {result.suggestions.map((s, i) => (
                      <li key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>
                        <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ marginTop: 16, fontSize: 12, color: "#555", textAlign: "center" }}>
                ⚖️ This analysis is for informational purposes only. Consult a licensed lawyer before making legal decisions.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
