# Despliegue del Sistema Vania (paso a paso desde línea de comandos)

Hay **dos formas** de desplegar: **un solo repo y todo en Render** (recomendado) o frontend en GitHub Pages y API en Render por separado.

---

## Opción A: Despliegue unificado (un repo, todo en Render)

Un solo repositorio, un solo `git push`, y tanto el frontend como la API (y la base de datos) se despliegan en Render.

### Requisitos

- Cuenta en [GitHub](https://github.com)
- Cuenta en [Render](https://render.com) (registro gratuito)
- Git y Node.js en tu máquina

### Estructura del proyecto

El repo debe tener en la raíz las carpetas `api-vania` y `sistema-vania`, y el archivo `render.yaml`:

```
projeto-vania/          (o como se llame tu repo)
├── render.yaml         ← Blueprint unificado
├── api-vania/
│   ├── package.json
│   └── src/
└── sistema-vania/
    ├── package.json
    └── src/
```

### Paso 1: Subir el código a GitHub (un solo repo)

1. Crea un repositorio en https://github.com/new (ej: `projeto-vania`). No marques “Add a README”.
2. En la terminal, desde la **raíz del proyecto** (la carpeta que contiene `api-vania`, `sistema-vania` y `render.yaml`):

```bash
cd "/ruta/donde/está/projeto vania"
git init
git add .
git commit -m "Initial commit: Sistema Vania (frontend + API)"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/projeto-vania.git
git push -u origin main
```

Sustituye `TU_USUARIO` y el nombre del repo por los tuyos.

### Paso 2: Conectar Render con el repo (Blueprint)

1. Entra en https://dashboard.render.com
2. Conecta tu cuenta de GitHub si aún no lo has hecho.
3. **New** → **Blueprint**.
4. Selecciona el repositorio que acabas de subir (ej: `projeto-vania`).
5. Render detectará el `render.yaml` en la raíz y te mostrará:
   - **PostgreSQL** (vania-db)
   - **Web Service** (api-vania)
   - **Static Site** (sistema-vania)
6. Revisa la configuración y haz clic en **Apply**.

Render creará la base de datos, desplegará la API y el frontend. La primera vez puede tardar unos minutos.

### Paso 3: URLs y variables

- **API**: `https://api-vania-xxxx.onrender.com` (aparece en el panel del Web Service).
- **Frontend**: `https://sistema-vania-xxxx.onrender.com` (aparece en el panel del Static Site).

El `render.yaml` intenta rellenar `VITE_API_URL` del frontend con la URL de la API. Si el frontend no conecta bien, en Render ve al servicio **sistema-vania** → **Environment** y añade a mano:

- **Key**: `VITE_API_URL`  
- **Value**: `https://api-vania-xxxx.onrender.com` (tu URL real de la API)

### Paso 4: Siguientes despliegues (un solo comando)

Desde la raíz del proyecto:

```bash
cd "/ruta/donde/está/projeto vania"
git add .
git commit -m "Tu mensaje"
git push origin main
```

Render reconstruye solo los servicios cuyos archivos hayan cambiado (según `rootDir`: `api-vania` o `sistema-vania`). Un solo push despliega frontend y backend cuando toque.

---

## Opción B: Frontend en GitHub Pages y API en Render (dos repos)

Si prefieres el frontend en GitHub Pages y la API por separado en Render:

### B.1 Un solo repo pero solo API en Render

Puedes seguir usando el mismo repo con `api-vania` y `sistema-vania`, y en Render crear **solo** el Web Service apuntando a ese repo con **Root Directory** = `api-vania`. El frontend lo despliegas a mano en GitHub Pages (ver B.3).

### B.2 API en Render (base de datos + Web Service)

1. En Render: **New** → **PostgreSQL** → plan Free → **Create Database**.
2. **New** → **Web Service** → elige el repo (o el que tenga `api-vania`).
3. **Root Directory**: `api-vania`.
4. **Build Command**: `npm install && npm run build`
5. **Start Command**: `npm start`
6. En **Environment** añade `NODE_ENV=production`, `DATABASE_URL` (cópiala desde el panel de la base de datos; Render suele ofrecer “Internal Database URL”) y `JWT_SECRET` (generado o manual).
7. Crea el servicio y anota la URL de la API (ej: `https://api-vania-xxxx.onrender.com`).

### B.3 Frontend en GitHub Pages

1. En el repo, en **Settings** → **Pages** → **Source**: **GitHub Actions**.
2. **Settings** → **Secrets and variables** → **Actions** → New secret: `VITE_API_URL` = `https://api-vania-xxxx.onrender.com`.
3. El workflow en `sistema-vania/.github/workflows/deploy-pages.yml` hará build y deploy en cada push a `main`.

Si usas un repo solo para el frontend (solo carpeta `sistema-vania`), entonces en ese repo no hay `rootDir`; el workflow y los comandos son los mismos, solo que desde la raíz de ese repo.

---

## Resumen de comandos

### Despliegue unificado (Opción A)

```bash
cd "/ruta/projeto vania"
git add .
git commit -m "Cambios"
git push origin main
```

### Solo build local (sin subir)

```bash
# API
cd api-vania && npm ci && npm run build && npm start

# Frontend (desde sistema-vania)
cd sistema-vania && npm ci && npm run build
```

### Repo por separado (Opción B)

```bash
# En el repo del frontend
cd sistema-vania
git add .
git commit -m "Cambios frontend"
git push origin main

# En el repo de la API (o en el mismo repo con rootDir api-vania)
cd api-vania
git add .
git commit -m "Cambios API"
git push origin main
```

---

## Notas

- **Render (free)**: el servicio puede “dormirse” tras inactividad; la primera petición puede tardar unos segundos.
- **CORS**: La API usa `cors({ origin: true })`, así que acepta peticiones desde cualquier origen (incluido el frontend en Render o GitHub Pages).
- No subas `.env` con secretos. En Render configura las variables en el panel; para GitHub Actions usa Secrets.
- Si el frontend no llama bien a la API, comprueba que `VITE_API_URL` esté definida en el build (Render env o secret de GitHub) y que sea la URL pública de la API (con `https://`).
