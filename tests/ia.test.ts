import { beforeEach, describe, expect, it, vi } from "vitest";

const generateContent = vi.fn();
vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = { generateContent };
  },
  ThinkingLevel: { LOW: "LOW" },
}));

import { ErrorIA, recomendar } from "@/lib/ia";

const respuestas = {
  animo: "feliz",
  actividad: "viajar",
  energia: 3,
  generos: ["pop"],
  idioma: "espanol",
  epoca: "actual",
} as const;

const valida = JSON.stringify({
  recomendaciones: [{ cancion: "Vivir Mi Vida", artista: "Marc Anthony", motivo: "Alegre." }],
});

beforeEach(() => {
  process.env.GEMINI_API_KEY = "clave";
  generateContent.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("recomendar", () => {
  it("devuelve las recomendaciones si la respuesta es válida", async () => {
    generateContent.mockResolvedValueOnce({ text: valida });
    const r = await recomendar({ ...respuestas, generos: ["pop"] });
    expect(r.recomendaciones).toHaveLength(1);
    expect(generateContent).toHaveBeenCalledTimes(1);
  });

  it("reintenta una vez si la primera respuesta viene cortada", async () => {
    generateContent
      .mockResolvedValueOnce({ text: '{"recomendaciones":[{"cancion":"Vi' })
      .mockResolvedValueOnce({ text: valida });
    const r = await recomendar({ ...respuestas, generos: ["pop"] });
    expect(r.recomendaciones[0].cancion).toBe("Vivir Mi Vida");
    expect(generateContent).toHaveBeenCalledTimes(2);
  });

  it("falla con ErrorIA si las dos respuestas son ilegibles", async () => {
    generateContent.mockResolvedValue({ text: "lo siento, no puedo" });
    await expect(recomendar({ ...respuestas, generos: ["pop"] })).rejects.toBeInstanceOf(ErrorIA);
    expect(generateContent).toHaveBeenCalledTimes(2);
  });

  it("pide margen suficiente de tokens de salida", async () => {
    generateContent.mockResolvedValueOnce({ text: valida });
    await recomendar({ ...respuestas, generos: ["pop"] });
    expect(generateContent.mock.calls[0][0].config.maxOutputTokens).toBeGreaterThanOrEqual(4000);
  });
});
