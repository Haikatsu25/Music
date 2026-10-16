# Recomendador musical con IA — Diseño

## Objetivo
App web de portafolio. El usuario llena un formulario y una IA (Claude) devuelve recomendaciones musicales personalizadas con una explicación breve de cada una.

## Alcance
- Dentro: formulario mixto, endpoint de recomendación, tarjetas de resultado, validación, manejo de errores, límite de peticiones por IP, pruebas unitarias.
- Fuera (YAGNI): cuentas, historial, base de datos, integración con Spotify, streaming.

## Stack
Next.js (App Router) + TypeScript, Tailwind CSS, zod, SDK `@anthropic-ai/sdk`, Vitest. Despliegue en Vercel.

## Formulario
| Campo | Tipo | Obligatorio |
|---|---|---|
| Estado de ánimo | opción única (feliz, tranquilo, melancólico, motivado, romántico, nostálgico) | sí |
| Actividad | opción única (estudiar, entrenar, relajarse, fiesta, viajar, trabajar) | sí |
| Nivel de energía | 1–5 | sí |
| Géneros favoritos | selección múltiple, 1–5 | sí |
| Idioma preferido | opción única (español, inglés, sin preferencia) | sí |
| Época | opción única (actual, 2000s, 80s/90s, clásicos, sin preferencia) | sí |
| Artistas que ya te gustan | texto libre, máx. 200 caracteres | no |

## Arquitectura
```
app/page.tsx                    página con formulario y resultados
app/api/recomendar/route.ts     POST: valida, limita, llama a la IA
components/FormularioMusical.tsx
components/TarjetaRecomendacion.tsx
lib/esquema.ts                  zod: entrada y salida
lib/prompt.ts                   construye el prompt
lib/claude.ts                   cliente Anthropic, salida JSON
lib/limite.ts                   rate limit en memoria por IP
```

## Flujo
1. El cliente envía las respuestas por POST.
2. El servidor valida con zod (400 si es inválido) y aplica el límite por IP (429 si se excede).
3. `prompt.ts` arma el prompt; Claude responde con JSON `{ recomendaciones: [{ cancion, artista, motivo }] }` (6 ítems).
4. La salida se valida con zod; si no cumple, error 502.
5. La página muestra las tarjetas, o un mensaje de error con reintento.

## Decisiones
- La clave `ANTHROPIC_API_KEY` solo vive en el servidor.
- El prompt pide solo canciones reales y conocidas, y excluir artistas ya mencionados por el usuario. El texto libre se trata como dato, no como instrucciones.
- El límite en memoria es suficiente para un portafolio (se reinicia por instancia serverless; se documenta).
- Proveedor de IA: Google Gemini (capa gratuita) con `@google/genai`, salida en modo JSON. Modelo configurable por `GEMINI_MODEL` (por defecto `gemini-3.5-flash-lite`). Clave en `GEMINI_API_KEY`.

## Pruebas
Vitest sobre `esquema.ts`, `prompt.ts` y `limite.ts`. El cliente de IA se prueba con un doble.

## Diseño visual
Tema oscuro con acento cálido, tipografía grande, formulario en pasos de una sola página con chips seleccionables, tarjetas con animación de entrada. Responsive.
