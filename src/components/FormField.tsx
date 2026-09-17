import { ReactNode } from "react";

type FieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
};

export function FormField({ label, required, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-sm font-medium"
        style={{ color: "var(--color-foreground)", fontFamily: "var(--font-sans)" }}
      >
        {label}
        {required && (
          <span className="ml-1" style={{ color: "var(--color-danger)" }}>
            *
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

const inputBase = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "var(--radius)",
  border: "1.5px solid var(--color-border)",
  fontSize: "14px",
  backgroundColor: "#fafcff",
  color: "var(--color-foreground)",
  transition: "border-color 0.15s, box-shadow 0.15s",
  fontFamily: "var(--font-body)",
};

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputBase as React.CSSProperties}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--color-ring)";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,79,138,0.12)";
        e.currentTarget.style.backgroundColor = "#ffffff";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.backgroundColor = "#fafcff";
      }}
    />
  );
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...inputBase, appearance: "none", cursor: "pointer" } as React.CSSProperties}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--color-ring)";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,79,138,0.12)";
        e.currentTarget.style.backgroundColor = "#ffffff";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.backgroundColor = "#fafcff";
      }}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ ...inputBase, resize: "vertical", lineHeight: "1.5" } as React.CSSProperties}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--color-ring)";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,79,138,0.12)";
        e.currentTarget.style.backgroundColor = "#ffffff";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.backgroundColor = "#fafcff";
      }}
    />
  );
}

export function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((opt) => {
        const checked = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all duration-150"
            style={{
              border: `1.5px solid ${checked ? "var(--color-primary)" : "var(--color-border)"}`,
              backgroundColor: checked ? "var(--color-secondary)" : "#fafcff",
              color: checked ? "var(--color-primary)" : "var(--color-foreground)",
              fontFamily: "var(--font-body)",
            }}
          >
            <div
              className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: checked ? "var(--color-primary)" : "transparent",
                border: `1.5px solid ${checked ? "var(--color-primary)" : "var(--color-border)"}`,
              }}
            >
              {checked && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5l2.5 2.5L8 3"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div
      className="px-6 py-5"
      style={{
        borderBottom: "1px solid var(--color-muted)",
        background: "linear-gradient(to right, var(--color-secondary), #f8fbff)",
      }}
    >
      <h2
        className="text-xl font-semibold"
        style={{ fontFamily: "var(--font-sans)", color: "var(--color-primary)" }}
      >
        {title}
      </h2>
      {description && (
        <p className="text-sm mt-1" style={{ color: "var(--color-muted-foreground)" }}>
          {description}
        </p>
      )}
    </div>
  );
}

export function NavButtons({
  onBack,
  onNext,
  nextLabel = "Continue",
  showBack = true,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  showBack?: boolean;
}) {
  return (
    <div
      className="flex justify-between items-center px-6 py-4 mt-2"
      style={{ borderTop: "1px solid var(--color-muted)" }}
    >
      {showBack && onBack ? (
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
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
      ) : (
        <div />
      )}
      <button
        onClick={onNext}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-primary-foreground)",
          fontFamily: "var(--font-sans)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-primary-light)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(26,79,138,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-primary)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {nextLabel}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
