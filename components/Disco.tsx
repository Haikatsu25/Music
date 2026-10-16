import { Portada } from "./Portada";
import type { Paleta } from "@/lib/portada";

export type EstadoDisco = "reposo" | "cargando" | "listo";

export function Disco({
  semilla,
  paleta,
  energia,
  estado,
}: {
  semilla: string;
  paleta: Paleta;
  energia: number;
  estado: EstadoDisco;
}) {
  return (
    <div className="disco" data-estado={estado} role="img" aria-label="Portada de tu disco">
      <div className="disco-vinilo" />
      <div className="disco-portada">
        <Portada semilla={semilla} paleta={paleta} energia={energia} className="block h-full w-full" />
      </div>
    </div>
  );
}
