export type Paleta = { fondo: string; colores: [string, string, string]; acento: string };

export type Forma =
  | { t: "rect"; x: number; y: number; w: number; h: number; c: string }
  | { t: "circ"; cx: number; cy: number; r: number; c: string }
  | { t: "path"; d: string; c: string };

export const PALETA_BASE: Paleta = {
  fondo: "#D8D3EE",
  colores: ["#7C6FE0", "#17142E", "#F5F2FF"],
  acento: "#7C6FE0",
};

export const PALETAS: Record<string, Paleta> = {
  feliz: { fondo: "#FFD23F", colores: ["#EE4266", "#2A9D8F", "#1B1B3A"], acento: "#EE4266" },
  tranquilo: { fondo: "#CFE8E4", colores: ["#3A6F6B", "#F2C48D", "#1F3B4D"], acento: "#3A6F6B" },
  melancolico: { fondo: "#2B3A67", colores: ["#7A9CC6", "#C9B6E4", "#0F1A33"], acento: "#7A9CC6" },
  motivado: { fondo: "#FF5A1F", colores: ["#17142E", "#FFE066", "#F7F3EA"], acento: "#FF5A1F" },
  romantico: { fondo: "#F6BFD0", colores: ["#C8174B", "#7B1E3A", "#FFF0E5"], acento: "#C8174B" },
  nostalgico: { fondo: "#E2B66B", colores: ["#8C4A2F", "#3E5C57", "#F3E3C3"], acento: "#8C4A2F" },
};

export function paletaPara(animo: string): Paleta {
  return PALETAS[animo] ?? PALETA_BASE;
}

const ACTIVIDAD: Record<string, string> = {
  estudiar: "estudiar",
  entrenar: "entrenar",
  relajarse: "relajarte",
  fiesta: "ir de fiesta",
  viajar: "viajar",
  trabajar: "trabajar",
};

const ANIMO: Record<string, string> = {
  feliz: "con el pecho ligero",
  tranquilo: "en calma",
  melancolico: "bajo la lluvia",
  motivado: "a todo vapor",
  romantico: "con el corazón blando",
  nostalgico: "como en otra época",
};

export function tituloDisco(animo: string, actividad: string): string {
  const act = ACTIVIDAD[actividad];
  const ani = ANIMO[animo];
  if (act && ani) return `Para ${act} ${ani}`;
  if (act) return `Para ${act}`;
  if (ani) return ani.charAt(0).toUpperCase() + ani.slice(1);
  return "Tu disco, sin título todavía";
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function cuarto(x: number, y: number, s: number, k: number, c: string): Forma {
  const d = [
    `M${x} ${y}h${s}A${s} ${s} 0 0 1 ${x} ${y + s}Z`,
    `M${x + s} ${y}L${x} ${y}A${s} ${s} 0 0 0 ${x + s} ${y + s}Z`,
    `M${x + s} ${y + s}L${x + s} ${y}A${s} ${s} 0 0 0 ${x} ${y + s}Z`,
    `M${x} ${y + s}L${x} ${y}A${s} ${s} 0 0 1 ${x + s} ${y + s}Z`,
  ][k];
  return { t: "path", d, c };
}

/**
 * Genera una portada abstracta determinista: misma semilla, paleta y energía
 * dan siempre las mismas formas. La energía (1-5) aumenta densidad y contraste.
 */
export function generarPortada(semilla: string, paleta: Paleta, energia: number): Forma[] {
  const rnd = mulberry32(hash(semilla));
  const { fondo, colores } = paleta;
  const pick = () => colores[Math.floor(rnd() * colores.length)];
  const formas: Forma[] = [{ t: "rect", x: 0, y: 0, w: 100, h: 100, c: fondo }];
  const composicion = Math.floor(rnd() * 3);

  if (composicion === 0) {
    const n = energia <= 2 ? 2 : energia <= 4 ? 3 : 4;
    const s = 100 / n;
    const vacio = 0.3 - energia * 0.04;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (rnd() < vacio) continue;
        const x = j * s;
        const y = i * s;
        const tipo = Math.floor(rnd() * 4);
        const c = pick();
        if (tipo === 1) formas.push({ t: "circ", cx: x + s / 2, cy: y + s / 2, r: s / 2, c });
        else if (tipo === 3) formas.push({ t: "rect", x, y, w: s, h: s, c });
        else formas.push(cuarto(x, y, s, Math.floor(rnd() * 4), c));
      }
    }
  } else if (composicion === 1) {
    const cy = 38 + rnd() * 14;
    const r = 26 + energia * 2.5;
    formas.push({ t: "circ", cx: 50, cy, r, c: colores[0] });
    const cortes = 2 + energia;
    for (let i = 0; i < cortes; i++) {
      formas.push({ t: "rect", x: 0, y: cy + 2 + ((i + 0.5) * r * 1.1) / cortes, w: 100, h: 1 + i * 0.9, c: fondo });
    }
    formas.push({ t: "rect", x: 0, y: 80, w: 100, h: 20, c: colores[1] });
    formas.push({ t: "circ", cx: 10 + rnd() * 80, cy: 12 + rnd() * 10, r: 5, c: colores[2] });
  } else {
    const cx = 25 + rnd() * 50;
    const cy = 25 + rnd() * 50;
    const n = 2 + energia;
    for (let i = 0; i < n; i++) {
      formas.push({
        t: "circ",
        cx,
        cy,
        r: 70 * (1 - i / n),
        c: i % 2 === 0 ? colores[(i / 2) % colores.length] : fondo,
      });
    }
  }
  return formas;
}
