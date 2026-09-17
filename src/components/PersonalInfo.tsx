import { PatientData } from "../App";
import { FormField, Input, Select, SectionHeader, NavButtons } from "./FormField";

type Props = {
  data: PatientData;
  onChange: (v: Partial<PatientData>) => void;
  onNext: () => void;
};

export default function PersonalInfo({ data, onChange, onNext }: Props) {
  return (
    <div>
      <SectionHeader
        title="Personal Information"
        description="Please provide your basic personal and insurance details."
      />
      <div className="p-6 grid gap-6">
        {/* Name row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="First Name" required>
            <Input
              value={data.firstName}
              onChange={(v) => onChange({ firstName: v })}
              placeholder="Jane"
            />
          </FormField>
          <FormField label="Last Name" required>
            <Input
              value={data.lastName}
              onChange={(v) => onChange({ lastName: v })}
              placeholder="Smith"
            />
          </FormField>
        </div>

        {/* DOB + Gender */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Date of Birth" required>
            <Input
              type="date"
              value={data.dateOfBirth}
              onChange={(v) => onChange({ dateOfBirth: v })}
            />
          </FormField>
          <FormField label="Biological Sex">
            <Select
              value={data.gender}
              onChange={(v) => onChange({ gender: v })}
              placeholder="Select..."
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other / Prefer not to say" },
              ]}
            />
          </FormField>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Phone Number" required>
            <Input
              type="tel"
              value={data.phone}
              onChange={(v) => onChange({ phone: v })}
              placeholder="+91 98765 43210"
            />
          </FormField>
          <FormField label="Email Address">
            <Input
              type="email"
              value={data.email}
              onChange={(v) => onChange({ email: v })}
              placeholder="jane.smith@email.com"
            />
          </FormField>
        </div>

        <FormField label="Home Address">
          <Input
            value={data.address}
            onChange={(v) => onChange({ address: v })}
            placeholder="123 Maple Street, Springfield, IL 62704"
          />
        </FormField>

        {/* Divider */}
        <div
          className="border-t pt-4"
          style={{ borderColor: "var(--color-muted)" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" }}
          >
            Emergency Contact
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Contact Name">
              <Input
                value={data.emergencyContactName}
                onChange={(v) => onChange({ emergencyContactName: v })}
                placeholder="Robert Smith"
              />
            </FormField>
            <FormField label="Contact Phone">
              <Input
                type="tel"
                value={data.emergencyContactPhone}
                onChange={(v) => onChange({ emergencyContactPhone: v })}
                placeholder="+91 98765 43210"
              />
            </FormField>
          </div>
        </div>

        {/* Insurance */}
        <div
          className="border-t pt-4"
          style={{ borderColor: "var(--color-muted)" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" }}
          >
            Insurance Information
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Insurance Provider">
              <Select
                value={data.insuranceProvider}
                onChange={(v) => onChange({ insuranceProvider: v })}
                placeholder="Select provider..."
                options={[
                  { value: "aetna", label: "Aetna" },
                  { value: "bcbs", label: "Blue Cross Blue Shield" },
                  { value: "cigna", label: "Cigna" },
                  { value: "humana", label: "Humana" },
                  { value: "kaiser", label: "Kaiser Permanente" },
                  { value: "medicare", label: "Medicare" },
                  { value: "medicaid", label: "Medicaid" },
                  { value: "united", label: "United Healthcare" },
                  { value: "other", label: "Other" },
                  { value: "none", label: "No Insurance / Self-Pay" },
                ]}
              />
            </FormField>
            <FormField label="Policy / Member Number">
              <Input
                value={data.insurancePolicyNumber}
                onChange={(v) => onChange({ insurancePolicyNumber: v })}
                placeholder="XYZ-1234567-89"
              />
            </FormField>
          </div>
        </div>
      </div>
      <NavButtons onNext={onNext} showBack={false} nextLabel="Continue to Medical History" />
    </div>
  );
}
