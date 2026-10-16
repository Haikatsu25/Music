"use client";

import { useState } from "react";
import { Portada } from "./Portada";
import type { RecomendacionEnriquecida } from "@/lib/esquema";
import type { Paleta } from "@/lib/portada";

const enlace =
  "underline decoration-linea decoration-2 underline-offset-4 hover:decoration-tinta focus-visible:decoration-tinta";

export function ListaCanciones({
  items,
  verificado,
  paleta,
  energia,
  ocupada,
}: {
  items: RecomendacionEnriquecida[];
  verificado: boolean;
  paleta: Paleta;
  energia: number;
  ocupada: boolean;
}) {
  // Solo un reproductor abierto a la vez: abrir otro cierra el anterior.
  const [abierta, setAbierta] = useState<string | null>(null);

  return (
    <ol className={`lista-aparece transition-opacity ${ocupada ? "opacity-40" : ""}`} aria-busy={ocupada}>
      {items.map((r, i) => {
        const clave = `${r.cancion}-${r.artista}`;
        const q = encodeURIComponent(`${r.cancion} ${r.artista}`);
        const enSpotify = r.spotifyId
          ? `https://open.spotify.com/track/${r.spotifyId}`
          : `https://open.spotify.com/search/${q}`;
        const sonando = abierta === clave;
        return (
          <li
            key={clave}
            className="grid grid-cols-[1.25rem_4.25rem_1fr] gap-x-4 border-t-2 border-tinta py-6 sm:grid-cols-[1.5rem_5.5rem_1fr] sm:gap-x-5"
          >
            <span className="pt-1 font-display text-lg font-semibold tabular-nums text-suave">{i + 1}</span>
            {r.portada ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.portada} alt="" className="block aspect-square w-full object-cover" />
            ) : (
              <Portada
                semilla={`${r.cancion}|${r.artista}`}
                paleta={paleta}
                energia={energia}
                className="block aspect-square w-full"
              />
            )}
            <div className="min-w-0">
              <h3 className="font-display text-2xl font-bold leading-tight">{r.cancion}</h3>
              <p className="font-display text-base font-medium text-suave">{r.artista}</p>
              <p className="mt-2 max-w-[60ch] italic leading-relaxed">{r.motivo}</p>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-display text-sm font-medium">
                {r.spotifyId ? (
                  <button
                    type="button"
                    onClick={() => setAbierta(sonando ? null : clave)}
                    aria-expanded={sonando}
                    className="rounded-[3px] border-2 border-tinta min-h-10 px-3 py-1 transition-colors hover:bg-superficie aria-expanded:bg-tinta aria-expanded:text-papel"
                  >
                    {sonando ? "Cerrar reproductor" : "Escuchar un tramo"}
                  </button>
                ) : (
                  verificado && (
                    <span className="font-serif text-base font-normal italic text-suave">
                      No la encontramos en Spotify; puede que la IA se la haya inventado.
                    </span>
                  )
                )}
                <a className={enlace} href={enSpotify} target="_blank" rel="noopener noreferrer">
                  Abrir en Spotify
                </a>
                <a
                  className={enlace}
                  href={`https://www.youtube.com/results?search_query=${q}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buscar en YouTube
                </a>
              </div>

            </div>
            {sonando && r.spotifyId && (
              <iframe
                title={`Reproductor de ${r.cancion}, de ${r.artista}`}
                src={`https://open.spotify.com/embed/track/${r.spotifyId}?utm_source=generator`}
                width="100%"
                height="80"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="col-span-full mt-4 block max-w-[36rem] border-0"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
