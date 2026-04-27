"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Scale, MessageSquare, FileText, Search, Zap, ShieldAlert,
  Briefcase, Users, CheckCircle, AlertTriangle, Clock,
  TrendingUp, BookOpen, Gavel, Star, LogOut
} from "lucide-react";
import api from "@/lib/api";

const USER_STATS = [
  { label: "AI Queries Used", icon: MessageSquare, color: "#6366f1", key: "queriesCount" },
  { label: "Documents Uploaded", icon: FileText, color: "#10b981", key: "docsCount" },
  { label: "Plan", icon: Star, color: "#f59e0b", key: "isPro" },
];

const USER_FEATURES = [
  { label: "AI Legal Chat", desc: "Ask any legal question in plain language", icon: MessageSquare, href: "/", color: "#6366f1" },
  { label: "Contract Risk Analysis", desc: "Detect risky clauses before signing", icon: ShieldAlert, href: "/contracts", color: "#ef4444" },
  { label: "Legal Document Search", desc: "Search across IPC, BNS, Constitution", icon: Search, href: "/search", color: "#10b981" },
  { label: "Generate Documents", desc: "AI-drafted legal notices, contracts", icon: FileText, href: "/generate", color: "#f59e0b" },
  { label: "Case Intelligence", desc: "Get AI legal strategy for your case", icon: Zap, href: "/intelligence", color: "#8b5cf6" },
  { label: "Find a Lawyer", desc: "Connect with verified legal professionals", icon: Briefcase, href: "/marketplace", color: "#06b6d4" },
];

const LAWYER_FEATURES = [
  { label: "Client Cases", desc: "View and manage incoming client requests", icon: Briefcase, href: "/marketplace", color: "#6366f1" },
  { label: "AI Research Assistant", desc: "Use RAG-powered legal research", icon: BookOpen, href: "/", color: "#10b981" },
  { label: "Document Drafting", desc: "Generate professional legal documents", icon: FileText, href: "/generate", color: "#f59e0b" },
  { label: "Case Intelligence", desc: "AI-powered case strategy analysis", icon: Gavel, href: "/intelligence", color: "#8b5cf6" },
  { label: "Contract Review", desc: "Analyze contracts for clients", icon: ShieldAlert, href: "/contracts", color: "#ef4444" },
  { label: "Legal Research", desc: "Search IPC, BNS, Constitution", icon: Search, href: "/search", color: "#06b6d4" },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    fetchStats();
    fetchContractHistory();
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await api.get("/auth/me");
      setStats(res.data);
    } catch {}
  };

  const fetchContractHistory = async () => {
    try {
      const res = await api.get("/contracts/history");
      setRecentAnalyses(res.data.slice(0, 3));
    } catch {}
  };

  const isLawyer = stats?.role === "LAWYER" || user?.role === "LAWYER";

  const getRiskColor = (risk: string) => {
    if (risk === "HIGH") return "#ef4444";
    if (risk === "MEDIUM") return "#f59e0b";
    return "#10b981";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Scale size={22} color="#6366f1" />
          <span style={{ fontSize: 18, fontWeight: 700, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Nyaya AI
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: "#888", padding: "4px 12px", background: isLawyer ? "rgba(16,185,129,0.1)" : "rgba(99,102,241,0.1)", borderRadius: 20, border: `1px solid ${isLawyer ? "rgba(16,185,129,0.3)" : "rgba(99,102,241,0.3)"}` }}>
            {isLawyer ? "⚖️ Lawyer" : "👤 User"}
          </span>
          <button onClick={logout} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#888", borderRadius: 8, padding: "6px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        {/* Welcome Banner */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
            {isLawyer ? "⚖️ Lawyer Dashboard" : "👋 Welcome Back"}
          </h1>
          <p style={{ color: "#888", fontSize: 15 }}>
            {isLawyer
              ? "Manage your clients, research cases, and draft legal documents — powered by Nyaya AI."
              : "Your AI-powered legal assistant. Ask questions, analyze contracts, and get legal guidance."}
          </p>
        </motion.div>

        {/* Stats Row (User only) */}
        {!isLawyer && stats && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 36 }}>
            <StatCard label="AI Queries Used" value={stats.queriesCount ?? 0} max={stats.isPro ? "∞" : 10} icon={<MessageSquare size={18} />} color="#6366f1" />
            <StatCard label="Documents Uploaded" value={stats.docsCount ?? 0} icon={<FileText size={18} />} color="#10b981" />
            <StatCard label="Current Plan" value={stats.isPro ? "Pro ✨" : "Free"} icon={<Star size={18} />} color="#f59e0b" />
          </motion.div>
        )}

        {/* Lawyer Stats */}
        {isLawyer && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 36 }}>
            <StatCard label="Status" value={stats?.isVerified ? "Verified ✓" : "Pending"} icon={<CheckCircle size={18} />} color="#10b981" />
            <StatCard label="Specialization" value={stats?.specialization || "General"} icon={<Briefcase size={18} />} color="#6366f1" />
            <StatCard label="Bar Council ID" value={stats?.barCouncilId || "N/A"} icon={<Gavel size={18} />} color="#8b5cf6" />
          </motion.div>
        )}

        {/* Feature Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#ccc" }}>
            {isLawyer ? "Tools & Features" : "What would you like to do?"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 36 }}>
            {(isLawyer ? LAWYER_FEATURES : USER_FEATURES).map((f, i) => (
              <motion.a key={f.label} href={f.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px", cursor: "pointer", textDecoration: "none", color: "#fff", display: "block", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = f.color; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${f.color}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <f.icon size={18} color={f.color} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{f.label}</div>
                <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{f.desc}</div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Recent Contract Analyses */}
        {recentAnalyses.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#ccc" }}>Recent Contract Analyses</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recentAnalyses.map((a) => (
                <div key={a.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: getRiskColor(a.overallRisk), flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#ccc", marginBottom: 3 }}>{a.summary?.substring(0, 100)}...</div>
                    <div style={{ fontSize: 11, color: "#555" }}>{new Date(a.createdAt).toLocaleDateString("en-IN")}</div>
                  </div>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: `${getRiskColor(a.overallRisk)}20`, color: getRiskColor(a.overallRisk), fontWeight: 700 }}>
                    {a.overallRisk} RISK
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, max, icon, color }: any) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, color }}>
        {icon}
        <span style={{ fontSize: 12, color: "#666" }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color }}>
        {value}
        {max && <span style={{ fontSize: 13, color: "#555", fontWeight: 400 }}> / {max}</span>}
      </div>
    </div>
  );
}
