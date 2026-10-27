# 🚀 BlackFlag Holding Media Hub

Plataforma unificada de **Content Management y Metrics Hub** para los canales digitales del holding de Matías Chababo:
- **BlackFlag Blueprint (`BF`):** Finanzas offshore y B2B Tier 1.
- **Podmon (`POD`):** Narrativa cinematográfica y thrillers en Farming Simulator 25.
- **Level Pop (`LP`):** Carreras de canicas neón y autitos a 60 FPS (COPPA Compliant).

---

## 📖 Manual Operativo y Arquitectura

Para conocer en detalle el funcionamiento, los roles, el modelo de datos relacional en Supabase y el pipeline de publicación desatendida, consulta:
👉 **[APP_HOLDING_MANUAL.md](./APP_HOLDING_MANUAL.md)**

---

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 16.4.2 (App Router, Turbopack, Tailwind CSS con diseño anti-slop Swiss/Linear).
- **Base de Datos Cloud:** PostgreSQL en Supabase Cloud (`holding-media-db`).
- **Sincronización:** Supabase Realtime (`postgres_changes`).
- **Automatización:** Python Daemon (`scripts/holding_bot_uploader.py`) con YouTube Data API v3 Oficial.
- **Producción:** Desplegado en Vercel &rarr; [https://blackflag-media-hub.vercel.app](https://blackflag-media-hub.vercel.app)

---

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Correr servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```
