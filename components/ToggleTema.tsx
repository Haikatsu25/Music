"use client";

import { Label, Switch } from "@heroui/react";
import { useEffect, useState } from "react";

type Tema = "dark" | "light";

export function ToggleTema() {
  const [tema, setTema] = useState<Tema | null>(null);

  useEffect(() => {
    setTema(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function cambiar(claro: boolean) {
    const nuevo: Tema = claro ? "light" : "dark";
    document.documentElement.dataset.theme = nuevo;
    try {
      localStorage.setItem("tema", nuevo);
    } catch {
      // Sin almacenamiento disponible: el cambio vale solo para esta visita.
    }
    setTema(nuevo);
  }

  return (
    <Switch isSelected={tema === "light"} isDisabled={tema === null} onChange={cambiar}>
      <Switch.Content>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Label className="font-display text-sm font-medium">Modo claro</Label>
      </Switch.Content>
    </Switch>
  );
}
