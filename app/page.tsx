"use client";

import { Alert, Button } from "@heroui/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Disco } from "@/components/Disco";
import { FormularioMusical } from "@/components/FormularioMusical";
import { ListaCanciones } from "@/components/ListaCanciones";
import { ToggleTema } from "@/components/ToggleTema";
import type { RecomendacionEnriquecida } from "@/lib/esquema";
import { paletaPara, tituloDisco } from "@/lib/portada";
import { VALORES_INICIALES, aRespuestas, type Valores } from "@/lib/valores";

const botonSecundario = "h-auto min-h-10 rounded-[3px] border-2 border-tinta px-4 py-1.5 font-display";

export default function Home() {
  const [valores, setValores] = useState<Valores>(VALORES_INICIALES);
  const [vista, setVista] = useState<"form" | "resultado">("form");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultados, setResultados] = useState<RecomendacionEnriquecida[] | null>(null);
  const [verificado, setVerificado] = useState(false);
  const encabezadoResultado = useRef<HTMLHeadingElement>(null);

  const respuestas = aRespuestas(valores);
  const paleta = paletaPara(valores.animo);
  const semilla = `${valores.actividad}|${valores.generos.join(",")}|${valores.epoca}`;
  const estado = cargando ? "cargando" : vista === "resultado" ? "listo" : "reposo";

  useEffect(() => {
    if (vista === "resultado") encabezadoResultado.current?.focus();
  }, [vista]);

  async function pedir() {
    if (!respuestas) return;
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(respuestas),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error ?? "No se pudo armar el disco.");
      setResultados(datos.recomendaciones);
      setVerificado(Boolean(datos.verificado));
      setVista("resultado");
    } catch (e) {
      // fetch lanza TypeError cuando no hay red; su mensaje viene en inglés y no ayuda.
      setError(
        e instanceof TypeError
          ? "No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo."
          : e instanceof Error
            ? e.message
            : "No se pudo armar el disco.",
      );
    } finally {
      setCargando(false);
    }
  }

  const bloqueError = error && (
    <Alert status="danger" className="mt-6">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title className="font-display">No se pudo armar el disco</Alert.Title>
        <Alert.Description>{error}</Alert.Description>
        <Button variant="outline" size="sm" onPress={pedir} className={`mt-3 ${botonSecundario}`}>
          Reintentar
        </Button>
      </Alert.Content>
    </Alert>
  );

  return (
    <main style={{ "--acento": paleta.acento } as CSSProperties} className="min-h-screen">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-8 lg:grid-cols-[minmax(0,27rem)_minmax(0,1fr)] lg:gap-20 lg:py-14">
        <aside className="max-w-md lg:sticky lg:top-12 lg:self-start">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="font-display text-2xl font-extrabold tracking-tight">Sintonía</p>
            <ToggleTema />
          </div>
          <div className="max-w-[17rem] sm:max-w-none">
            <Disco semilla={semilla} paleta={paleta} energia={valores.energia} estado={estado} />
          </div>
          <h2 className="mt-7 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {tituloDisco(valores.animo, valores.actividad)}
          </h2>
          <p className="mt-2 italic text-suave">
            {vista === "resultado" && resultados
              ? `${resultados.length} canciones elegidas por una IA a partir de tus respuestas.`
              : "La portada cambia con cada respuesta."}
          </p>
        </aside>

        <section className="min-w-0 lg:pt-12">
          {vista === "form" ? (
            <>
              <h1 className="max-w-[18ch] font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
                Responde y te armamos un disco
              </h1>
              <p className="mb-10 mt-4 max-w-[48ch] text-suave">
                Contesta y mira cómo se forma la portada. Al final, una IA elige las canciones.
              </p>
              <FormularioMusical
                valores={valores}
                onCambio={setValores}
                onEnviar={pedir}
                puedeEnviar={respuestas !== null}
                cargando={cargando}
              />
              {bloqueError}
            </>
          ) : (
            <>
              <h1
                ref={encabezadoResultado}
                tabIndex={-1}
                className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight outline-none sm:text-5xl"
              >
                Tu disco está listo
              </h1>
              <div className="mb-8 mt-5 flex flex-wrap gap-3">
                <Button variant="outline" onPress={() => setVista("form")} className={botonSecundario}>
                  Cambiar respuestas
                </Button>
                <Button variant="outline" onPress={pedir} isDisabled={cargando} className={botonSecundario}>
                  {cargando ? "Buscando otras…" : "Pedir otras canciones"}
                </Button>
              </div>
              {bloqueError}
              {resultados && (
                <div aria-live="polite" className="mt-2">
                  <ListaCanciones
                    items={resultados}
                    verificado={verificado}
                    paleta={paleta}
                    energia={valores.energia}
                    ocupada={cargando}
                  />
                </div>
              )}
            </>
          )}
          <p className="mt-16 max-w-[60ch] text-sm italic text-suave">
            Las canciones las elige una IA y puede equivocarse. Comprueba que existan antes de escucharlas.
          </p>
        </section>
      </div>
    </main>
  );
}
