# Sintonía: tu disco a medida

Formulario de preguntas (ánimo, actividad, energía, géneros, idioma, época, artistas favoritos). Una IA (Google Gemini, capa gratuita) elige 6 canciones, se verifican en Spotify y se pueden escuchar un tramo desde la app. Modo oscuro por defecto, con opción de modo claro, y diseño adaptado a móvil.

## Tecnología
Next.js 16, React 19, Tailwind CSS 4 y [HeroUI v3](https://www.heroui.com) para los componentes (botones de selección, slider, campo de texto, interruptor de tema, alertas y enlaces). Su tema está mapeado a la paleta de Sintonía en `app/globals.css`.

## Uso local
1. Clave de Gemini gratis: https://aistudio.google.com/apikey
2. App de Spotify (marca Web API): https://developer.spotify.com/dashboard
```bash
npm install
cp .env.example .env         # rellena las claves
npm run dev                  # http://localhost:3000
npm test
```

## Despliegue en Vercel
1. Sube el proyecto a GitHub (el `.env` no se sube: está en `.gitignore`).
2. En https://vercel.com/new importa el repositorio. Vercel detecta Next.js solo.
3. En **Settings → Environment Variables** añade `GEMINI_API_KEY`, `SPOTIFY_CLIENT_ID` y `SPOTIFY_CLIENT_SECRET` (y opcionalmente `GEMINI_MODEL`).
4. Pulsa Deploy.

## Notas
- Las claves solo viven en el servidor (`app/api/recomendar/route.ts`).
- La capa gratuita de Gemini tiene límites por minuto y por día; si se superan, la app muestra un error con opción de reintentar.
- Límite propio de 30 solicitudes por hora (valor de desarrollo; bájalo en `app/api/recomendar/route.ts` antes de publicar) por IP, en memoria (se reinicia por instancia serverless).
- El tema elegido se guarda en el navegador (`localStorage`).
- Diseño: `docs/superpowers/specs/2026-10-15-recomendador-musical-design.md`.
