import { useRef, useState } from "react";
import { PatientData } from "../App";
import { SectionHeader, NavButtons } from "./FormField";

type Props = {
  data: PatientData;
  onChange: (v: Partial<PatientData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const CATEGORIES = [
  { value: "lab_report", label: "Lab Report", icon: "🧪" },
  { value: "prescription", label: "Prescription", icon: "💊" },
  { value: "imaging", label: "X-Ray / MRI / CT Scan", icon: "🩻" },
  { value: "insurance", label: "Insurance Card", icon: "🪪" },
  { value: "discharge", label: "Discharge Summary", icon: "📄" },
  { value: "other", label: "Other Document", icon: "📎" },
];

type UploadedFile = {
  id: string;
  file: File;
  category: string;
  preview?: string;
};

export default function Documents({ data, onChange, onNext, onBack }: Props) {
  const [files, setFiles] = useState<UploadedFile[]>(
    (data.documents || []) as UploadedFile[]
  );
  const [dragging, setDragging] = useState(false);
  const [pendingCategory, setPendingCategory] = useState("lab_report");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles: UploadedFile[] = Array.from(incoming).map((f) => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      category: pendingCategory,
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }));
    const updated = [...files, ...newFiles];
    setFiles(updated);
    onChange({ documents: updated } as never);
  };

  const remove = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    onChange({ documents: updated } as never);
  };

  const catLabel = (val: string) => CATEGORIES.find((c) => c.value === val)?.label ?? val;
  const catIcon = (val: string) => CATEGORIES.find((c) => c.value === val)?.icon ?? "📎";

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <SectionHeader
        title="Upload Documents"
        description="Attach relevant medical records, prescriptions, lab reports, or insurance documents."
      />
      <div className="p-6 grid gap-6">
        {/* Category selector */}
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" }}
          >
            Document Type
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setPendingCategory(cat.value)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all duration-150"
                style={{
                  border: `1.5px solid ${pendingCategory === cat.value ? "var(--color-primary)" : "var(--color-border)"}`,
                  backgroundColor: pendingCategory === cat.value ? "var(--color-secondary)" : "#fafcff",
                  color: pendingCategory === cat.value ? "var(--color-primary)" : "var(--color-foreground)",
                  fontFamily: "var(--font-body)",
                }}
              >
                <span>{cat.icon}</span>
                <span className="text-xs font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Drop zone */}
        <div
          className="rounded-xl flex flex-col items-center justify-center py-10 px-6 text-center transition-all duration-200 cursor-pointer"
          style={{
            border: `2px dashed ${dragging ? "var(--color-primary)" : "var(--color-border)"}`,
            backgroundColor: dragging ? "var(--color-secondary)" : "#f8fbff",
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: dragging ? "var(--color-primary)" : "var(--color-secondary)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 16V8M12 8l-3 3M12 8l3 3"
                stroke={dragging ? "#ffffff" : "var(--color-primary)"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 16v2a2 2 0 002 2h14a2 2 0 002-2v-2"
                stroke={dragging ? "#ffffff" : "var(--color-primary)"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p
            className="font-semibold text-sm mb-1"
            style={{ color: "var(--color-foreground)", fontFamily: "var(--font-sans)" }}
          >
            {dragging ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-xs mb-3" style={{ color: "var(--color-muted-foreground)" }}>
            or click to browse
          </p>
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{ backgroundColor: "var(--color-muted)", color: "var(--color-muted-foreground)" }}
          >
            PDF, JPG, PNG, HEIC — up to 10 MB each
          </span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.heic,.webp"
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {/* Uploaded files */}
        {files.length > 0 && (
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" }}
            >
              Uploaded Documents ({files.length})
            </p>
            <div className="grid gap-2">
              {files.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{
                    backgroundColor: "var(--color-secondary)",
                    border: "1.5px solid var(--color-primary)",
                  }}
                >
                  {/* Preview or icon */}
                  {f.preview ? (
                    <img
                      src={f.preview}
                      alt={f.file.name}
                      className="w-10 h-10 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0 text-lg"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      <span>{catIcon(f.category)}</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {f.file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: "var(--color-primary)",
                          color: "#ffffff",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {catLabel(f.category)}
                      </span>
                      <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                        {formatSize(f.file.size)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => remove(f.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ color: "var(--color-muted-foreground)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-danger)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted-foreground)")}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length === 0 && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm"
            style={{ backgroundColor: "#fffbeb", border: "1px solid #fcd34d", color: "#92400e" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v4M8 11v.5" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Documents are optional. You may skip this step if no files are needed.
          </div>
        )}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Review My Information" />
    </div>
  );
}
