import { useState } from "react";
import Welcome from "./components/Welcome";
import PersonalInfo from "./components/PersonalInfo";
import MedicalHistory from "./components/MedicalHistory";
import Medications from "./components/Medications";
import CurrentSymptoms from "./components/CurrentSymptoms";
import Documents from "./components/Documents";
import ReviewSubmit from "./components/ReviewSubmit";
import Confirmation from "./components/Confirmation";

export type PatientData = {
  // Personal Info
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;

  // Medical History
  conditions: string[];
  allergies: string;
  surgeries: string;
  familyHistory: string[];
  smokingStatus: string;
  alcoholUse: string;

  // Medications
  medications: { name: string; dose: string; frequency: string }[];

  // Symptoms
  reasonForVisit: string;
  symptoms: string[];
  painLevel: number;
  symptomDuration: string;
  additionalNotes: string;

  // Documents
  documents: unknown[];
};

const INITIAL_DATA: PatientData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  conditions: [],
  allergies: "",
  surgeries: "",
  familyHistory: [],
  smokingStatus: "",
  alcoholUse: "",
  medications: [],
  reasonForVisit: "",
  symptoms: [],
  painLevel: 0,
  symptomDuration: "",
  additionalNotes: "",
  documents: [],
};

const STEPS = [
  { label: "Personal Info", short: "Personal" },
  { label: "Medical History", short: "History" },
  { label: "Medications", short: "Medications" },
  { label: "Symptoms", short: "Symptoms" },
  { label: "Documents", short: "Docs" },
  { label: "Review", short: "Review" },
];

export default function App() {
  const [onWelcome, setOnWelcome] = useState(true);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<PatientData>(INITIAL_DATA);
  const [submitted, setSubmitted] = useState(false);

  const updateData = (partial: Partial<PatientData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const goHome = () => {
    setOnWelcome(true);
    setSubmitted(false);
    setStep(0);
    setData(INITIAL_DATA);
  };

  if (onWelcome) {
    return <Welcome onStart={() => setOnWelcome(false)} />;
  }

  if (submitted) {
    return <Confirmation patientName={`${data.firstName} ${data.lastName}`} patientData={data} onGoHome={goHome} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
      {/* Header */}
      <header
        style={{ backgroundColor: "var(--color-primary)", boxShadow: "0 2px 8px rgba(26,79,138,0.3)" }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <MedicalCrossIcon />
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
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
              Today&apos;s Date
            </p>
            <p className="text-sm font-medium" style={{ color: "#ffffff" }}>
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{ backgroundColor: "var(--color-primary-light)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center flex-1">
                <button
                  onClick={() => i < step && setStep(i)}
                  className="flex items-center gap-1.5 flex-1"
                  style={{ cursor: i < step ? "pointer" : "default" }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all duration-200"
                    style={{
                      backgroundColor:
                        i === step
                          ? "#ffffff"
                          : i < step
                          ? "var(--color-accent)"
                          : "rgba(255,255,255,0.2)",
                      color:
                        i === step
                          ? "var(--color-primary)"
                          : i < step
                          ? "#ffffff"
                          : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {i < step ? <CheckIcon size={12} /> : i + 1}
                  </div>
                  <span
                    className="text-xs font-medium hidden sm:block"
                    style={{
                      color:
                        i === step
                          ? "#ffffff"
                          : i < step
                          ? "rgba(255,255,255,0.9)"
                          : "rgba(255,255,255,0.45)",
                    }}
                  >
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className="h-0.5 flex-1 mx-1 rounded transition-all duration-300"
                    style={{
                      backgroundColor:
                        i < step ? "var(--color-accent)" : "rgba(255,255,255,0.2)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div
          className="rounded-xl overflow-hidden"
          style={{
            backgroundColor: "var(--color-card)",
            boxShadow: "0 4px 24px rgba(15,31,53,0.08), 0 1px 4px rgba(15,31,53,0.04)",
          }}
        >
          {step === 0 && (
            <PersonalInfo data={data} onChange={updateData} onNext={next} />
          )}
          {step === 1 && (
            <MedicalHistory data={data} onChange={updateData} onNext={next} onBack={back} />
          )}
          {step === 2 && (
            <Medications data={data} onChange={updateData} onNext={next} onBack={back} />
          )}
          {step === 3 && (
            <CurrentSymptoms data={data} onChange={updateData} onNext={next} onBack={back} />
          )}
          {step === 4 && (
            <Documents data={data} onChange={updateData} onNext={next} onBack={back} />
          )}
          {step === 5 && (
            <ReviewSubmit data={data} onBack={back} onSubmit={handleSubmit} onEdit={setStep} />
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "var(--color-muted-foreground)" }}>
          Your information is protected under HIPAA. All data is encrypted and secure.
        </p>
      </main>
    </div>
  );
}

function MedicalCrossIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="7" y="2" width="6" height="16" rx="2" fill="white" />
      <rect x="2" y="7" width="16" height="6" rx="2" fill="white" />
    </svg>
  );
}

function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8l3.5 3.5L13 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
