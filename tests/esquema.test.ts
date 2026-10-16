import { describe, expect, it } from "vitest";
import { respuestasSchema, resultadoSchema } from "@/lib/esquema";

const valida = {
  animo: "tranquilo",
  actividad: "estudiar",
  energia: 2,
  generos: ["lofi", "jazz"],
  idioma: "sin_preferencia",
  epoca: "actual",
  artistas: "Nujabes",
};

describe("respuestasSchema", () => {
  it("acepta respuestas válidas", () => {
    expect(respuestasSchema.safeParse(valida).success).toBe(true);
  });

  it("los artistas son opcionales", () => {
    const { artistas, ...sinArtistas } = valida;
    expect(respuestasSchema.safeParse(sinArtistas).success).toBe(true);
  });

  it("rechaza energía fuera de 1-5", () => {
    expect(respuestasSchema.safeParse({ ...valida, energia: 6 }).success).toBe(false);
  });

  it("rechaza lista de géneros vacía o de más de 5", () => {
    expect(respuestasSchema.safeParse({ ...valida, generos: [] }).success).toBe(false);
    const seis = ["pop", "rock", "jazz", "lofi", "rap", "salsa"];
    expect(respuestasSchema.safeParse({ ...valida, generos: seis }).success).toBe(false);
  });

  it("rechaza ánimo desconocido y artistas demasiado largos", () => {
    expect(respuestasSchema.safeParse({ ...valida, animo: "enojado" }).success).toBe(false);
    expect(respuestasSchema.safeParse({ ...valida, artistas: "a".repeat(201) }).success).toBe(false);
  });
});

describe("resultadoSchema", () => {
  it("exige entre 1 y 10 recomendaciones completas", () => {
    const item = { cancion: "Aruarian Dance", artista: "Nujabes", motivo: "Suave y concentrada." };
    expect(resultadoSchema.safeParse({ recomendaciones: [item] }).success).toBe(true);
    expect(resultadoSchema.safeParse({ recomendaciones: [] }).success).toBe(false);
    expect(resultadoSchema.safeParse({ recomendaciones: [{ cancion: "x" }] }).success).toBe(false);
  });
});
