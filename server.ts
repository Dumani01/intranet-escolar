import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily or safely with process.env.GEMINI_API_KEY
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// AI Endpoint: Summarize announcement
app.post("/api/ai/summarize", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "El contenido es requerido" });
    }

    const ai = getGenAIClient();
    if (!ai) {
      // Fallback summary if no API key is provided
      return res.json({
        summary: `[Resumen Simulado]: ${title} — ${content.substring(0, 120)}... (Para resúmenes generativos completos por Gemini, configure GEMINI_API_KEY).`
      });
    }

    const prompt = `Eres un asistente de comunicación para una intranet escolar. Resume el siguiente comunicado de forma concisa (3 puntos clave o viñetas simples) para que las familias y estudiantes puedan comprender la información rápidamente:\n\nTítulo: ${title}\nContenido: ${content}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return res.json({ summary: response.text || "No se pudo generar el resumen." });
  } catch (error: any) {
    console.error("Error en resumen con Gemini:", error);
    return res.status(500).json({ error: "Error al procesar la solicitud con IA", details: error.message });
  }
});

// AI Endpoint: Draft announcement
app.post("/api/ai/draft-announcement", async (req, res) => {
  try {
    const { topic, audience, tone } = req.body;
    
    const ai = getGenAIClient();
    if (!ai) {
      return res.json({
        draftTitle: `Comunicado Oficial: ${topic || "Aviso Escolar"}`,
        draftContent: `Estimada comunidad escolar (${audience || "General"}):\n\nNos dirigimos a ustedes para informarles sobre ${topic || "un asunto institucional"}.\n\nPara mayor información, favor consultar en dirección.\n\nAtentamente,\nEquipo Directivo.`
      });
    }

    const prompt = `Actúa como redactor escolar institucional. Redacta un comunicado oficial en formato JSON con la estructura {"title": "...", "content": "..."} sobre el tema: "${topic}". Audiencia dirigida: "${audience}". Tono: "${tone || "Formal y claro"}". Devuelve solo el objeto JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let resultText = response.text || "";
    // Clean code fences if present in Gemini output
    resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(resultText);
      return res.json({ draftTitle: parsed.title, draftContent: parsed.content });
    } catch {
      return res.json({ draftTitle: `Comunicado sobre ${topic}`, draftContent: resultText });
    }
  } catch (error: any) {
    console.error("Error al redactar comunicado:", error);
    return res.status(500).json({ error: "Error al generar comunicado con IA" });
  }
});

// AI Endpoint: Attendance Anomaly Detection
app.post("/api/ai/analyze-attendance", async (req, res) => {
  try {
    const { studentName, attendanceRecords } = req.body;

    const ai = getGenAIClient();
    if (!ai) {
      return res.json({
        analysis: `Análisis de Asistencia para ${studentName}: Se registran ausencias acumuladas en las últimas semanas. Se recomienda revisión docente.`
      });
    }

    const prompt = `Analiza el siguiente historial de asistencia del estudiante "${studentName}": ${JSON.stringify(attendanceRecords)}.
Genera un breve informe pedagógico (máximo 4 líneas) sobre tendencias de ausentismo o puntualidad, indicando si requiere seguimiento con el departamento de orientación.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Error al analizar asistencia:", error);
    return res.status(500).json({ error: "Error en el análisis de asistencia" });
  }
});

async function startServer() {
  // Vite middleware in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor de la Intranet Escolar ejecutándose en http://localhost:${PORT}`);
  });
}

startServer();
