import { describe, expect, it } from "vitest";
import { crearLimitador } from "@/lib/limite";

describe("crearLimitador", () => {
  it("permite hasta el máximo y luego bloquea", () => {
    const permitir = crearLimitador({ max: 2, ventanaMs: 1000 });
    expect(permitir("1.1.1.1", 0)).toBe(true);
    expect(permitir("1.1.1.1", 10)).toBe(true);
    expect(permitir("1.1.1.1", 20)).toBe(false);
  });

  it("cuenta cada IP por separado", () => {
    const permitir = crearLimitador({ max: 1, ventanaMs: 1000 });
    expect(permitir("a", 0)).toBe(true);
    expect(permitir("b", 0)).toBe(true);
  });

  it("libera tras la ventana", () => {
    const permitir = crearLimitador({ max: 1, ventanaMs: 1000 });
    expect(permitir("a", 0)).toBe(true);
    expect(permitir("a", 500)).toBe(false);
    expect(permitir("a", 1001)).toBe(true);
  });
});
