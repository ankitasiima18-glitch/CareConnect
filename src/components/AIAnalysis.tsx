import { useState } from "react";
import { AIAnalysisResult, FlagSeverity } from "../utils/aiAnalysis";

type Props = { result: AIAnalysisResult };

const SEVERITY_CONFIG: Record<FlagSeverity, { bg: string; border: string; badge: string; badgeText: string; dot: string; label: string }> = {
  critical: {
    bg: "#fff1f2",
    border: "#fecdd3",
    badge: "#dc2626",
    badgeText: "#ffffff",
    dot: "#dc2626",
    label: "Critical",
  },
  warning: {
    bg: "#fffbeb",
    border: "#fde68a",
    badge: "#d97706",
    badgeText: "#ffffff",
    dot: "#d97706",
    label: "Attention",
  },
  good: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    badge: "#16a34a",
    badgeText: "#ffffff",
    dot: "#16a34a",
    label: "Positive",
  },
};

const RISK_CONFIG = {
  high: { bg: "#dc2626", label: "High Risk", icon: "🔴", desc: "Immediate clinical review required" },
  moderate: { bg: "#d97706", label: "Moderate Risk", icon: "🟡", desc: "Follow-up and monitoring advised" },
  low: { bg: "#16a34a", label: "Low Risk", icon: "🟢", desc: "Stable health profile for this visit" },
};

export default function AIAnalysis({ result }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const risk = RISK_CONFIG[result.overallRisk];
  const criticals = result.flags.filter((f) => f.severity === "critical");
  const warnings = result.flags.filter((f) => f.severity === "warning");
  const goods = result.flags.filter((f) => f.severity === "good");

  return (
    <div className="grid gap-5">
      {/* Risk banner */}
      <div
        className="rounded-xl px-5 py-4 flex items-start gap-4"
        style={{
          background: `linear-gradient(135deg, ${risk.bg}18 0%, ${risk.bg}08 100%)`,
          border: `2px solid ${risk.bg}40`,
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
          style={{ backgroundColor: `${risk.bg}15` }}
        >
          {risk.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: risk.bg, color: "#ffffff", fontFamily: "var(--font-sans)" }}
            >
              {risk.label}
            </span>
            <span className="text-xs font-medium" style={{ color: "var(--color-muted-foreground)" }}>
              AI Health Assessment
            </span>
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-foreground)", fontFamily: "var(--font-sans)" }}>
            {risk.desc}
          </p>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)", lineHeight: "1.6" }}>
            {result.summary}
          </p>
        </div>
      </div>

      {/* Immediate attention */}
      {result.immediateAttention.length > 0 && (
        <div
          className="rounded-xl px-5 py-4"
          style={{ backgroundColor: "#fff1f2", border: "1.5px solid #fecdd3" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2l1.5 4.5H15l-3.75 2.75 1.5 4.5L9 11l-3.75 2.75 1.5-4.5L3 6.5h4.5z" fill="#dc2626" />
            </svg>
            <p className="text-sm font-bold" style={{ color: "#dc2626", fontFamily: "var(--font-sans)" }}>
              Requires Immediate Attention
            </p>
          </div>
          <ul className="grid gap-2">
            {result.immediateAttention.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#7f1d1d" }}>
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
                  style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                >
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Flag counts */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { count: criticals.length, label: "Critical Flags", color: "#dc2626", bg: "#fff1f2", border: "#fecdd3" },
          { count: warnings.length, label: "Caution Flags", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
          { count: goods.length, label: "Positive Flags", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: item.bg, border: `1.5px solid ${item.border}` }}
          >
            <p
              className="text-3xl font-bold tabular-nums"
              style={{ color: item.color, fontFamily: "var(--font-sans)" }}
            >
              {item.count}
            </p>
            <p className="text-xs mt-1" style={{ color: item.color, opacity: 0.8, fontFamily: "var(--font-sans)" }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Flags list */}
      {[
        { flags: criticals, label: "Critical Indicators", severity: "critical" as FlagSeverity },
        { flags: warnings, label: "Areas Needing Attention", severity: "warning" as FlagSeverity },
        { flags: goods, label: "Positive Health Indicators", severity: "good" as FlagSeverity },
      ].map(
        ({ flags, label, severity }) =>
          flags.length > 0 && (
            <div key={severity}>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" }}
              >
                {label}
              </p>
              <div className="grid gap-2">
                {flags.map((flag, i) => {
                  const cfg = SEVERITY_CONFIG[flag.severity];
                  const id = `${severity}-${i}`;
                  const open = expanded === id;
                  return (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden transition-all duration-200"
                      style={{ backgroundColor: cfg.bg, border: `1.5px solid ${cfg.border}` }}
                    >
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 text-left"
                        onClick={() => setExpanded(open ? null : id)}
                      >
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cfg.dot }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: cfg.badge, color: cfg.badgeText, fontFamily: "var(--font-sans)" }}
                            >
                              {cfg.label}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: "rgba(0,0,0,0.05)",
                                color: "var(--color-muted-foreground)",
                              }}
                            >
                              {flag.category}
                            </span>
                          </div>
                          <p
                            className="text-sm font-semibold mt-1"
                            style={{ color: "var(--color-foreground)", fontFamily: "var(--font-sans)" }}
                          >
                            {flag.title}
                          </p>
                        </div>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          style={{
                            flexShrink: 0,
                            transform: open ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                            color: "var(--color-muted-foreground)",
                          }}
                        >
                          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      {open && (
                        <div
                          className="px-4 pb-4 pt-1 grid gap-2 text-sm"
                          style={{ borderTop: `1px solid ${cfg.border}` }}
                        >
                          <p style={{ color: "var(--color-foreground)", lineHeight: "1.6" }}>{flag.detail}</p>
                          {flag.action && (
                            <div
                              className="flex items-start gap-2 px-3 py-2 rounded-lg"
                              style={{ backgroundColor: "rgba(0,0,0,0.04)" }}
                            >
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                                <path d="M7 1.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM7 5v3.5M7 10v.5" stroke="var(--color-primary)" strokeWidth="1.2" strokeLinecap="round" />
                              </svg>
                              <p style={{ color: "var(--color-primary)", fontWeight: 500 }}>{flag.action}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )
      )}

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div
          className="rounded-xl px-5 py-4"
          style={{ backgroundColor: "var(--color-secondary)", border: "1.5px solid var(--color-primary)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="var(--color-primary)" strokeWidth="1.5" />
              <path d="M9 5.5v4M9 11.5v1" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-sm font-bold" style={{ color: "var(--color-primary)", fontFamily: "var(--font-sans)" }}>
              Doctor&apos;s Recommended Follow-Ups
            </p>
          </div>
          <ul className="grid gap-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--color-foreground)" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M3 8l3 3 7-7" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p
        className="text-xs text-center"
        style={{ color: "var(--color-muted-foreground)", lineHeight: "1.6" }}
      >
        ⚠️ This AI analysis is generated from your intake responses and is for clinical reference only.
        It does not constitute a diagnosis. Your doctor will make all final clinical decisions.
      </p>
    </div>
  );
}
