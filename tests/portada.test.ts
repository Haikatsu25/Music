import { describe, expect, it } from "vitest";
import { PALETA_BASE, PALETAS, generarPortada, paletaPara, tituloDisco } from "@/lib/portada";
import { VALORES_INICIALES, aRespuestas } from "@/lib/valores";

describe("generarPortada", () => {
  it("es determinista", () => {
    const a = generarPortada("jazz", PALETAS.tranquilo, 3);
    const b = generarPortada("jazz", PALETAS.tranquilo, 3);
    expect(a).toEqual(b);
  });

  it("cambia con la semilla", () => {
    const a = generarPortada("jazz", PALETAS.tranquilo, 3);
    const b = generarPortada("rock", PALETAS.tranquilo, 3);
    expect(a).not.toEqual(b);
  });

  it("siempre empieza con el fondo y solo usa colores de la paleta", () => {
    for (const semilla of ["a", "b", "c", "d", "e", "f"]) {
      for (const energia of [1, 3, 5]) {
        const p = PALETAS.motivado;
        const formas = generarPortada(semilla, p, energia);
        expect(formas[0]).toMatchObject({ t: "rect", c: p.fondo });
        const permitidos = new Set([p.fondo, ...p.colores]);
        for (const f of formas) expect(permitidos.has(f.c)).toBe(true);
      }
    }
  });
});

describe("paletaPara y tituloDisco", () => {
  it("usa la paleta base si no hay ánimo", () => {
    expect(paletaPara("")).toBe(PALETA_BASE);
    expect(paletaPara("feliz")).toBe(PALETAS.feliz);
  });

  it("compone el título con lo que haya", () => {
    expect(tituloDisco("tranquilo", "estudiar")).toBe("Para estudiar en calma");
    expect(tituloDisco("", "fiesta")).toBe("Para ir de fiesta");
    expect(tituloDisco("nostalgico", "")).toBe("Como en otra época");
    expect(tituloDisco("", "")).toBe("Tu disco, sin título todavía");
  });
});

describe("aRespuestas", () => {
  it("devuelve null mientras el formulario está incompleto", () => {
    expect(aRespuestas(VALORES_INICIALES)).toBeNull();
  });

  it("devuelve las respuestas cuando todo está completo y quita artistas vacíos", () => {
    const r = aRespuestas({
      animo: "feliz",
      actividad: "viajar",
      energia: 4,
      generos: ["pop"],
      idioma: "espanol",
      epoca: "actual",
      artistas: "  ",
    });
    expect(r).not.toBeNull();
    expect(r?.artistas).toBeUndefined();
  });
});
