"use client";

import { Button, Input, Label, Slider, TextField, ToggleButton, ToggleButtonGroup } from "@heroui/react";
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

const NIVELES_ENERGIA = ["Muy suave", "Suave", "Media", "Alta", "A tope"];
const MAX_GENEROS = 5;

const tituloPregunta = "font-display text-xl font-semibold";
// Sombra dura en el color del ánimo para la opción elegida; el resto del aspecto lo da HeroUI.
const claseOpcion =
  "h-auto min-h-10 rounded-[3px] border-2 border-tinta px-3.5 py-1.5 font-display text-[0.95rem] data-[selected=true]:-translate-x-px data-[selected=true]:-translate-y-px data-[selected=true]:shadow-[3px_3px_0_var(--acento)]";

function Pregunta({ titulo, ayuda, children }: { titulo: string; ayuda?: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className={`mb-3 ${tituloPregunta}`}>
        {titulo}
        {ayuda && <span className="ml-3 font-serif text-base font-normal italic text-suave">{ayuda}</span>}
      </p>
      {children}
    </div>
  );
}

/** Una sola opción elegida (como un radio), con botones de selección de HeroUI. */
function EleccionUnica({
  titulo,
  opciones,
  valor,
  onCambio,
}: {
  titulo: string;
  opciones: Opcion[];
  valor: string;
  onCambio: (v: string) => void;
}) {
  return (
    <Pregunta titulo={titulo}>
      <ToggleButtonGroup
        aria-label={titulo}
        selectionMode="single"
        disallowEmptySelection
        isDetached
        selectedKeys={valor ? new Set<string>([valor]) : new Set<string>()}
        onSelectionChange={(keys) => onCambio(String([...keys][0] ?? ""))}
        className="flex-wrap justify-start gap-2.5"
      >
        {opciones.map((o) => (
          <ToggleButton key={o.valor} id={o.valor} className={claseOpcion}>
            {o.etiqueta}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Pregunta>
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
  const completoGeneros = valores.generos.length >= MAX_GENEROS;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (puedeEnviar && !cargando) onEnviar();
      }}
      className="space-y-9"
    >
      <EleccionUnica titulo="¿Cómo te sientes hoy?" opciones={ANIMOS} valor={valores.animo} onCambio={(v) => set("animo", v)} />
      <EleccionUnica titulo="¿Qué vas a hacer?" opciones={ACTIVIDADES} valor={valores.actividad} onCambio={(v) => set("actividad", v)} />

      <Slider
        minValue={1}
        maxValue={5}
        step={1}
        value={valores.energia}
        onChange={(v) => set("energia", Array.isArray(v) ? v[0] : v)}
        className="w-full"
      >
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <Label className={tituloPregunta}>¿Con cuánta energía?</Label>
          <span className="font-serif italic text-suave">{NIVELES_ENERGIA[valores.energia - 1]}</span>
        </div>
        <Slider.Track>
          <Slider.Fill />
          <Slider.Thumb />
        </Slider.Track>
      </Slider>

      <Pregunta titulo="¿Qué géneros te gustan?" ayuda={`${valores.generos.length} de ${MAX_GENEROS}`}>
        <ToggleButtonGroup
          aria-label="Géneros favoritos"
          selectionMode="multiple"
          isDetached
          selectedKeys={new Set<string>(valores.generos)}
          onSelectionChange={(keys) => set("generos", [...keys].map(String).slice(0, MAX_GENEROS))}
          className="flex-wrap justify-start gap-2.5"
        >
          {GENEROS.map((o) => (
            <ToggleButton
              key={o.valor}
              id={o.valor}
              isDisabled={completoGeneros && !valores.generos.includes(o.valor)}
              className={claseOpcion}
            >
              {o.etiqueta}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Pregunta>

      <EleccionUnica titulo="¿En qué idioma?" opciones={IDIOMAS} valor={valores.idioma} onCambio={(v) => set("idioma", v)} />
      <EleccionUnica titulo="¿De qué época?" opciones={EPOCAS} valor={valores.epoca} onCambio={(v) => set("epoca", v)} />

      <TextField fullWidth value={valores.artistas} onChange={(v) => set("artistas", v)} maxLength={200}>
        <Label className={`mb-3 block ${tituloPregunta}`}>
          Artistas que ya te gustan
          <span className="ml-3 font-serif text-base font-normal italic text-suave">opcional</span>
        </Label>
        <Input
          placeholder="Bad Bunny, Daft Punk, Rosalía"
          className="rounded-[3px] border-2 border-tinta font-serif text-base"
        />
      </TextField>

      <div className="space-y-3">
        <Button
          type="submit"
          size="lg"
          fullWidth
          isDisabled={!puedeEnviar || cargando}
          className="h-auto rounded-[3px] border-2 border-tinta py-3.5 font-display text-lg font-semibold shadow-[4px_4px_0_var(--acento)] disabled:border-linea disabled:shadow-none"
        >
          {cargando ? "Armando tu disco…" : "Armar mi disco"}
        </Button>
        {!puedeEnviar && (
          <p className="font-serif text-sm italic text-suave">
            Falta responder ánimo, actividad, géneros, idioma y época.
          </p>
        )}
      </div>
    </form>
  );
}
