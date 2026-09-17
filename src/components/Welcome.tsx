type Props = {
  onStart: () => void;
};

export default function Welcome({ onStart }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Header */}
      <header style={{ backgroundColor: "var(--color-primary)", boxShadow: "0 2px 8px rgba(26,79,138,0.3)" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="7" y="2" width="6" height="16" rx="2" fill="white" />
              <rect x="2" y="7" width="16" height="6" rx="2" fill="white" />
            </svg>
          </div>
          <div>
            <h1
              className="text-xl font-bold tracking-tight leading-none"
              style={{ fontFamily: "var(--font-sans)", color: "#ffffff" }}
            >
              CareConnect
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>
              Patient Intake Portal
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Today</p>
            <p className="text-sm font-medium" style={{ color: "#ffffff" }}>
              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div
        className="py-16 px-6 text-center"
        style={{
          background: "linear-gradient(160deg, var(--color-primary) 0%, #1e6fbf 60%, #0ea5e9 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            Digital Patient Intake
          </div>
          <h2
            className="text-4xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-sans)", color: "#ffffff" }}
          >
            Welcome to CareConnect
          </h2>
          <p
            className="text-lg mb-8 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.82)" }}
          >
            Complete your patient intake form before meeting your doctor. It takes about
            5–8 minutes and helps us provide better, faster care.
          </p>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all duration-200"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "#ffffff",
              fontFamily: "var(--font-sans)",
              boxShadow: "0 4px 20px rgba(0,168,120,0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#00936a";
              e.currentTarget.style.boxShadow = "0 6px 28px rgba(0,168,120,0.5)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-accent)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,168,120,0.4)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Begin Intake Form
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 9h10M9 4l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            Your data is encrypted and HIPAA-compliant
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h3
            className="text-center text-lg font-semibold mb-8"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-foreground)" }}
          >
            What to expect
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                icon: "👤",
                title: "Personal Info",
                desc: "Basic details, contact, and insurance information.",
              },
              {
                step: "02",
                icon: "🩺",
                title: "Medical History",
                desc: "Past conditions, allergies, family history, and lifestyle.",
              },
              {
                step: "03",
                icon: "💊",
                title: "Medications",
                desc: "All current prescriptions and over-the-counter drugs.",
              },
              {
                step: "04",
                icon: "📋",
                title: "Symptoms",
                desc: "Reason for today's visit and current symptoms.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl p-5 flex flex-col gap-3"
                style={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 2px 8px rgba(15,31,53,0.05)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <span
                    className="text-xs font-bold tabular-nums"
                    style={{ color: "var(--color-primary)", fontFamily: "var(--font-sans)", opacity: 0.4 }}
                  >
                    {item.step}
                  </span>
                </div>
                <div>
                  <p
                    className="font-semibold text-sm mb-1"
                    style={{ fontFamily: "var(--font-sans)", color: "var(--color-foreground)" }}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Info strip */}
          <div
            className="mt-8 rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center gap-4 text-sm"
            style={{
              backgroundColor: "var(--color-secondary)",
              border: "1.5px solid var(--color-primary)",
            }}
          >
            <div className="flex items-center gap-2 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="var(--color-primary)" strokeWidth="1.5" />
                <path d="M10 6v5M10 13v1" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="font-semibold" style={{ color: "var(--color-primary)", fontFamily: "var(--font-sans)" }}>
                Before you start
              </span>
            </div>
            <p style={{ color: "var(--color-foreground)" }}>
              Please have your <strong>insurance card</strong>, <strong>photo ID</strong>, and a list of your current
              medications ready. The form takes approximately <strong>5–8 minutes</strong> to complete.
            </p>
          </div>
        </div>
      </div>

      <footer
        className="py-4 text-center text-xs"
        style={{ color: "var(--color-muted-foreground)", borderTop: "1px solid var(--color-border)" }}
      >
        © {new Date().getFullYear()} CareConnect · Patient Intake Portal · Protected under HIPAA
      </footer>
    </div>
  );
}
