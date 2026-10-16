"use client";

import type { Valores } from "@/lib/valores";

type Opcion = { valor: string; etiqueta: string };

const ANIMOS: Opcion[] = [
  { valor: "feliz", etiqueta: "Feliz" },
  { valor: "tranquilo", etiqueta: "Tranquilo" },
  { valor: "melancolico", etiqueta: "Melancólico" },
  { valor: "motivado", etiqueta: "Motivado" },
  { valor: "romantico", etiqueta: "Romántico" },
  { valor: "nostalgico", etiqueta: "Nostálgico" },
];
const ACTIVIDADES: Opcion[] = [
  { valor: "estudiar", etiqueta: "Estudiar" },
  { valor: "entrenar", etiqueta: "Entrenar" },
  { valor: "relajarse", etiqueta: "Relajarme" },
  { valor: "fiesta", etiqueta: "Ir de fiesta" },
  { valor: "viajar", etiqueta: "Viajar" },
  { valor: "trabajar", etiqueta: "Trabajar" },
];
const GENEROS: Opcion[] = [
  { valor: "pop", etiqueta: "Pop" },
  { valor: "rock", etiqueta: "Rock" },
  { valor: "hiphop", etiqueta: "Hip hop" },
  { valor: "electronica", etiqueta: "Electrónica" },
  { valor: "jazz", etiqueta: "Jazz" },
  { valor: "lofi", etiqueta: "Lo-fi" },
  { valor: "reggaeton", etiqueta: "Reggaetón" },
  { valor: "salsa", etiqueta: "Salsa" },
  { valor: "indie", etiqueta: "Indie" },
  { valor: "clasica", etiqueta: "Clásica" },
  { valor: "metal", etiqueta: "Metal" },
  { valor: "rnb", etiqueta: "R&B" },
  { valor: "folk", etiqueta: "Folk" },
  { valor: "kpop", etiqueta: "K-pop" },
];
const IDIOMAS: Opcion[] = [
  { valor: "espanol", etiqueta: "Español" },
  { valor: "ingles", etiqueta: "Inglés" },
  { valor: "sin_preferencia", etiqueta: "Me da igual" },
];
const EPOCAS: Opcion[] = [
  { valor: "actual", etiqueta: "Actual" },
  { valor: "2000s", etiqueta: "Años 2000" },
  { valor: "80s_90s", etiqueta: "80s y 90s" },
  { valor: "clasicos", etiqueta: "Clásicos" },
  { valor: "sin_preferencia", etiqueta: "Me da igual" },
];

const MAX_GENEROS = 5;

function Etiqueta({
  activa,
  onClick,
  children,
  deshabilitada,
  modo,
}: {
  activa: boolean;
  onClick: () => void;
  children: React.ReactNode;
  deshabilitada?: boolean;
  modo: "radio" | "check";
}) {
  const semantica =
    modo === "radio" ? { role: "radio", "aria-checked": activa } : { "aria-pressed": activa };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={deshabilitada}
      {...semantica}
      className={`rounded-[3px] border-2 border-tinta min-h-10 px-3.5 py-1.5 font-display text-[0.95rem] font-medium transition-[background-color,box-shadow,transform] disabled:cursor-not-allowed disabled:border-linea disabled:text-suave/60 ${
        activa
          ? "-translate-x-px -translate-y-px bg-tinta text-papel shadow-[3px_3px_0_var(--acento)]"
          : "bg-transparent hover:bg-superficie"
      }`}
    >
      {children}
    </button>
  );
}

function Pregunta({
  titulo,
  ayuda,
  modo,
  children,
}: {
  titulo: string;
  ayuda?: string;
  modo: "radio" | "check";
  children: React.ReactNode;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 font-display text-xl font-semibold">
        {titulo}
        {ayuda && <span className="ml-3 font-serif text-base font-normal italic text-suave">{ayuda}</span>}
      </legend>
      <div role={modo === "radio" ? "radiogroup" : "group"} aria-label={titulo} className="flex flex-wrap gap-2.5">
        {children}
      </div>
    </fieldset>
  );
}

export function FormularioMusical({
  valores,
  onCambio,
  onEnviar,
  puedeEnviar,
  cargando,
}: {
  valores: Valores;
  onCambio: (v: Valores) => void;
  onEnviar: () => void;
  puedeEnviar: boolean;
  cargando: boolean;
}) {
  const set = <K extends keyof Valores>(k: K, v: Valores[K]) => onCambio({ ...valores, [k]: v });

  function alternarGenero(g: string) {
    const { generos } = valores;
    if (generos.includes(g)) set("generos", generos.filter((x) => x !== g));
    else if (generos.length < MAX_GENEROS) set("generos", [...generos, g]);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (puedeEnviar && !cargando) onEnviar();
      }}
      className="space-y-9"
    >
      <Pregunta titulo="¿Cómo te sientes hoy?" modo="radio">
        {ANIMOS.map((o) => (
          <Etiqueta key={o.valor} modo="radio" activa={valores.animo === o.valor} onClick={() => set("animo", o.valor)}>
            {o.etiqueta}
          </Etiqueta>
        ))}
      </Pregunta>

      <Pregunta titulo="¿Qué vas a hacer?" modo="radio">
        {ACTIVIDADES.map((o) => (
          <Etiqueta key={o.valor} modo="radio" activa={valores.actividad === o.valor} onClick={() => set("actividad", o.valor)}>
            {o.etiqueta}
          </Etiqueta>
        ))}
      </Pregunta>

      <fieldset className="min-w-0">
        <legend className="mb-3 font-display text-xl font-semibold">¿Con cuánta energía?</legend>
        <div role="radiogroup" aria-label="Nivel de energía" className="flex items-end gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={valores.energia === n}
              aria-label={`${n} de 5`}
              onClick={() => set("energia", n)}
              style={{ height: `${1.1 + n * 0.55}rem` }}
              className={`w-8 rounded-[3px] border-2 border-tinta transition-colors ${
                n <= valores.energia ? "bg-tinta" : "bg-transparent hover:bg-superficie"
              }`}
            />
          ))}
          <span className="ml-3 pb-0.5 font-serif italic text-suave">
            {["Muy suave", "Suave", "Media", "Alta", "A tope"][valores.energia - 1]}
          </span>
        </div>
      </fieldset>

      <Pregunta titulo="¿Qué géneros te gustan?" ayuda={`${valores.generos.length} de ${MAX_GENEROS}`} modo="check">
        {GENEROS.map((o) => {
          const activa = valores.generos.includes(o.valor);
          return (
            <Etiqueta
              key={o.valor}
              modo="check"
              activa={activa}
              deshabilitada={!activa && valores.generos.length >= MAX_GENEROS}
              onClick={() => alternarGenero(o.valor)}
            >
              {o.etiqueta}
            </Etiqueta>
          );
        })}
      </Pregunta>

      <Pregunta titulo="¿En qué idioma?" modo="radio">
        {IDIOMAS.map((o) => (
          <Etiqueta key={o.valor} modo="radio" activa={valores.idioma === o.valor} onClick={() => set("idioma", o.valor)}>
            {o.etiqueta}
          </Etiqueta>
        ))}
      </Pregunta>

      <Pregunta titulo="¿De qué época?" modo="radio">
        {EPOCAS.map((o) => (
          <Etiqueta key={o.valor} modo="radio" activa={valores.epoca === o.valor} onClick={() => set("epoca", o.valor)}>
            {o.etiqueta}
          </Etiqueta>
        ))}
      </Pregunta>

      <div>
        <label htmlFor="artistas" className="mb-3 block font-display text-xl font-semibold">
          Artistas que ya te gustan
          <span className="ml-3 font-serif text-base font-normal italic text-suave">opcional</span>
        </label>
        <input
          id="artistas"
          type="text"
          maxLength={200}
          value={valores.artistas}
          onChange={(e) => set("artistas", e.target.value)}
          placeholder="Bad Bunny, Daft Punk, Rosalía"
          className="w-full rounded-[3px] border-2 border-tinta bg-superficie px-3.5 py-2.5 font-serif placeholder:italic placeholder:text-suave/70"
        />
      </div>

      <button
        type="submit"
        disabled={!puedeEnviar || cargando}
        className="w-full rounded-[3px] border-2 border-tinta bg-tinta px-6 py-3.5 font-display text-lg font-semibold text-papel shadow-[4px_4px_0_var(--acento)] transition-[transform,box-shadow] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_var(--acento)] disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:border-linea disabled:bg-linea disabled:text-suave disabled:shadow-none"
      >
        {cargando ? "Armando tu disco…" : "Armar mi disco"}
      </button>
      {!puedeEnviar && (
        <p className="-mt-5 font-serif text-sm italic text-suave">
          Falta responder ánimo, actividad, géneros, idioma y época.
        </p>
      )}
    </form>
  );
}
