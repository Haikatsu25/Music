import { generarPortada, type Paleta } from "@/lib/portada";

export function Portada({
  semilla,
  paleta,
  energia,
  className,
}: {
  semilla: string;
  paleta: Paleta;
  energia: number;
  className?: string;
}) {
  const formas = generarPortada(semilla, paleta, energia);
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {formas.map((f, i) =>
        f.t === "rect" ? (
          <rect key={i} className="forma" x={f.x} y={f.y} width={f.w} height={f.h} style={{ fill: f.c }} />
        ) : f.t === "circ" ? (
          <circle key={i} className="forma" cx={f.cx} cy={f.cy} r={f.r} style={{ fill: f.c }} />
        ) : (
          <path key={i} className="forma" d={f.d} style={{ fill: f.c }} />
        ),
      )}
    </svg>
  );
}
