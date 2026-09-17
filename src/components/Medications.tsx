import { useState } from "react";
import { PatientData } from "../App";
import { FormField, Input, Select, SectionHeader, NavButtons } from "./FormField";

type Props = {
  data: PatientData;
  onChange: (v: Partial<PatientData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const FREQUENCY_OPTIONS = [
  { value: "once_daily", label: "Once daily" },
  { value: "twice_daily", label: "Twice daily" },
  { value: "three_daily", label: "3× daily" },
  { value: "four_daily", label: "4× daily" },
  { value: "as_needed", label: "As needed" },
  { value: "weekly", label: "Weekly" },
  { value: "other", label: "Other" },
];

export default function Medications({ data, onChange, onNext, onBack }: Props) {
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [frequency, setFrequency] = useState("");

  const addMed = () => {
    if (!name.trim()) return;
    onChange({
      medications: [...data.medications, { name: name.trim(), dose: dose.trim(), frequency }],
    });
    setName("");
    setDose("");
    setFrequency("");
  };

  const removeMed = (i: number) => {
    onChange({ medications: data.medications.filter((_, idx) => idx !== i) });
  };

  return (
    <div>
      <SectionHeader
        title="Current Medications"
        description="List all prescription and over-the-counter medications you currently take."
      />
      <div className="p-6 grid gap-6">
        {/* Existing medications */}
        {data.medications.length > 0 && (
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" }}
            >
              Added Medications ({data.medications.length})
            </p>
            <div className="grid gap-2">
              {data.medications.map((med, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3 rounded-lg"
                  style={{
                    backgroundColor: "var(--color-secondary)",
                    border: "1.5px solid var(--color-primary)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      <PillIcon />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                        {med.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                        {[med.dose, FREQUENCY_OPTIONS.find((f) => f.value === med.frequency)?.label]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeMed(i)}
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                    style={{ color: "var(--color-muted-foreground)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--color-danger)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-muted-foreground)")
                    }
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2 2l10 10M12 2L2 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add medication */}
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: "#f8fbff", border: "1.5px dashed var(--color-border)" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" }}
          >
            Add Medication
          </p>
          <div className="grid gap-3">
            <FormField label="Medication Name">
              <Input
                value={name}
                onChange={setName}
                placeholder="e.g. Metformin, Lisinopril, Aspirin"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Dosage">
                <Input value={dose} onChange={setDose} placeholder="e.g. 500mg, 10mg" />
              </FormField>
              <FormField label="Frequency">
                <Select
                  value={frequency}
                  onChange={setFrequency}
                  placeholder="Select..."
                  options={FREQUENCY_OPTIONS}
                />
              </FormField>
            </div>
            <button
              onClick={addMed}
              disabled={!name.trim()}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150"
              style={{
                backgroundColor: name.trim() ? "var(--color-primary)" : "var(--color-muted)",
                color: name.trim() ? "#ffffff" : "var(--color-muted-foreground)",
                cursor: name.trim() ? "pointer" : "not-allowed",
                fontFamily: "var(--font-sans)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3v10M3 8h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Add Medication
            </button>
          </div>
        </div>

        {data.medications.length === 0 && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm"
            style={{
              backgroundColor: "#fffbeb",
              border: "1px solid #fcd34d",
              color: "#92400e",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path
                d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v4M8 11v.5"
                stroke="#d97706"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            If you take no medications, you may continue without adding any.
          </div>
        )}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Continue to Symptoms" />
    </div>
  );
}

function PillIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect
        x="2"
        y="5"
        width="10"
        height="4"
        rx="2"
        stroke="white"
        strokeWidth="1.5"
      />
      <path d="M7 5v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
