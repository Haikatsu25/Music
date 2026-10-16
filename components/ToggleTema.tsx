"use client";

import { useEffect, useState } from "react";

type Tema = "oscuro" | "claro";

export function ToggleTema() {
  const [tema, setTema] = useState<Tema | null>(null);

  useEffect(() => {
    setTema(document.documentElement.dataset.theme === "claro" ? "claro" : "oscuro");
  }, []);

  function cambiar() {
    const nuevo: Tema = tema === "claro" ? "oscuro" : "claro";
    document.documentElement.dataset.theme = nuevo;
    try {
      localStorage.setItem("tema", nuevo);
    } catch {
      // Sin almacenamiento disponible: el cambio vale solo para esta visita.
    }
    setTema(nuevo);
  }

  return (
    <button
      type="button"
      onClick={cambiar}
      disabled={tema === null}
      className="min-h-10 rounded-[3px] border-2 border-tinta px-3 py-1 font-display text-sm font-medium transition-colors hover:bg-superficie"
    >
      {tema === "claro" ? "Modo oscuro" : "Modo claro"}
    </button>
  );
}
