import { PatientData } from "../App";
import { FormField, Textarea, Select, CheckboxGroup, SectionHeader, NavButtons } from "./FormField";

type Props = {
  data: PatientData;
  onChange: (v: Partial<PatientData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const CHRONIC_CONDITIONS = [
  "Diabetes (Type 1)",
  "Diabetes (Type 2)",
  "Pre-Diabetes",
  "Hypertension",
  "Low Blood Pressure",
  "Heart Disease",
  "Heart Failure",
  "Coronary Artery Disease",
  "Arrhythmia / Irregular Heartbeat",
  "Asthma",
  "COPD",
  "Tuberculosis (TB)",
  "Arthritis (Osteoarthritis)",
  "Rheumatoid Arthritis",
  "Gout",
  "Thyroid Disorder (Hypo)",
  "Thyroid Disorder (Hyper)",
  "Depression",
  "Anxiety",
  "Bipolar Disorder",
  "Schizophrenia",
  "ADHD",
  "Cancer (current/history)",
  "Kidney Disease / CKD",
  "Kidney Stones",
  "Liver Disease",
  "Hepatitis B",
  "Hepatitis C",
  "Fatty Liver Disease (NAFLD)",
  "Epilepsy / Seizure Disorder",
  "Stroke (history)",
  "Migraine",
  "Parkinson's Disease",
  "Multiple Sclerosis",
  "Alzheimer's / Dementia",
  "Osteoporosis",
  "Anemia (Iron deficiency)",
  "Sickle Cell Disease",
  "Thalassemia",
  "Lupus",
  "HIV / AIDS",
  "Polycystic Ovary Syndrome (PCOS)",
  "Endometriosis",
  "Celiac Disease",
  "Crohn's Disease",
  "Ulcerative Colitis",
  "Irritable Bowel Syndrome (IBS)",
  "Gastroesophageal Reflux (GERD)",
  "Peptic Ulcer",
  "Pancreatitis",
  "Obesity / Metabolic Syndrome",
  "Sleep Apnea",
  "Deep Vein Thrombosis (DVT)",
  "None of the above",
];

const FAMILY_CONDITIONS = [
  "Heart Disease",
  "Heart Attack",
  "Hypertension",
  "Diabetes (Type 1)",
  "Diabetes (Type 2)",
  "Stroke",
  "Cancer (specify in notes)",
  "Breast Cancer",
  "Colon / Colorectal Cancer",
  "Lung Cancer",
  "Cervical Cancer",
  "Prostate Cancer",
  "Kidney Disease",
  "Liver Disease",
  "Thyroid Disorder",
  "Mental Health (Depression)",
  "Mental Health (Bipolar)",
  "Alzheimer's / Dementia",
  "Parkinson's Disease",
  "Epilepsy",
  "Sickle Cell Disease",
  "Thalassemia",
  "Autoimmune Disorder",
  "Tuberculosis",
  "Obesity",
  "None known",
];

export default function MedicalHistory({ data, onChange, onNext, onBack }: Props) {
  return (
    <div>
      <SectionHeader
        title="Medical History"
        description="Tell us about your past and current health conditions."
      />
      <div className="p-6 grid gap-6">
        <FormField label="Current or Past Medical Conditions">
          <CheckboxGroup
            options={CHRONIC_CONDITIONS}
            selected={data.conditions}
            onChange={(v) => onChange({ conditions: v })}
          />
        </FormField>

        <FormField
          label="Known Allergies"
          hint="Include drug, food, and environmental allergies. Write 'None' if not applicable."
        >
          <Textarea
            value={data.allergies}
            onChange={(v) => onChange({ allergies: v })}
            placeholder="e.g. Penicillin (hives), Shellfish (anaphylaxis), Latex (rash)"
            rows={3}
          />
        </FormField>

        <FormField
          label="Previous Surgeries or Hospitalizations"
          hint="Include approximate year and reason."
        >
          <Textarea
            value={data.surgeries}
            onChange={(v) => onChange({ surgeries: v })}
            placeholder="e.g. Appendectomy (2018), Knee replacement (2022)"
            rows={3}
          />
        </FormField>

        <FormField label="Family Medical History (select all that apply)">
          <CheckboxGroup
            options={FAMILY_CONDITIONS}
            selected={data.familyHistory}
            onChange={(v) => onChange({ familyHistory: v })}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Smoking / Tobacco Use">
            <Select
              value={data.smokingStatus}
              onChange={(v) => onChange({ smokingStatus: v })}
              placeholder="Select..."
              options={[
                { value: "never", label: "Never smoked" },
                { value: "former", label: "Former smoker" },
                { value: "current_light", label: "Current — occasional" },
                { value: "current_heavy", label: "Current — daily" },
              ]}
            />
          </FormField>
          <FormField label="Alcohol Use">
            <Select
              value={data.alcoholUse}
              onChange={(v) => onChange({ alcoholUse: v })}
              placeholder="Select..."
              options={[
                { value: "none", label: "None" },
                { value: "social", label: "Social / Occasional" },
                { value: "moderate", label: "Moderate (1–2 drinks/day)" },
                { value: "heavy", label: "Heavy (3+ drinks/day)" },
              ]}
            />
          </FormField>
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Continue to Medications" />
    </div>
  );
}
