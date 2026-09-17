import { PatientData } from "../App";
import { SectionHeader } from "./FormField";

type Props = {
  data: PatientData;
  onBack: () => void;
  onSubmit: () => void;
  onEdit: (step: number) => void;
};

export default function ReviewSubmit({ data, onBack, onSubmit, onEdit }: Props) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "—";

  return (
    <div>
      <SectionHeader
        title="Review Your Information"
        description="Please review all details before submitting. You can go back to edit any section."
      />
      <div className="p-6 grid gap-6">
        <ReviewSection
          title="Personal Information"
          onEdit={() => onEdit(0)}
        >
          <ReviewGrid>
            <ReviewItem label="Full Name" value={fullName} />
            <ReviewItem
              label="Date of Birth"
              value={
                data.dateOfBirth
                  ? new Date(data.dateOfBirth + "T00:00:00").toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"
              }
            />
            <ReviewItem label="Sex" value={capitalize(data.gender) || "—"} />
            <ReviewItem label="Phone" value={data.phone || "—"} />
            <ReviewItem label="Email" value={data.email || "—"} />
            <ReviewItem label="Address" value={data.address || "—"} />
            <ReviewItem
              label="Emergency Contact"
              value={
                data.emergencyContactName
                  ? `${data.emergencyContactName} · ${data.emergencyContactPhone}`
                  : "—"
              }
            />
            <ReviewItem
              label="Insurance"
              value={
                data.insuranceProvider
                  ? `${capitalize(data.insuranceProvider)}${
                      data.insurancePolicyNumber ? ` · ${data.insurancePolicyNumber}` : ""
                    }`
                  : "—"
              }
            />
          </ReviewGrid>
        </ReviewSection>

        <ReviewSection title="Medical History" onEdit={() => onEdit(1)}>
          <ReviewGrid>
            <ReviewItem
              label="Conditions"
              value={data.conditions.length ? data.conditions.join(", ") : "None reported"}
            />
            <ReviewItem label="Allergies" value={data.allergies || "None reported"} />
            <ReviewItem
              label="Surgeries / Hospitalizations"
              value={data.surgeries || "None reported"}
            />
            <ReviewItem
              label="Family History"
              value={data.familyHistory.length ? data.familyHistory.join(", ") : "None known"}
            />
            <ReviewItem
              label="Smoking Status"
              value={SMOKING_LABELS[data.smokingStatus] || "—"}
            />
            <ReviewItem label="Alcohol Use" value={ALCOHOL_LABELS[data.alcoholUse] || "—"} />
          </ReviewGrid>
        </ReviewSection>

        <ReviewSection title="Medications" onEdit={() => onEdit(2)}>
          {data.medications.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
              No medications listed
            </p>
          ) : (
            <div className="grid gap-2">
              {data.medications.map((med, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{ backgroundColor: "var(--color-secondary)" }}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  />
                  <span className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                    {med.name}
                  </span>
                  {med.dose && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "var(--color-muted)",
                        color: "var(--color-muted-foreground)",
                      }}
                    >
                      {med.dose}
                    </span>
                  )}
                  {med.frequency && (
                    <span className="text-xs ml-auto" style={{ color: "var(--color-muted-foreground)" }}>
                      {FREQ_LABELS[med.frequency] || med.frequency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </ReviewSection>

        <ReviewSection title="Symptoms & Reason for Visit" onEdit={() => onEdit(3)}>
          <ReviewGrid>
            <ReviewItem
              label="Reason for Visit"
              value={data.reasonForVisit || "Not specified"}
              wide
            />
            <ReviewItem
              label="Symptoms"
              value={data.symptoms.length ? data.symptoms.join(", ") : "None selected"}
              wide
            />
            <ReviewItem label="Pain Level" value={`${data.painLevel} / 10`} />
            <ReviewItem label="Duration" value={DURATION_LABELS[data.symptomDuration] || "—"} />
            {data.additionalNotes && (
              <ReviewItem label="Additional Notes" value={data.additionalNotes} wide />
            )}
          </ReviewGrid>
        </ReviewSection>

        {/* Consent */}
        <div
          className="rounded-lg p-4 text-sm"
          style={{
            backgroundColor: "#eff6ff",
            border: "1px solid #bfdbfe",
            color: "#1e40af",
          }}
        >
          <p className="font-semibold mb-1" style={{ fontFamily: "var(--font-sans)" }}>
            Patient Consent &amp; Acknowledgment
          </p>
          <p style={{ color: "#3b82f6", lineHeight: "1.6" }}>
            By submitting this form, I confirm that the information provided is accurate and complete
            to the best of my knowledge. I consent to the treatment and understand my information
            will be handled in accordance with HIPAA privacy regulations.
          </p>
        </div>
      </div>

      {/* Submit */}
      <div
        className="flex justify-between items-center px-6 py-4"
        style={{ borderTop: "1px solid var(--color-muted)" }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
          style={{
            border: "1.5px solid var(--color-border)",
            color: "var(--color-muted-foreground)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-primary)";
            e.currentTarget.style.color = "var(--color-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.color = "var(--color-muted-foreground)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <button
          onClick={onSubmit}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "#ffffff",
            fontFamily: "var(--font-sans)",
            boxShadow: "0 2px 8px rgba(0,168,120,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#00936a";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,168,120,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-accent)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,168,120,0.3)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Submit Intake Form
        </button>
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  children,
  onEdit,
}: {
  title: string;
  children: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: "1px solid var(--color-border)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: "var(--color-secondary)", borderBottom: "1px solid var(--color-border)" }}
      >
        <h3
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-sans)", color: "var(--color-primary)" }}
        >
          {title}
        </h3>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded transition-all"
          style={{
            color: "var(--color-primary)",
            border: "1px solid var(--color-primary)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-primary)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--color-primary)";
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 8.5L3.5 10 10 3.5 8.5 2 2 8.5z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
          Edit
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ReviewGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>;
}

function ReviewItem({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <p
        className="text-xs font-medium uppercase tracking-wide mb-0.5"
        style={{ color: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" }}
      >
        {label}
      </p>
      <p className="text-sm" style={{ color: "var(--color-foreground)", lineHeight: "1.5" }}>
        {value}
      </p>
    </div>
  );
}

function capitalize(s: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
}

const SMOKING_LABELS: Record<string, string> = {
  never: "Never smoked",
  former: "Former smoker",
  current_light: "Current — occasional",
  current_heavy: "Current — daily",
};

const ALCOHOL_LABELS: Record<string, string> = {
  none: "None",
  social: "Social / Occasional",
  moderate: "Moderate (1–2 drinks/day)",
  heavy: "Heavy (3+ drinks/day)",
};

const FREQ_LABELS: Record<string, string> = {
  once_daily: "Once daily",
  twice_daily: "Twice daily",
  three_daily: "3× daily",
  four_daily: "4× daily",
  as_needed: "As needed",
  weekly: "Weekly",
  other: "Other",
};

const DURATION_LABELS: Record<string, string> = {
  today: "Started today",
  few_days: "2–3 days",
  week: "About a week",
  two_weeks: "1–2 weeks",
  month: "About a month",
  months: "Several months",
  year: "Over a year",
  chronic: "Chronic / ongoing",
  na: "Not applicable (routine visit)",
};
