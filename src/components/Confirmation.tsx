import { useEffect, useState } from "react";
import { PatientData } from "../App";
import AIAnalysis from "./AIAnalysis";
import { analyzePatientData } from "../utils/aiAnalysis";

type Props = {
  patientName: string;
  patientData: PatientData;
  onGoHome: () => void;
};

export default function Confirmation({
  patientName,
  patientData,
  onGoHome,
}: Props) {
  const [activeTab, setActiveTab] = useState<"summary" | "analysis">(
    "summary"
  );

  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const confirmationCode = `CC-${Math.floor(
    10000 + Math.random() * 90000
  )}`;

  const analysisResult = analyzePatientData(patientData);

  // Connect to Gemini AI backend
  useEffect(() => {
    let cancelled = false;

    setAiLoading(true);
    setAiError("");

    fetch("http://localhost:3001/api/ai-summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientData,
      }),
    })
      .then(async (response) => {
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "AI request failed");
        }

        return result;
      })
      .then((result) => {
        if (!cancelled) {
          setAiSummary(result.summary || "");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setAiError(error.message || "AI summary unavailable");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setAiLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [patientData]);

  const now = new Date();

  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const dateStr = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const riskColor =
    analysisResult.overallRisk === "high"
      ? "#dc2626"
      : analysisResult.overallRisk === "moderate"
        ? "#d97706"
        : "#16a34a";

  const riskLabel =
    analysisResult.overallRisk === "high"
      ? "High Risk"
      : analysisResult.overallRisk === "moderate"
        ? "Moderate"
        : "Low Risk";

  /*
   * Formats Gemini's plain-text response into readable sections.
   */
  const formatAISummary = (text: string) => {
    const lines = text.split("\n");

    return (
      <div className="space-y-6">
        {lines.map((line, index) => {
          const trimmed = line.trim();

          if (!trimmed) {
            return null;
          }

          // Section headings
          const isHeading =
            trimmed === "KEY INTAKE SUMMARY" ||
            trimmed === "ITEMS FOR CLINICIAN ATTENTION" ||
            trimmed === "QUESTIONS TO CONSIDER";

          if (isHeading) {
            return (
              <div key={index} className="pt-1">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />

                  <h4 className="text-sm font-bold uppercase tracking-wide text-gray-800">
                    {trimmed}
                  </h4>
                </div>
              </div>
            );
          }

          // Lines containing "Label: Value"
          if (trimmed.includes(":")) {
            const colonIndex = trimmed.indexOf(":");
            const label = trimmed.slice(0, colonIndex).trim();
            const value = trimmed.slice(colonIndex + 1).trim();

            return (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">
                  {label}
                </p>

                <p className="break-words text-sm leading-6 text-gray-700">
                  {value}
                </p>
              </div>
            );
          }

          // Normal AI text
          return (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <p className="break-words text-sm leading-6 text-gray-700">
                {trimmed}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "var(--color-primary)",
          boxShadow: "0 2px 8px rgba(26,79,138,0.3)",
        }}
      >
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect
                x="7"
                y="2"
                width="6"
                height="16"
                rx="2"
                fill="white"
              />
              <rect
                x="2"
                y="7"
                width="16"
                height="6"
                rx="2"
                fill="white"
              />
            </svg>
          </div>

          <div>
            <h1
              className="text-xl font-bold leading-none tracking-tight"
              style={{
                fontFamily: "var(--font-sans)",
                color: "#ffffff",
              }}
            >
              CareConnect
            </h1>

            <p
              className="mt-0.5 text-xs"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Patient Intake Portal
            </p>
          </div>

          <button
            onClick={onGoHome}
            className="ml-auto flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.25)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.15)")
            }
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2L2 7h2v6h4v-4h2v4h4V7h2L8 2z"
                stroke="white"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>

            Home
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-4xl gap-6 px-4 py-8">
        {/* Submitted Banner */}
        <div
          className="flex items-center gap-4 rounded-xl p-5"
          style={{
            backgroundColor: "var(--color-card)",
            boxShadow: "0 4px 24px rgba(15,31,53,0.08)",
            borderTop: "4px solid var(--color-accent)",
          }}
        >
          <div
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor: "rgba(0,168,120,0.1)",
              border: "3px solid var(--color-accent)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M5 14l6 6L23 8"
                stroke="var(--color-accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <h2
              className="text-lg font-bold"
              style={{
                fontFamily: "var(--font-sans)",
                color: "var(--color-foreground)",
              }}
            >
              You&apos;re all checked in, {patientName || "Patient"}!
            </h2>

            <p
              className="text-sm"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              Submitted {dateStr} at {timeStr}
            </p>
          </div>

          <div className="hidden text-right sm:block">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              Confirmation
            </p>

            <p
              className="text-lg font-bold tracking-widest"
              style={{
                color: "var(--color-primary)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {confirmationCode}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div
          className="overflow-hidden rounded-xl"
          style={{
            backgroundColor: "var(--color-card)",
            boxShadow: "0 4px 24px rgba(15,31,53,0.08)",
          }}
        >
          {/* Tabs */}
          <div
            className="flex overflow-x-auto"
            style={{ borderBottom: "2px solid var(--color-muted)" }}
          >
            {/* Next Steps */}
            <button
              onClick={() => setActiveTab("summary")}
              className="flex flex-shrink-0 items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-all"
              style={{
                borderBottom:
                  activeTab === "summary"
                    ? "2px solid var(--color-primary)"
                    : "2px solid transparent",
                marginBottom: "-2px",
                color:
                  activeTab === "summary"
                    ? "var(--color-primary)"
                    : "var(--color-muted-foreground)",
                fontFamily: "var(--font-sans)",
                backgroundColor: "transparent",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 4h12M2 8h8M2 12h5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>

              Next Steps
            </button>

            {/* AI Analysis */}
            <button
              onClick={() => setActiveTab("analysis")}
              className="flex flex-shrink-0 items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-all"
              style={{
                borderBottom:
                  activeTab === "analysis"
                    ? "2px solid var(--color-primary)"
                    : "2px solid transparent",
                marginBottom: "-2px",
                color:
                  activeTab === "analysis"
                    ? "var(--color-primary)"
                    : "var(--color-muted-foreground)",
                fontFamily: "var(--font-sans)",
                backgroundColor: "transparent",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                <path
                  d="M5 8l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              AI Health Analysis

              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold"
                style={{
                  backgroundColor: riskColor,
                  color: "#ffffff",
                }}
              >
                {riskLabel}
              </span>
            </button>
          </div>

          <div className="p-6">
            {/* Next Steps */}
            {activeTab === "summary" && (
              <div className="grid gap-4">
                <p
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{
                    color: "var(--color-muted-foreground)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  What happens next
                </p>

                {[
                  {
                    icon: "👩‍⚕️",
                    title: "You will be called shortly",
                    desc: "A nurse will call your name to escort you to the exam room.",
                  },
                  {
                    icon: "📋",
                    title: "Doctor reviews your form",
                    desc: "Your doctor will review this intake form and the AI analysis before your consultation.",
                  },
                  {
                    icon: "🪪",
                    title: "Please have ready",
                    desc: "Bring your insurance card and a valid photo ID to the front desk.",
                  },
                  {
                    icon: "🔔",
                    title: "AI analysis prepared",
                    desc: "Important information from your intake has been organized for clinician review.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl p-4"
                    style={{
                      backgroundColor: "var(--color-secondary)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <span className="flex-shrink-0 text-xl">
                      {item.icon}
                    </span>

                    <div>
                      <p
                        className="mb-0.5 text-sm font-semibold"
                        style={{
                          color: "var(--color-foreground)",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {item.title}
                      </p>

                      <p
                        className="text-sm"
                        style={{
                          color: "var(--color-muted-foreground)",
                          lineHeight: "1.6",
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="flex justify-center pt-2">
                  <button
                    onClick={onGoHome}
                    className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200"
                    style={{
                      border: "1.5px solid var(--color-primary)",
                      color: "var(--color-primary)",
                      backgroundColor: "transparent",
                      fontFamily: "var(--font-sans)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--color-primary)";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "transparent";
                      e.currentTarget.style.color =
                        "var(--color-primary)";
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M8 2L2 7h2v6h4v-4h2v4h4V7h2L8 2z"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinejoin="round"
                      />
                    </svg>

                    Return to Home Page
                  </button>
                </div>
              </div>
            )}

            {/* Structured AI Analysis */}
            {activeTab === "analysis" && (
              <AIAnalysis result={analysisResult} />
            )}

            {/* Gemini AI */}
            {activeTab === "analysis" && (
              <div className="mt-6 rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100">
                      <span className="text-xl">✨</span>
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-gray-900">
                        AI Clinical Summary
                      </h3>

                      <p className="text-xs text-gray-500">
                        Gemini-powered intake review
                      </p>
                    </div>
                  </div>

                  <span className="flex-shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    AI Generated
                  </span>
                </div>

                {/* Loading */}
                {aiLoading && (
                  <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-5">
                    <div className="h-5 w-5 flex-shrink-0 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />

                    <div>
                      <p className="font-medium text-gray-800">
                        Analyzing patient intake...
                      </p>

                      <p className="text-sm text-gray-500">
                        Gemini is preparing a clinical summary.
                      </p>
                    </div>
                  </div>
                )}

                {/* Error */}
                {aiError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="font-medium text-red-700">
                      AI summary unavailable
                    </p>

                    <p className="mt-1 break-words text-sm text-red-600">
                      {aiError}
                    </p>
                  </div>
                )}

                {/* Gemini Result */}
                {!aiLoading && !aiError && aiSummary && (
                  <div>
                    {/* Summary Content */}
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                      {formatAISummary(aiSummary)}
                    </div>

                    {/* Quick Information */}
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Pain Level
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {patientData.painLevel}/10
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Symptoms
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {patientData.symptoms?.length || 0}
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Conditions
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {patientData.conditions?.length || 0}
                        </p>
                      </div>
                    </div>

                    {/* Clinician Notice */}
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <div className="flex gap-3">
                        <span className="flex-shrink-0 text-lg">⚠️</span>

                        <div>
                          <p className="text-sm font-semibold text-amber-900">
                            Clinician Review Required
                          </p>

                          <p className="mt-1 text-xs leading-5 text-amber-800">
                            This AI summary is based only on information
                            provided in the patient intake form. It supports
                            clinician review and is not a diagnosis or
                            treatment recommendation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <p className="mt-5 text-center text-xs text-gray-400">
                  Powered by Gemini AI • For clinical reference only
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}