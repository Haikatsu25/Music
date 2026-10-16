import { NextResponse } from "next/server";
import { respuestasSchema } from "@/lib/esquema";
import { ErrorIA, recomendar } from "@/lib/ia";
import { crearLimitador } from "@/lib/limite";
import { enriquecer } from "@/lib/spotify";

// Gemini + Spotify tardan unos segundos; este margen evita cortes en Vercel.
export const maxDuration = 30;

const permitir = crearLimitador({ max: 30, ventanaMs: 60 * 60 * 1000 });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!permitir(ip)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo más tarde." },
      { status: 429 },
    );
  }

  let cuerpo: unknown;
  try {
    cuerpo = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const respuestas = respuestasSchema.safeParse(cuerpo);
  if (!respuestas.success) {
    return NextResponse.json({ error: "Respuestas inválidas" }, { status: 400 });
  }

  try {
    const resultado = await recomendar(respuestas.data);
    return NextResponse.json(await enriquecer(resultado.recomendaciones));
  } catch (e) {
    console.error(e);
    const mensaje = e instanceof ErrorIA ? e.message : "No se pudo generar la recomendación";
    return NextResponse.json({ error: mensaje }, { status: 502 });
  }
}
