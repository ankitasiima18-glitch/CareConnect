import { PatientData } from "../App";

export type FlagSeverity = "critical" | "warning" | "good";

export type AnalysisFlag = {
  severity: FlagSeverity;
  category: string;
  title: string;
  detail: string;
  action?: string;
};

export type AIAnalysisResult = {
  overallRisk: "high" | "moderate" | "low";
  summary: string;
  flags: AnalysisFlag[];
  immediateAttention: string[];
  recommendations: string[];
};

const sym = (data: PatientData, ...keywords: string[]) =>
  keywords.some((k) =>
    data.symptoms.some((s) => s.toLowerCase().includes(k.toLowerCase()))
  );

const cond = (data: PatientData, ...keywords: string[]) =>
  keywords.some((k) =>
    data.conditions.some((c) => c.toLowerCase().includes(k.toLowerCase()))
  );

const fam = (data: PatientData, ...keywords: string[]) =>
  keywords.some((k) =>
    data.familyHistory.some((f) => f.toLowerCase().includes(k.toLowerCase()))
  );

const hasMed = (data: PatientData, ...keywords: string[]) =>
  keywords.some((k) =>
    data.medications.some((m) => m.name.toLowerCase().includes(k.toLowerCase()))
  );

export function analyzePatientData(data: PatientData): AIAnalysisResult {
  const flags: AnalysisFlag[] = [];
  const immediateAttention: string[] = [];
  const recommendations: string[] = [];

  // ─── CRITICAL RED FLAGS ───────────────────────────────────────────────────

  // Cardiac emergency
  if (sym(data, "chest pain") && sym(data, "shortness of breath")) {
    flags.push({
      severity: "critical",
      category: "Cardiovascular",
      title: "Possible Cardiac Event",
      detail: "Chest pain combined with shortness of breath is a high-priority cardiac warning sign.",
      action: "Immediate ECG and troponin levels recommended.",
    });
    immediateAttention.push("Cardiac assessment — ECG and troponin screening");
  }

  if (sym(data, "chest pain") && sym(data, "palpitations")) {
    flags.push({
      severity: "critical",
      category: "Cardiovascular",
      title: "Chest Pain with Palpitations",
      detail: "Combination suggests possible arrhythmia or acute coronary syndrome.",
      action: "Urgent cardiac monitoring required.",
    });
    immediateAttention.push("Cardiac rhythm monitoring");
  }

  // Stroke signs
  if (sym(data, "difficulty speaking")) {
    flags.push({
      severity: "critical",
      category: "Neurological",
      title: "Possible Stroke Indicator",
      detail: "Difficulty speaking is a major red flag for transient ischemic attack (TIA) or stroke.",
      action: "Neurological assessment and FAST protocol evaluation.",
    });
    immediateAttention.push("Stroke protocol — FAST assessment required");
  }

  if (sym(data, "confusion", "memory issues") && sym(data, "numbness", "tingling") && data.painLevel >= 5) {
    flags.push({
      severity: "critical",
      category: "Neurological",
      title: "Neurological Symptoms Cluster",
      detail: "Confusion combined with numbness and pain may indicate a serious neurological condition.",
      action: "Neurological exam and possible CT/MRI.",
    });
  }

  // Bleeding
  if (sym(data, "coughing blood")) {
    flags.push({
      severity: "critical",
      category: "Respiratory / Oncological",
      title: "Hemoptysis Detected",
      detail: "Coughing up blood (hemoptysis) requires urgent investigation for infection, clot, or malignancy.",
      action: "Immediate chest X-ray and specialist referral.",
    });
    immediateAttention.push("Chest X-ray for hemoptysis");
  }

  if (sym(data, "blood in stool")) {
    flags.push({
      severity: "critical",
      category: "Gastrointestinal",
      title: "Rectal / GI Bleeding",
      detail: "Blood in stool can indicate serious conditions including colorectal cancer, ulcers, or inflammatory bowel disease.",
      action: "Colonoscopy or urgent GI referral recommended.",
    });
    immediateAttention.push("GI bleed workup — colonoscopy referral");
  }

  if (sym(data, "blood in urine")) {
    flags.push({
      severity: "critical",
      category: "Urology / Nephrology",
      title: "Hematuria (Blood in Urine)",
      detail: "Blood in urine may indicate kidney stones, infection, or bladder/kidney malignancy.",
      action: "Urinalysis, renal ultrasound, and urology referral.",
    });
    immediateAttention.push("Urinalysis and renal ultrasound for hematuria");
  }

  // Severe pain
  if (data.painLevel >= 8) {
    flags.push({
      severity: "critical",
      category: "Pain Management",
      title: `Severe Pain — ${data.painLevel}/10`,
      detail: "Pain at this level warrants urgent evaluation and immediate pain management intervention.",
      action: "Pain assessment and analgesic protocol.",
    });
    immediateAttention.push("Urgent pain management evaluation");
  }

  // Fainting
  if (sym(data, "fainting")) {
    flags.push({
      severity: "critical",
      category: "Cardiovascular / Neurological",
      title: "Syncope (Fainting)",
      detail: "Fainting episodes can indicate cardiac arrhythmia, orthostatic hypotension, or neurological events.",
      action: "Cardiac monitoring, orthostatic vitals, and ECG.",
    });
    immediateAttention.push("Syncope evaluation — cardiac monitoring");
  }

  // Sudden weight loss + fatigue
  if (sym(data, "sudden weight loss") && sym(data, "fatigue")) {
    flags.push({
      severity: "critical",
      category: "Oncological / Metabolic",
      title: "Unexplained Weight Loss with Fatigue",
      detail: "Unintentional weight loss combined with persistent fatigue is a significant red flag for malignancy or metabolic disease.",
      action: "Full blood panel, tumour markers, and oncology consult.",
    });
    immediateAttention.push("Oncology screening — tumour markers and CBC");
  }

  // Severe abdominal pain + vomiting
  if (sym(data, "abdominal pain") && data.painLevel >= 7) {
    flags.push({
      severity: "critical",
      category: "Gastrointestinal",
      title: "Severe Abdominal Pain",
      detail: "High-intensity abdominal pain may indicate appendicitis, pancreatitis, bowel obstruction, or ruptured viscus.",
      action: "Abdominal ultrasound / CT and surgical consult.",
    });
    immediateAttention.push("Abdominal imaging — rule out surgical emergency");
  }

  // ─── WARNING (YELLOW FLAGS) ───────────────────────────────────────────────

  // Hypertension uncontrolled
  if (cond(data, "hypertension") && !hasMed(data, "amlodipine", "telmisartan", "ramipril", "atenolol", "losartan", "metoprolol", "lisinopril", "bisoprolol")) {
    flags.push({
      severity: "warning",
      category: "Cardiovascular",
      title: "Hypertension — No Antihypertensive Listed",
      detail: "Patient has hypertension but no blood pressure medication is listed in current medications.",
      action: "Review medication compliance or initiate antihypertensive therapy.",
    });
    recommendations.push("Verify blood pressure medication compliance");
  }

  // Diabetes + no medication
  if ((cond(data, "diabetes") || cond(data, "pre-diabetes")) && !hasMed(data, "metformin", "insulin", "glipizide", "januvia", "ozempic", "jardiance")) {
    flags.push({
      severity: "warning",
      category: "Endocrine",
      title: "Diabetes — No Antidiabetic Medication Listed",
      detail: "Diabetic patient without documented glucose-lowering medication. May indicate non-compliance or unmanaged diabetes.",
      action: "HbA1c test and diabetes management review.",
    });
    recommendations.push("HbA1c and fasting glucose check");
  }

  // Moderate pain
  if (data.painLevel >= 4 && data.painLevel < 8) {
    flags.push({
      severity: "warning",
      category: "Pain Management",
      title: `Moderate Pain — ${data.painLevel}/10`,
      detail: "Moderate pain level requires assessment to determine cause and appropriate management.",
      action: "Pain characterisation and targeted examination.",
    });
  }

  // Heavy smoker + respiratory symptoms
  if (data.smokingStatus === "current_heavy" && sym(data, "cough", "shortness of breath", "wheezing")) {
    flags.push({
      severity: "warning",
      category: "Respiratory",
      title: "Active Smoker with Respiratory Symptoms",
      detail: "Daily smoking combined with respiratory symptoms increases risk for COPD, chronic bronchitis, and lung cancer.",
      action: "Spirometry, chest X-ray, and smoking cessation counselling.",
    });
    recommendations.push("Spirometry and smoking cessation programme");
  }

  // Family history of heart disease + cardiac symptoms
  if (fam(data, "heart disease", "heart attack") && sym(data, "chest", "palpitation", "shortness")) {
    flags.push({
      severity: "warning",
      category: "Cardiovascular",
      title: "Strong Family Cardiac History + Symptoms",
      detail: "Positive family history of heart disease with current cardiac symptoms elevates risk significantly.",
      action: "Lipid panel, ECG, and cardiology referral.",
    });
    recommendations.push("Lipid panel and cardiology screening");
  }

  // Diabetes + family cancer history
  if (cond(data, "diabetes") && fam(data, "cancer")) {
    flags.push({
      severity: "warning",
      category: "Oncological",
      title: "Diabetes with Family Cancer History",
      detail: "Diabetes is associated with elevated risk for pancreatic and colorectal cancer, especially with a family history.",
      action: "Age-appropriate cancer screening.",
    });
  }

  // Multiple chronic conditions
  const chronicCount = data.conditions.filter((c) => c !== "None of the above").length;
  if (chronicCount >= 4) {
    flags.push({
      severity: "warning",
      category: "Polypharmacy / Multimorbidity",
      title: `Multiple Chronic Conditions (${chronicCount})`,
      detail: "Managing 4 or more chronic conditions increases risk of drug interactions and missed comorbidities.",
      action: "Comprehensive medication review and specialist coordination.",
    });
    recommendations.push("Comprehensive medication reconciliation");
  }

  // Known cancer
  if (cond(data, "cancer")) {
    flags.push({
      severity: "warning",
      category: "Oncological",
      title: "Active or Prior Malignancy",
      detail: "Patient has a current or historical cancer diagnosis. Monitoring for recurrence and treatment side effects required.",
      action: "Oncology follow-up and symptom review.",
    });
    recommendations.push("Oncology follow-up and surveillance");
  }

  // Thyroid + weight changes
  if (cond(data, "thyroid") && (sym(data, "sudden weight loss") || sym(data, "sudden weight gain") || sym(data, "fatigue"))) {
    flags.push({
      severity: "warning",
      category: "Endocrine",
      title: "Thyroid Disorder with Metabolic Symptoms",
      detail: "Weight changes and fatigue in a patient with thyroid disorder may indicate suboptimal thyroid function control.",
      action: "TSH, free T3/T4 levels.",
    });
    recommendations.push("Thyroid function panel — TSH and free T4");
  }

  // Alcohol use
  if (data.alcoholUse === "heavy") {
    flags.push({
      severity: "warning",
      category: "Hepatology / Mental Health",
      title: "Heavy Alcohol Consumption",
      detail: "Heavy daily alcohol use significantly raises risk for liver disease, pancreatitis, and mental health disorders.",
      action: "Liver function tests, AUDIT screening, and counselling referral.",
    });
    recommendations.push("Liver function tests (LFTs) and alcohol counselling");
  }

  // Chest pain without cardiac history
  if (sym(data, "chest pain") && !sym(data, "shortness of breath")) {
    flags.push({
      severity: "warning",
      category: "Cardiovascular / Musculoskeletal",
      title: "Chest Pain — Cause Unknown",
      detail: "Isolated chest pain requires cardiac, musculoskeletal, and GI differential diagnosis.",
      action: "ECG, troponin, and physical examination.",
    });
  }

  // Skin changes
  if (sym(data, "skin rash") && cond(data, "lupus", "autoimmune")) {
    flags.push({
      severity: "warning",
      category: "Dermatology / Rheumatology",
      title: "Skin Rash with Autoimmune History",
      detail: "Rash in a patient with known autoimmune condition may indicate a flare.",
      action: "Dermatology review and inflammatory markers (CRP, ANA).",
    });
  }

  // ─── GREEN FLAGS ─────────────────────────────────────────────────────────

  if (data.painLevel === 0 && data.symptoms.length <= 2) {
    flags.push({
      severity: "good",
      category: "General Health",
      title: "Minimal Symptoms",
      detail: "Patient reports little to no pain and very few symptoms. Good overall clinical presentation.",
    });
  }

  if (
    data.medications.length > 0 &&
    (cond(data, "hypertension") || cond(data, "diabetes")) &&
    data.painLevel <= 3
  ) {
    flags.push({
      severity: "good",
      category: "Chronic Disease Management",
      title: "Chronic Conditions Appear Managed",
      detail: "Patient has documented medications for chronic conditions and reports low pain. Suggests reasonably controlled disease.",
    });
    recommendations.push("Continue current medication regimen and schedule routine follow-up");
  }

  if (data.smokingStatus === "never" && data.alcoholUse === "none") {
    flags.push({
      severity: "good",
      category: "Lifestyle",
      title: "Non-Smoker, No Alcohol Use",
      detail: "Patient does not smoke or consume alcohol — significant protective factors for cardiovascular and liver health.",
    });
  }

  if (data.smokingStatus === "former") {
    flags.push({
      severity: "good",
      category: "Lifestyle",
      title: "Former Smoker",
      detail: "Patient has quit smoking — a positive lifestyle change that reduces cardiovascular and lung cancer risk over time.",
    });
    recommendations.push("Monitor for post-cessation symptoms and perform annual lung health screening");
  }

  if (data.conditions.includes("None of the above") || data.conditions.length === 0) {
    flags.push({
      severity: "good",
      category: "Medical History",
      title: "No Significant Chronic Conditions",
      detail: "Patient reports no prior or current chronic medical conditions.",
    });
  }

  if (data.allergies.toLowerCase() === "none" || data.allergies === "") {
    flags.push({
      severity: "good",
      category: "Allergies",
      title: "No Known Drug or Food Allergies",
      detail: "No allergy flags on file. Broader treatment options are available without contraindication concerns.",
    });
  }

  // ─── GENERAL RECOMMENDATIONS ─────────────────────────────────────────────

  if (data.familyHistory.includes("Diabetes (Type 2)") && !cond(data, "diabetes")) {
    recommendations.push("Fasting glucose screen — strong family history of Type 2 Diabetes");
  }

  if (fam(data, "cancer") && !cond(data, "cancer")) {
    recommendations.push("Age-appropriate cancer screening based on family history");
  }

  if (fam(data, "heart disease") || fam(data, "heart attack")) {
    recommendations.push("Lipid panel and cardiovascular risk score (Framingham / QRISK)");
  }

  if (sym(data, "fatigue") && (cond(data, "anemia") || fam(data, "sickle cell", "thalassemia"))) {
    recommendations.push("Complete blood count (CBC) — check for anemia");
  }

  recommendations.push("Ensure all immunisations are up to date");
  recommendations.push("Schedule annual preventive health check-up");

  // ─── OVERALL RISK SCORE ───────────────────────────────────────────────────

  const criticalCount = flags.filter((f) => f.severity === "critical").length;
  const warningCount = flags.filter((f) => f.severity === "warning").length;

  const overallRisk: "high" | "moderate" | "low" =
    criticalCount >= 1 || immediateAttention.length >= 2
      ? "high"
      : warningCount >= 2
      ? "moderate"
      : "low";

  const summary =
    overallRisk === "high"
      ? `${criticalCount} critical indicator${criticalCount !== 1 ? "s" : ""} detected. Immediate clinical review recommended before or during consultation.`
      : overallRisk === "moderate"
      ? `${warningCount} area${warningCount !== 1 ? "s" : ""} of concern identified. Targeted follow-up and monitoring advised.`
      : "No critical concerns detected. Patient presents with a stable health profile for this visit.";

  return { overallRisk, summary, flags, immediateAttention, recommendations };
}
