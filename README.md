# Projeto Vania

Sistema fullstack: frontend (React + Vite) e API (Node + Express + TypeORM + PostgreSQL).

## Estrutura

- **`api-vania/`** — Backend (API REST, PostgreSQL)
- **`sistema-vania/`** — Frontend (React, MUI)

---

## Rodar a aplicação local (front + backend)

### Opção 1: Tudo com Docker (um comando)

Na **raiz do projeto**:

```bash
npm run up
```

- **Frontend:** http://localhost (porta 80)  
- **API:** http://localhost:3000  
- PostgreSQL sobe junto em segundo plano.

Para ver os logs no terminal: `npm run up:logs`.  
Para parar: `npm run down`.

---

### Opção 2: Sem Docker (desenvolvimento, 3 terminais)

Requer Node.js e PostgreSQL (ou só o Postgres via Docker).

**Terminal 1 — Banco de dados**

Na raiz do projeto:

```bash
npm run postgres
```

Isso sobe só o PostgreSQL (porta 5432) com usuário/senha/banco `vania_dev`.

**Terminal 2 — API**

```bash
cd api-vania
cp .env.local.example .env.local   # só na primeira vez
npm install
npm run dev
```

A API fica em http://localhost:3000.

**Terminal 3 — Frontend**

```bash
cd sistema-vania
npm install
npm run dev
```

O frontend fica em http://localhost:5173 (Vite) e já aponta para a API em `http://localhost:3000` (via `.env.example` / `VITE_API_URL`).

Resumo:

| O quê    | URL                  |
|----------|----------------------|
| Frontend | http://localhost:5173 |
| API      | http://localhost:3000 |
| Postgres | localhost:5432       |

## Despliegue (un solo repo, todo en Render)

1. Sube este proyecto a un repositorio de GitHub (la raíz debe contener `api-vania`, `sistema-vania` y `render.yaml`).
2. En [Render](https://dashboard.render.com): **New** → **Blueprint** y conecta ese repo.
3. Render creará la base de datos, la API y el frontend a partir de `render.yaml`.
4. Para futuros despliegues: `git push origin main`.

Guía paso a paso (incluye GitHub Pages como alternativa): **[sistema-vania/DEPLOY.md](sistema-vania/DEPLOY.md)**.

## Scripts en la raíz

| Script | Descripción |
|--------|-------------|
| `npm run build:api` | Instala y compila la API |
| `npm run build:frontend` | Instala y compila el frontend |
| `npm run build:all` | Compila API y frontend (para probar antes de subir) |
