"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";

interface TrustFactor {
  id: string;
  label: string;
  score: number;
  weight: number;
  status: "pass" | "warn" | "fail" | "neutral";
  detail: string;
}

interface ScamWarning {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  message: string;
  detail: string;
}

interface TrustScoreData {
  total: number;
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";
  gradeLabel: string;
  factors: TrustFactor[];
  warnings: ScamWarning[];
  depositCompliant: boolean;
  depositStatus: "compliant" | "exceeds-cap" | "unknown";
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case "A+": case "A": return "#059669";
    case "B+": case "B": return "#1a56db";
    case "C+": case "C": return "#d97706";
    default: return "#dc2626";
  }
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#059669";
  if (score >= 60) return "#1a56db";
  if (score >= 40) return "#d97706";
  return "#dc2626";
}

function getSeverityColor(severity: string): { bg: string; border: string; text: string; icon: string } {
  switch (severity) {
    case "critical": return { bg: "#fef2f2", border: "#fecaca", text: "#991b1b", icon: "!" };
    case "high": return { bg: "#fef2f2", border: "#fecaca", text: "#991b1b", icon: "!" };
    case "medium": return { bg: "#fffbeb", border: "#fde68a", text: "#92400e", icon: "!" };
    case "low": return { bg: "#f0f9ff", border: "#bae6fd", text: "#075985", icon: "i" };
    default: return { bg: "#f8fafc", border: "#e2e8f0", text: "#475569", icon: "i" };
  }
}

export default function TrustScoreCard({ propertyId }: { propertyId: string }) {
  const [data, setData] = useState<TrustScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(apiUrl(`/api/trust-score?propertyId=${propertyId}`))
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [propertyId]);

  if (loading) {
    return (
      <div style={{ padding: 20, borderRadius: 16, border: "1px solid var(--border)", background: "var(--surface)" }}>
        <div className="skeleton" style={{ height: 80, borderRadius: 12 }} />
      </div>
    );
  }

  if (!data) return null;

  const gradeColor = getGradeColor(data.grade);

  return (
    <div style={{
      borderRadius: 16, border: "1px solid var(--border)", background: "var(--surface)",
      overflow: "hidden", fontFamily: "Inter, system-ui",
    }}>
      {/* Header */}
      <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        {/* Score circle */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%", position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `conic-gradient(${gradeColor} ${data.total * 3.6}deg, var(--border-light) ${data.total * 3.6}deg)`,
          flexShrink: 0,
        }}>
          <div style={{
            width: 58, height: 58, borderRadius: "50%", background: "var(--surface)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: gradeColor, lineHeight: 1 }}>{data.total}</div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 600, marginTop: 2 }}>/100</div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{
              padding: "2px 10px", borderRadius: 6, fontSize: 13, fontWeight: 800,
              background: `${gradeColor}15`, color: gradeColor,
            }}>{data.grade}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{data.gradeLabel}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
            Nivasa Trust Score based on owner verification, deposit compliance, listing quality, and scam analysis
          </div>
        </div>
      </div>

      {/* Deposit Compliance Banner */}
      {data.depositStatus !== "unknown" && (
        <div style={{
          margin: "0 24px 16px", padding: "10px 14px", borderRadius: 10,
          background: data.depositCompliant ? "var(--success-light)" : "#fef2f2",
          border: `1px solid ${data.depositCompliant ? "#bbf7d0" : "#fecaca"}`,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{
            width: 20, height: 20, borderRadius: "50%",
            background: data.depositCompliant ? "var(--success)" : "#dc2626",
            color: "white", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, flexShrink: 0,
          }}>{data.depositCompliant ? "\u2713" : "!"}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: data.depositCompliant ? "#047857" : "#991b1b" }}>
            {data.depositCompliant
              ? "Deposit is within Maharashtra's 2-month legal cap"
              : "Deposit exceeds Maharashtra's 2-month legal cap — this may not be enforceable"}
          </span>
        </div>
      )}

      {/* Factors */}
      <div style={{ padding: "0 24px 16px" }}>
        <div style={{ display: "grid", gap: 8 }}>
          {data.factors.map((f) => (
            <div key={f.id} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
              borderRadius: 10, background: "var(--bg)", fontSize: 13,
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                background: f.status === "pass" ? "var(--success)" : f.status === "warn" ? "var(--warning)" : f.status === "fail" ? "var(--danger)" : "var(--border)",
                color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 800, flexShrink: 0,
              }}>
                {f.status === "pass" ? "\u2713" : f.status === "warn" ? "!" : f.status === "fail" ? "\u2717" : "-"}
              </span>
              <span style={{ flex: 1, color: "var(--text)", fontWeight: 500 }}>{f.label}</span>
              <span style={{
                width: 40, height: 5, borderRadius: 3, background: "var(--border-light)", overflow: "hidden", flexShrink: 0,
              }}>
                <span style={{ display: "block", width: `${f.score}%`, height: "100%", borderRadius: 3, background: getScoreColor(f.score) }} />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Warnings */}
      {data.warnings.length > 0 && (
        <div style={{ padding: "0 24px 20px" }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
              borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)",
              cursor: "pointer", width: "100%", textAlign: "left", fontSize: 13, fontWeight: 600,
              color: "var(--text)",
            }}
          >
            <span style={{ color: data.warnings.some((w) => w.severity === "high" || w.severity === "critical") ? "var(--danger)" : "var(--warning)" }}>
              {data.warnings.filter((w) => w.severity === "high" || w.severity === "critical").length > 0
                ? `${data.warnings.filter((w) => w.severity === "high" || w.severity === "critical").length} warning(s) detected`
                : `${data.warnings.length} note(s) found`}
            </span>
            <span style={{ marginLeft: "auto", color: "var(--text-muted)", fontSize: 11 }}>
              {expanded ? "Hide" : "Show details"}
            </span>
          </button>

          {expanded && (
            <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
              {data.warnings.map((w) => {
                const s = getSeverityColor(w.severity);
                return (
                  <div key={w.id} style={{
                    padding: "10px 14px", borderRadius: 10,
                    background: s.bg, border: `1px solid ${s.border}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{
                        width: 16, height: 16, borderRadius: 4,
                        background: w.severity === "critical" || w.severity === "high" ? "var(--danger)" : w.severity === "medium" ? "var(--warning)" : "var(--primary)",
                        color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, fontWeight: 800,
                      }}>{w.severity === "low" ? "i" : "!"}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: s.text, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {w.type}
                      </span>
                      <span style={{ fontSize: 10, color: s.text, opacity: 0.7 }}>({w.severity})</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{w.message}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{w.detail}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
