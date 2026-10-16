import { z } from "zod";

export const ANIMOS = ["feliz", "tranquilo", "melancolico", "motivado", "romantico", "nostalgico"] as const;
export const ACTIVIDADES = ["estudiar", "entrenar", "relajarse", "fiesta", "viajar", "trabajar"] as const;
export const GENEROS = [
  "pop", "rock", "hiphop", "electronica", "jazz", "lofi", "reggaeton",
  "salsa", "indie", "clasica", "metal", "rnb", "folk", "kpop",
] as const;
export const IDIOMAS = ["espanol", "ingles", "sin_preferencia"] as const;
export const EPOCAS = ["actual", "2000s", "80s_90s", "clasicos", "sin_preferencia"] as const;

export const respuestasSchema = z.object({
  animo: z.enum(ANIMOS),
  actividad: z.enum(ACTIVIDADES),
  energia: z.number().int().min(1).max(5),
  generos: z.array(z.enum(GENEROS)).min(1).max(5),
  idioma: z.enum(IDIOMAS),
  epoca: z.enum(EPOCAS),
  artistas: z.string().max(200).optional(),
});

export const resultadoSchema = z.object({
  recomendaciones: z
    .array(
      z.object({
        cancion: z.string().min(1),
        artista: z.string().min(1),
        motivo: z.string().min(1),
      }),
    )
    .min(1)
    .max(10),
});

export type Respuestas = z.infer<typeof respuestasSchema>;
export type Resultado = z.infer<typeof resultadoSchema>;
export type Recomendacion = Resultado["recomendaciones"][number];
export type RecomendacionEnriquecida = Recomendacion & { spotifyId?: string; portada?: string };
