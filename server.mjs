import http from "node:http";
import { GoogleGenAI } from "@google/genai";

const PORT = process.env.PORT || 3001;

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing.");
  console.error("Make sure your .env file contains:");
  console.error("GEMINI_API_KEY=your_key_here");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function sendJson(res, status, body) {
  res.writeHead(status, {
    ...corsHeaders,
    "Content-Type": "application/json; charset=utf-8",
  });

  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  // Gemini AI endpoint
  if (req.method === "POST" && req.url === "/api/ai-summary") {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk;
    });

    req.on("end", async () => {
      try {
        const { patientData } = JSON.parse(rawBody);

        if (!patientData) {
          sendJson(res, 400, {
            error: "Patient data is required.",
          });
          return;
        }

        // Send only clinical information to Gemini.
        // Direct identifiers and insurance information are not sent.
        const clinicalData = {
          conditions: patientData.conditions,
          allergies: patientData.allergies,
          surgeries: patientData.surgeries,
          familyHistory: patientData.familyHistory,
          smokingStatus: patientData.smokingStatus,
          alcoholUse: patientData.alcoholUse,
          medications: patientData.medications,
          reasonForVisit: patientData.reasonForVisit,
          symptoms: patientData.symptoms,
          painLevel: patientData.painLevel,
          symptomDuration: patientData.symptomDuration,
          additionalNotes: patientData.additionalNotes,
        };

        const prompt = `
You are an AI assistant helping a licensed clinician review a patient's intake form.

Create a concise clinical intake summary using ONLY the information provided below.

IMPORTANT:
- Do not diagnose any disease.
- Do not prescribe medication.
- Do not recommend treatment.
- Do not invent missing information.
- Do not make assumptions about the patient.
- Clearly distinguish reported information from anything that needs clinician review.
- Keep the language professional and easy for a doctor to scan quickly.
- Do not use Markdown formatting.
- Do not use asterisks.
- Do not use hashtags.
- Do not use bullet symbols.
- Use clean plain text with clear section headings.
- Keep the output organized and readable.

Use exactly these sections:

KEY INTAKE SUMMARY

Summarize the main reason for visit, symptoms, duration, pain level, relevant history, family history, allergies, surgeries, social history, and medications.

ITEMS FOR CLINICIAN ATTENTION

List important reported symptoms, medical history, missing information, or other details that the clinician may want to review.

QUESTIONS TO CONSIDER

Give a short list of useful follow-up questions based only on gaps or details in the intake.

PATIENT INTAKE:
${JSON.stringify(clinicalData, null, 2)}
`;

        const interaction = await ai.interactions.create({
          model: "gemini-3.6-flash",
          input: prompt,
          store: false,
          generation_config: {
            thinking_level: "low",
          },
        });

        sendJson(res, 200, {
          summary:
            interaction.output_text || "No AI summary was generated.",
        });
      } catch (error) {
        console.error("Gemini error:", error);

        sendJson(res, 500, {
          error: "Gemini AI summary could not be generated.",
        });
      }
    });

    return;
  }

  sendJson(res, 404, {
    error: "Not found",
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Gemini AI server running on port ${PORT}`);
});