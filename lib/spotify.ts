import type { Recomendacion, RecomendacionEnriquecida } from "./esquema";

type Token = { valor: string; expira: number };
let token: Token | null = null;

export function reiniciarTokenParaPruebas() {
  token = null;
}

export function spotifyConfigurado(): boolean {
  return Boolean(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET);
}

async function obtenerToken(): Promise<string> {
  if (token && Date.now() < token.expira) return token.valor;

  const credenciales = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credenciales}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`Spotify token ${res.status}`);
  const datos = (await res.json()) as { access_token: string; expires_in: number };
  // Margen de 60 s para no usar un token a punto de caducar.
  token = { valor: datos.access_token, expira: Date.now() + (datos.expires_in - 60) * 1000 };
  return token.valor;
}

type PistaSpotify = { id: string; album?: { images?: { url: string }[] } };

async function buscar(q: string, bearer: string): Promise<PistaSpotify | null> {
  const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=1`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
  if (!res.ok) return null;
  const datos = (await res.json()) as { tracks?: { items?: PistaSpotify[] } };
  return datos.tracks?.items?.[0] ?? null;
}

/** Busca una canción en Spotify. Devuelve null si no existe o si Spotify falla. */
export async function buscarEnSpotify(
  cancion: string,
  artista: string,
): Promise<{ id: string; portada?: string } | null> {
  try {
    const bearer = await obtenerToken();
    const limpia = (s: string) => s.replace(/"/g, "");
    const pista =
      (await buscar(`track:"${limpia(cancion)}" artist:"${limpia(artista)}"`, bearer)) ??
      (await buscar(`${cancion} ${artista}`, bearer));
    if (!pista) return null;
    return { id: pista.id, portada: pista.album?.images?.[1]?.url ?? pista.album?.images?.[0]?.url };
  } catch {
    return null;
  }
}

/** Añade a cada recomendación su ID y portada de Spotify. Nunca lanza: si falla, devuelve las canciones tal cual. */
export async function enriquecer(
  items: Recomendacion[],
): Promise<{ recomendaciones: RecomendacionEnriquecida[]; verificado: boolean }> {
  if (!spotifyConfigurado()) return { recomendaciones: items, verificado: false };
  const recomendaciones = await Promise.all(
    items.map(async (r) => {
      const hallada = await buscarEnSpotify(r.cancion, r.artista);
      return hallada ? { ...r, spotifyId: hallada.id, portada: hallada.portada } : r;
    }),
  );
  return { recomendaciones, verificado: true };
}
