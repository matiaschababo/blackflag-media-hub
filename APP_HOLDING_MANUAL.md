# 📘 Manual Operativo Maestro & Arquitectura: Holding Media Hub

Este documento es la guía definitiva y el registro integral de **Holding Media Hub** (`blackflag-media-hub`), la plataforma de gestión de contenido, distribución multicanal y analítica para los canales digitales del holding de **Matías Chababo**:
* **BlackFlag Blueprint (`BF`):** Finanzas offshore, estructuración corporativa y B2B Tier 1 para fundadores tech y nómadas digitales.
* **Podmon (`POD`):** Narrativa cinematográfica, suspenso rural y drama sandbox en Farming Simulator 25.
* **Level Pop (`LP`):** Carreras de canicas neón y carreras de autitos sensoriales a 60 FPS (COPPA Compliant para YouTube Shorts, TikTok e Instagram).

---

## 🎯 1. Propósito y Filosofía del Sistema

A diferencia de una productora de streaming en vivo tradicional (donde se cazan momentos al vuelo), el Holding opera como una **fábrica digital automatizada de alta precisión**:
1. **Larga duración + Clip-First:** Cada episodio largo (15 a 30 minutos) se concibe desde el guion con 10 nodos virales nativos de 30 a 60 segundos listos para derivar a formato vertical (9:16).
2. **Cero pérdida de contenido ("Dinero sobre la mesa"):** Todo clip producido se distribuye en 5 plataformas simultáneas (YouTube Shorts, TikTok, Instagram Reels, Facebook Reels, X/Twitter).
3. **Costo de distribución \$0 (Zero-Token Overhead):** La subida no consume tokens de inteligencia artificial ni depende de plataformas SaaS de suscripción mensual (Zapier, Make, etc.); se realiza mediante scripts en Python conectados a las APIs oficiales.
4. **Visibilidad Total y Estado Único:** Una base de datos relacional centralizada en la nube (PostgreSQL en Supabase) sincroniza el frontend en Next.js con los demonios de subida locales o en servidor.

---

## 🏢 2. Los 3 Canales del Holding

### A. BlackFlag Blueprint (`blackflag` / `BF`)
* **Nicho:** Finanzas offshore, elusión fiscal legal (residencia fiscal, IBCs, trusts, cuentas bancarias en jurisdicciones sin impuestos).
* **Audiencia:** Emprendedores de software, inversores de capital de riesgo y profesionales de altos ingresos de países hispanohablantes y Tier 1.
* **Cadencia:** 2 shorts por día (14:00 ART / 12:00 EST y 20:00 ART / 18:00 EST).
* **Canales y Redes Oficiales:**
  * YouTube: `@BlackFlagBlueprint`
  * Instagram: `@blackflagblueprint`
  * TikTok: `@blackflagblueprint`
  * X (Twitter): `@blackflagprint`
* **Voz y Sonido:** ElevenLabs v4 (Voz: *Matt*), ritmo de podcast de negocios de alto perfil, foley psychoacústico sutil y diseño de sonido al milisegundo.

### B. Podmon (`podmon` / `POD`)
* **Nicho:** Sandbox narrativo, ficción rural dramática y suspenso cinematográfico utilizando Farming Simulator 25 como motor visual.
* **Audiencia:** Gamers de Estados Unidos, Reino Unido y Europa que consumen historias de supervivencia, deudas y misterio rural.
* **Cadencia:** 2 shorts por día (16:00 ART / 14:00 EST y 22:00 ART / 20:00 EST).
* **Canales y Redes Oficiales:**
  * YouTube: `@PodmonStory`
  * Instagram: `@podmonstory`
  * TikTok: `@podmonstory`
  * X (Twitter): `@podmonstory`

### C. Level Pop (`levelpop` / `LP`)
* **Nicho:** Carreras de canicas neón (Neon Marbles) y circuitos de autitos de carreras a 60 FPS con música electrónica y ritmo cinético satisfactorio (ASMR visual).
* **Audiencia:** Co-viewing familiar y niños/adolescentes a nivel global (100% libre de diálogo, universal y amigable con las normas COPPA).
* **Cadencia:** 3 shorts por día (10:00 ART / 08:00 EST, 15:00 ART / 13:00 EST y 21:00 ART / 19:00 EST).
* **Canales y Redes Oficiales:**
  * YouTube: [`@LevelPopStudio`](https://www.youtube.com/@LevelPopStudio)
  * TikTok: [`@levelpopstudio`](https://www.tiktok.com/@levelpopstudio)
  * Instagram: [`@levelpopstudio`](https://www.instagram.com/levelpopstudio/)
  * Facebook: `Level Pop Studio`
  * X (Twitter): `@levelpopstudio`

---

## ⚙️ 3. Arquitectura Técnica del Software

La plataforma está diseñada con una arquitectura desacoplada para garantizar velocidad, tolerancia offline y persistencia segura en la nube:

```
[ Frontend: Next.js 16 + Tailwind CSS ]
      │ (Vía @supabase/supabase-js)
      ▼
[ Base de Datos: PostgreSQL en Supabase Cloud ]
   ├── channels     (Canales, configuración, horarios y redes)
   ├── episodes     (Episodios largos de producción)
   ├── clips        (Clips 9:16 con hooks, captions y estado)
   └── publications (Cola de publicación por fecha y slot)
      ▲
      │ (Vía psycopg2 / Python Client)
[ Daemon de Subida: scripts/holding_bot_uploader.py ]
      │ (YouTube Data API v3 Oficial)
      ▼
[ Redes Sociales: YouTube Shorts / TikTok / Instagram ]
```

### Tecnologías Clave:
* **Framework:** Next.js 16.4.2 (App Router, Turbopack habilitado).
* **Diseño y Estilo:** Tailwind CSS con directivas de **Taste Skill** (eliminación total de clichés de IA: sin esferas de neón difusas, sin gradientes extravagantes; interfaz Linear/Swiss Dark limpia, profesional y utilitaria con números tabulares).
* **Base de Datos Cloud:** PostgreSQL alojado en Supabase (Región `us-east-1` Norte de Virginia).
* **Sincronización:** Supabase Realtime (`postgres_changes`) para reflejar en el navegador cualquier cambio efectuado por los bots o por otros dispositivos sin recargar la página.
* **Hosting Frontend:** Vercel Producción ([https://blackflag-media-hub.vercel.app](https://blackflag-media-hub.vercel.app)).

---

## 🗄️ 4. Modelo de Datos Relacional (Supabase Cloud)

### 1. Tabla `channels`
* `id` (TEXT, PK): Identificador único (`blackflag`, `podmon`, `levelpop`).
* `name` (TEXT): Nombre formal del canal.
* `short_code` (TEXT): Código de 2 o 3 letras (`BF`, `POD`, `LP`).
* `niche` (TEXT): Categoría y descripción temática.
* `audience` (TEXT): Segmento objetivo demográfico.
* `accent_color` (TEXT): Código hexadecimal de acento visual.
* `avatar_url` (TEXT): Ruta o URL del logotipo del canal.
* `banner_url` (TEXT): Ruta o URL de la portada del canal.
* `shorts_per_day` (INTEGER): Cadencia objetivo de publicación diaria.
* `time_slots` (JSONB): Lista de horarios oficiales de publicación (ej. `["14:00 ART", "20:00 ART"]`).
* `accounts` (JSONB): Handles y perfiles en YouTube, Instagram, TikTok, Facebook y X.
* `stats` (JSONB): Suscriptores, visualizaciones totales, horas de reproducción y facturación estimada.

### 2. Tabla `episodes`
* `id` (TEXT, PK): Identificador único del episodio (ej. `bf-ep01`, `lp-ep01`).
* `channel_id` (TEXT, FK &rarr; `channels.id`): Canal al que pertenece.
* `episode_number` (INTEGER): Número de entrega dentro de la temporada.
* `title` (TEXT): Título del video largo.
* `duration` (TEXT): Duración en formato `MM:SS`.
* `youtube_url` (TEXT): Enlace oficial al video publicado en YouTube.
* `status` (TEXT): `PUBLISHED`, `SCHEDULED` o `IN_PRODUCTION`.
* `release_date` (TEXT): Fecha oficial de lanzamiento.
* `thumbnail_url` (TEXT): Carátula horizontal (16:9).
* `script_status` (TEXT): `DRAFT`, `REVIEWED` o `LOCKED`.
* `audio_engine` (TEXT): Motor de voz y audio empleado (ej. *ElevenLabs v4*, *Suno v3.5*).
* `render_engine` (TEXT): Motor gráfico empleado (ej. *Remotion 60 FPS*, *Blender bpy*).
* `clips_count` (INTEGER): Total de clips derivados del episodio.
* `total_views` (BIGINT): Vistas acumuladas del video largo.
* `avd_percent` (NUMERIC): Retención promedio de visualización (Average View Duration).
* `rpm` (NUMERIC): Ingreso por cada mil reproducciones (Revenue Per Mille).

### 3. Tabla `clips`
* `id` (TEXT, PK): Identificador único del clip (ej. `bf-c01`, `lp-c12`).
* `episode_id` (TEXT, FK &rarr; `episodes.id`): Episodio fuente del corte.
* `channel_id` (TEXT, FK &rarr; `channels.id`): Canal correspondiente.
* `clip_number` (INTEGER): Número secuencial del clip.
* `title` (TEXT): Título descriptivo para archivo y metadatos.
* `file_path` (TEXT): Nombre o ruta del archivo de video (`.mp4`).
* `hook` (TEXT): Frase gancho de los primeros 3 segundos.
* `duration_sec` (INTEGER): Duración exacta en segundos (siempre < 60s).
* `timestamps` (JSONB): Minuto de inicio y fin dentro del episodio largo.
* `captions` (JSONB): Textos y copies optimizados para Instagram, TikTok, YouTube, Facebook y X.
* `platforms` (JSONB): Objeto con el estado (`PENDING`, `SCHEDULED`, `PUBLISHED`, `FAILED`), horario asignado (`slotTime`) y URL de publicación en cada red social.
* `is_urgent` (BOOLEAN): Marca de prioridad alta para inyección inmediata en la parrilla.
* `priority_order` (INTEGER): Orden en la cola de salida.
* `views` (BIGINT): Total de reproducciones acumuladas sumando todas las plataformas.

### 4. Tabla `publications`
* `id` (TEXT, PK): Identificador de la publicación (`pub_clipId_dia_slot`).
* `clip_id` (TEXT, FK &rarr; `clips.id`): Clip asignado al turno.
* `channel_id` (TEXT, FK &rarr; `channels.id`): Canal emisor.
* `platform` (TEXT): Red destino (`YOUTUBE_SHORT`, `INSTAGRAM_REEL`, `TIKTOK`, etc.).
* `slot_time` (TEXT): Horario formal del turno (ej. `14:00 ART`).
* `scheduled_date` (TEXT): Fecha programada de emisión (`YYYY-MM-DD`).
* `status` (TEXT): `PENDING`, `SCHEDULED`, `PUBLISHED` o `CANCELLED`.
* `published_at` (TIMESTAMPTZ): Momento exacto de confirmación en la red.
* `youtube_video_id` (TEXT): ID de video devuelto por la API de YouTube.
* `url` (TEXT): Enlace público al video publicado.
* `error` (TEXT): Registro en caso de fallo para reintentos automáticos.

---

## 🎛️ 5. Módulos y Operación en la Aplicación Web

### A. Cabina de Mando ([ContentOverview.tsx](file:///D:/Antigravity%20Projects/blackflag-media-hub/src/components/content-manager/ContentOverview.tsx))
1. **Selector de Canal:** En el Navbar y en el banner superior permite alternar instantáneamente entre BlackFlag, Podmon y Level Pop.
2. **Radar de Stock & Runway:** Calcula automáticamente cuántos días de contenido quedan en depósito según los clips vírgenes (`PENDING`) divididos por la cadencia diaria (`shortsPerDay`).
3. **Inventario por Plataforma:** Muestra el desglose de clips pendientes, programados y publicados en cada una de las 5 redes sociales, con enlaces directos para abrir los perfiles oficiales.

### B. Parrilla Editorial 24/7 ([ParrillaPublicacion.tsx](file:///D:/Antigravity%20Projects/blackflag-media-hub/src/components/content-manager/ParrillaPublicacion.tsx))
1. **Modo Calendario Semanal:** Muestra la grilla de Lunes a Domingo con los slots horarios exactos de cada canal.
2. **Auto-Programar Semana:** Botón inteligente que toma los clips vírgenes disponibles y los asigna automáticamente a los turnos vacíos de la semana, sincronizando el estado en Supabase de forma inmediata.
3. **Asignación Manual:** Permite añadir o retirar clips de turnos individuales en un solo clic.

### C. Catálogo de Episodios y Repositorio de Clips
* Permite inspeccionar el guion, el motor de render, la duración, la miniatura y los 10 cortes derivados de cada entrega larga.
* Incluye el disparador **Ripple Shift**: si un tema se vuelve tendencia o explota en reproducciones, al presionar *Ripple Shift* el sistema marca el clip como urgente y lo coloca como el siguiente turno de salida inmediato en todas las plataformas.

---

## 🤖 6. Subida Desatendida y Automatización (Python Daemon)

El script [scripts/holding_bot_uploader.py](file:///D:/Antigravity%20Projects/blackflag-media-hub/scripts/holding_bot_uploader.py) es el motor que ejecuta la publicación final sin intervención humana:

### Flujo de Ejecución:
1. **Conexión Transaccional:** El script se conecta a la base de datos de Supabase mediante la variable `DATABASE_URL`.
2. **Monitoreo de Turnos:** Cada 30 a 60 segundos consulta la tabla `publications` buscando registros con `status = 'SCHEDULED'` cuya hora coincida con el horario actual.
3. **Localización del Archivo:** Busca el archivo `.mp4` en la carpeta de staging (`D:\Holding_Clips_Staging`) o en las descargas de Telegram Desktop (`C:\Users\Mati\Downloads\Telegram Desktop`).
4. **Subida por API Oficial:**
   - Emplea la **YouTube Data API v3** oficial con tokens OAuth (`token_blackflag.json`, `token_podmon.json`, `token_levelpop.json`).
   - Aplica las directivas obligatorias de título limpio (prohibido colocar el hashtag `#Shorts` en el título si ya está categorizado como vertical).
   - Respeta estrictamente la directiva COPPA y General Audience: `selfDeclaredMadeForKids = False` en el 100% de los canales y videos (incluyendo Level Pop, BlackFlag y Podmon) para preservar comentarios activos, interacciones comunitarias y monetización de anuncios personalizados.
5. **Cierre de Ciclo en Supabase:** Al completarse la subida, actualiza el registro en `publications` y en `clips` a `PUBLISHED`, guardando el ID del video y la URL pública.

---

## 🛡️ 7. Directivas de Seguridad y Buenas Prácticas

1. **Variables de Entorno:**
   * Las claves públicas (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) están contenidas en `.env.local` y se compilan en el cliente web.
   * Las claves privadas (`SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`) solo se emplean en backend, scripts de mantenimiento y demonios seguros de Python.
2. **Tolerancia Offline y Resiliencia:**
   * Si por alguna razón el servicio de Supabase no responde o la conexión de red se interrumpe momentáneamente, el frontend activa de inmediato los datos de reserva de [`mockData.ts`](file:///D:/Antigravity%20Projects/blackflag-media-hub/src/data/mockData.ts), impidiendo que la pantalla quede en blanco o lance errores visuales.
3. **Despliegues en Producción:**
   * Cada modificación confirmada en la rama `master` de GitHub se despliega automáticamente a Vercel con el comando `npx vercel --prod --yes`.
