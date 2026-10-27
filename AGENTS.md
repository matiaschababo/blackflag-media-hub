<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# BLACKFLAG MEDIA HUB – AGENT DIRECTIVES & ARCHITECTURE GUIDE

> ### ⚡ MANDATORY VIBECODER AGENT DIRECTIVES (BINDING)
> 1. **"Cut taglines, helper text and secondary labels. If a screen needs them to make sense, fix the layout."**  
>    *Never clutter the interface with patronizing explanatory text, descriptive subtitles, or secondary labels explaining what a button or view does. If a screen isn't self-evident, fix the layout, typography, and visual hierarchy.*
>
> 2. **"Make the best decision that will elevate all three: the user experience (UX), developer experience (DX), and agent experience (AX) always, without breaking anything."**  
>    *Every single change must simultaneously optimize:*  
>    - **UX (User Experience):** Ultra-clean, fast, dense, professional, high-contrast, zero AI filler.  
>    - **DX (Developer Experience):** Strict TypeScript, zero build warnings, modular, maintainable, atomic components.  
>    - **AX (Agent Experience):** Deterministic state, structured data contracts, clear keys, reliable API bridges.

Este repositorio (`matiaschababo/blackflag-media-hub`) aloja la plataforma de **Content Management y Metrics Hub global** del holding digital de Matías Chababo:
- **BlackFlag Blueprint (`BF`):** Finanzas offshore y estructuración B2B para founders tech.
- **Podmon (`POD`):** Narrativa cinematográfica y thrillers sandbox en Farming Simulator 25.
- **Level Pop (`LP`):** Carreras de canicas neón y autitos sensoriales a 60 FPS (YouTube Shorts + TikTok @levelpopstudio).

## Estructura de Datos y Modelo React Context
- **Origen de Datos:** [`src/data/mockData.ts`](src/data/mockData.ts) contiene los canales iniciales (`INITIAL_CHANNELS`), episodios (`INITIAL_EPISODES`) y la matriz de clips (`INITIAL_CLIPS`).
- **Estado de Aplicación:** Administrado en [`src/context/HoldingContext.tsx`](src/context/HoldingContext.tsx).
- **Radar de Stock:** Calcula en tiempo real el *runway* de días restantes dividiendo los clips en cola (`SCHEDULED` + `PENDING`) por el ritmo de publicación diario del canal (`shortsPerDay`).
- **Parrilla 24/7:** Visualiza los slots de publicación diarios de cada canal.
- **Miniaturas:** Los fotogramas y carátulas se alojan en [`public/thumbnails/`](public/thumbnails/) (ej. `lp-c01-thumb.jpg`).

## Integración con Supabase PostgreSQL (`holding-media-db`)
- **Base de Datos Cloud:** Proyecto `ayfftcgvacbrniyrkety` en región US-East-1.
- **Tablas:** `channels`, `episodes`, `clips` (32 clips cargados), `publications`.
- **Sincronización:** React Context (`HoldingContext.tsx`) consulta Supabase al iniciar y escucha cambios en vivo mediante WebSockets (`postgres_changes`).
- **Vista Global TODOS:** Permite visualizar el catálogo consolidado de todos los canales o filtrar individualmente por Level Pop, BlackFlag o Podmon.

## Despliegue en Producción
Todo cambio en `master` se despliega a producción en [https://blackflag-media-hub.vercel.app/](https://blackflag-media-hub.vercel.app/) mediante Vercel CLI:
```bash
npx vercel --prod --yes
```
