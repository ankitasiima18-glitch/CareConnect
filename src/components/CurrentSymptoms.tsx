import { PatientData } from "../App";
import { FormField, Textarea, Select, CheckboxGroup, SectionHeader, NavButtons } from "./FormField";

type Props = {
  data: PatientData;
  onChange: (v: Partial<PatientData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const COMMON_SYMPTOMS = [
  "Fever",
  "Chills",
  "Night Sweats",
  "Cough (dry)",
  "Cough (with phlegm)",
  "Coughing blood",
  "Shortness of breath",
  "Wheezing",
  "Chest pain",
  "Chest tightness",
  "Palpitations / Fast heartbeat",
  "Fatigue / Weakness",
  "Sudden weight loss",
  "Sudden weight gain",
  "Loss of appetite",
  "Increased thirst",
  "Frequent urination",
  "Headache",
  "Migraine",
  "Dizziness / Lightheadedness",
  "Fainting",
  "Confusion / Memory issues",
  "Difficulty speaking",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Constipation",
  "Blood in stool",
  "Abdominal pain",
  "Bloating / Gas",
  "Heartburn / Acid reflux",
  "Difficulty swallowing",
  "Yellowing of skin / Jaundice",
  "Joint pain",
  "Muscle pain / Cramps",
  "Swelling in legs / Feet",
  "Back pain",
  "Neck pain / Stiffness",
  "Numbness / Tingling",
  "Tremors / Shaking",
  "Skin rash",
  "Itching",
  "Acne / Skin lesions",
  "Hair loss",
  "Vision changes / Blurred vision",
  "Eye redness / Discharge",
  "Ear pain",
  "Hearing loss / Ringing",
  "Runny / Blocked nose",
  "Sore throat",
  "Mouth ulcers",
  "Toothache",
  "Painful urination",
  "Blood in urine",
  "Irregular periods",
  "Pelvic pain",
  "Vaginal discharge",
  "Erectile dysfunction",
  "Anxiety / Panic attacks",
  "Depressed mood",
  "Sleep disturbances / Insomnia",
  "None at this time",
];

const PAIN_LABELS = [
  "No pain",
  "Minimal",
  "Mild",
  "Moderate",
  "Moderate–Severe",
  "Severe",
  "Very Severe",
  "Intense",
  "Extreme",
  "Unbearable",
  "Worst possible",
];

export default function CurrentSymptoms({ data, onChange, onNext, onBack }: Props) {
  return (
    <div>
      <SectionHeader
        title="Current Symptoms"
        description="Describe what has brought you in today."
      />
      <div className="p-6 grid gap-6">
        <FormField label="Primary Reason for Visit" required>
          <Textarea
            value={data.reasonForVisit}
            onChange={(v) => onChange({ reasonForVisit: v })}
            placeholder="e.g. Follow-up for blood pressure, sharp left knee pain started 3 days ago, annual physical exam..."
            rows={3}
          />
        </FormField>

        <FormField label="Current Symptoms (select all that apply)">
          <CheckboxGroup
            options={COMMON_SYMPTOMS}
            selected={data.symptoms}
            onChange={(v) => onChange({ symptoms: v })}
          />
        </FormField>

        {/* Pain scale */}
        <FormField label="Pain Level (0 = none, 10 = worst imaginable)">
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <span
                className="text-3xl font-bold tabular-nums"
                style={{
                  fontFamily: "var(--font-sans)",
                  color:
                    data.painLevel === 0
                      ? "var(--color-accent)"
                      : data.painLevel <= 3
                      ? "#16a34a"
                      : data.painLevel <= 6
                      ? "var(--color-warning)"
                      : "var(--color-danger)",
                  minWidth: "2rem",
                }}
              >
                {data.painLevel}
              </span>
              <span className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                {PAIN_LABELS[data.painLevel]}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={data.painLevel}
              onChange={(e) => onChange({ painLevel: Number(e.target.value) })}
              className="w-full"
              style={{
                accentColor:
                  data.painLevel <= 3
                    ? "#16a34a"
                    : data.painLevel <= 6
                    ? "#d97706"
                    : "#dc2626",
                height: "6px",
              }}
            />
            <div
              className="flex justify-between text-xs"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              <span>0 — No pain</span>
              <span>5 — Moderate</span>
              <span>10 — Severe</span>
            </div>
          </div>
        </FormField>

        <FormField label="How long have you had these symptoms?">
          <Select
            value={data.symptomDuration}
            onChange={(v) => onChange({ symptomDuration: v })}
            placeholder="Select duration..."
            options={[
              { value: "today", label: "Started today" },
              { value: "few_days", label: "2–3 days" },
              { value: "week", label: "About a week" },
              { value: "two_weeks", label: "1–2 weeks" },
              { value: "month", label: "About a month" },
              { value: "months", label: "Several months" },
              { value: "year", label: "Over a year" },
              { value: "chronic", label: "Chronic / ongoing" },
              { value: "na", label: "Not applicable (routine visit)" },
            ]}
          />
        </FormField>

        <FormField
          label="Additional Notes for the Doctor"
          hint="Any other concerns, recent travel, dietary changes, or anything else you'd like your doctor to know."
        >
          <Textarea
            value={data.additionalNotes}
            onChange={(v) => onChange({ additionalNotes: v })}
            placeholder="Optional — anything you want your doctor to be aware of before your appointment."
            rows={3}
          />
        </FormField>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Review My Information" />
    </div>
  );
}
