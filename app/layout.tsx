import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Newsreader } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });
const newsreader = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-newsreader" });

export const metadata: Metadata = {
  title: "Sintonía: tu disco a medida",
  description: "Responde unas preguntas y una IA arma un disco con canciones para ti.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#12101f",
};

// Aplica el tema guardado antes de pintar para evitar un destello. Sin dato guardado, oscuro.
const SCRIPT_TEMA = `try{document.documentElement.dataset.theme=localStorage.getItem("tema")==="claro"?"claro":"oscuro"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      data-theme="oscuro"
      suppressHydrationWarning
      className={`${bricolage.variable} ${newsreader.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
