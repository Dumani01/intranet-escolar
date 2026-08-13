export async function fetchAISummary(title: string, content: string): Promise<string> {
  try {
    const res = await fetch("/api/ai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    return data.summary || "No se pudo obtener el resumen.";
  } catch (error) {
    console.error("Error al obtener resumen de IA:", error);
    return "Error al conectar con el servicio de Inteligencia Artificial.";
  }
}

export async function fetchAIDraftAnnouncement(topic: string, audience: string, tone: string) {
  try {
    const res = await fetch("/api/ai/draft-announcement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, audience, tone }),
    });
    return await res.json();
  } catch (error) {
    console.error("Error al redactar borrador con IA:", error);
    return {
      draftTitle: `Comunicado sobre ${topic}`,
      draftContent: "Error al comunicarse con la IA para generar el borrador.",
    };
  }
}

export async function fetchAIAttendanceAnalysis(studentName: string, records: any[]) {
  try {
    const res = await fetch("/api/ai/analyze-attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentName, attendanceRecords: records }),
    });
    const data = await res.json();
    return data.analysis || "Sin observaciones registradas.";
  } catch (error) {
    console.error("Error al analizar asistencia:", error);
    return "Error en la llamada de análisis de asistencia.";
  }
}
