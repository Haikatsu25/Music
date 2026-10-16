import { respuestasSchema, type Respuestas } from "./esquema";

export type Valores = {
  animo: string;
  actividad: string;
  energia: number;
  generos: string[];
  idioma: string;
  epoca: string;
  artistas: string;
};

export const VALORES_INICIALES: Valores = {
  animo: "",
  actividad: "",
  energia: 3,
  generos: [],
  idioma: "",
  epoca: "",
  artistas: "",
};

/** Devuelve las respuestas válidas listas para enviar, o null si el formulario está incompleto. */
export function aRespuestas(v: Valores): Respuestas | null {
  const r = respuestasSchema.safeParse({ ...v, artistas: v.artistas.trim() || undefined });
  return r.success ? r.data : null;
}
