import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { resultadoSchema, type Resultado, type Respuestas } from "./esquema";
import { construirPrompt } from "./prompt";

export class ErrorIA extends Error {}
/** La IA respondió, pero con algo que no se puede leer: vale la pena reintentar. */
class ErrorFormato extends ErrorIA {}

function extraerJSON(texto: string): unknown {
  const inicio = texto.indexOf("{");
  const fin = texto.lastIndexOf("}");
  if (inicio === -1 || fin <= inicio) throw new Error("sin JSON");
  return JSON.parse(texto.slice(inicio, fin + 1));
}

// Gemini devuelve 503 (alta demanda) y 429 (límite) de forma intermitente en la capa gratuita.
async function conReintentos<T>(fn: () => Promise<T>, intentos = 3): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (i >= intentos || (status !== 503 && status !== 429)) throw e;
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
}

async function pedirUnaVez(ai: GoogleGenAI, respuestas: Respuestas): Promise<Resultado> {
  const { sistema, usuario } = construirPrompt(respuestas);

  const respuesta = await conReintentos(() =>
    ai.models.generateContent({
      model: process.env.GEMINI_MODEL ?? "gemini-3.5-flash-lite",
      contents: usuario,
      config: {
        systemInstruction: sistema,
        responseMimeType: "application/json",
        // Los tokens de razonamiento cuentan dentro de este límite: con poco margen el JSON puede quedar cortado.
        maxOutputTokens: 6000,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        httpOptions: { timeout: 40000 },
      },
    }),
  );

  let json: unknown;
  try {
    json = extraerJSON(respuesta.text ?? "");
  } catch (e) {
    console.error("Gemini ilegible", {
      finishReason: respuesta.candidates?.[0]?.finishReason,
      usage: respuesta.usageMetadata,
      error: String(e),
      texto: respuesta.text,
    });
    throw new ErrorFormato("Respuesta de la IA ilegible");
  }
  const validado = resultadoSchema.safeParse(json);
  if (!validado.success) {
    console.error("Gemini con formato inesperado", { problemas: validado.error.issues, texto: respuesta.text });
    throw new ErrorFormato("Respuesta de la IA con formato inesperado");
  }
  return validado.data;
}

export async function recomendar(respuestas: Respuestas): Promise<Resultado> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new ErrorIA("Falta GEMINI_API_KEY en el servidor");

  const ai = new GoogleGenAI({ apiKey });
  try {
    return await pedirUnaVez(ai, respuestas);
  } catch (e) {
    if (!(e instanceof ErrorFormato)) throw e;
    // Una segunda oportunidad: las respuestas ilegibles suelen ser puntuales.
    return await pedirUnaVez(ai, respuestas);
  }
}
