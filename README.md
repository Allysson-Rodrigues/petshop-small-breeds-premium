# 🐾 Petshop Small Breeds Premium

Monorepo for a premium petshop application specialized in small breeds. Single Page Application (SPA) frontend (React + Vite + Tailwind CSS) with a backend API (Express + Prisma + SQLite).

## Stack

| Layer | Technology |
|--------|-----------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, Framer Motion, React Router 7 |
| **Backend** | Express 5, Prisma 7, SQLite (Better-SQLite3), TypeScript |
| **Auth** | JWT (jsonwebtoken + bcrypt) |
| **Testing** | Vitest (unit), Playwright (E2E) |
| **Linting** | ESLint (frontend), Biome (backend) |
| **Deployment**| Vercel (frontend SPA) |

## Project Structure

```text
.
├── .github/workflows/   CI (lint, tests, E2E)
├── apps/
│   ├── backend/         Express API + Prisma (Clean Architecture)
│   └── frontend/        React SPA + Vite + Tailwind CSS
├── package.json         Monorepo (npm Workspaces)
└── vercel.json          Deployment config (frontend)
```

## Prerequisites

- **Node.js 24+** and **npm 10+**
- Alternatively, use Docker (see below)

## Setup

```bash
# Install dependencies and create apps/backend/.env from the template
npm run setup
```

## Development

```bash
# Backend + Frontend (concurrent)
npm run dev:all

# Or individually
npm run dev:backend
npm run dev:frontend
```

`npm run dev:backend` runs migrations + seed automatically so the demo credentials work out of the box.

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api/health |

## Test Credentials (Demo)

The backend seed creates two demo users so anyone can test both areas:

- **Client**
  - Email: `cliente@petshop.com`
  - Password: `cliente123`
- **Admin**
  - Email: `admin@petshop.com`
  - Password: `admin123`

These credentials are also shown in the login screen for convenience (copy buttons). Do not use them in production.

## Docker (alternative)

```bash
docker run --rm -it -p 5173:5173 -p 3000:3000 \
  -v "$PWD":/app -v petshop_node_modules:/app/node_modules \
  -w /app node:24 bash -lc \
  'npm install && npm run setup:env && (npm run dev -w backend & npm run dev -w frontend -- --host 0.0.0.0 --port 5173) && wait'
```

## Environment Variables

### Backend (`apps/backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | SQLite path | `file:./dev.db` |
| `JWT_SECRET` | Secret for JWT | — (**required**) |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | `http://localhost:5173` |

### Frontend (`VITE_*` variables)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | API base URL | `/api` (local proxy) |
| `VITE_ADMIN_EMAILS` | Admin emails (comma-separated) | `admin@petshop.com` |

## Quality

```bash
npm run lint     # Lint (both workspaces)
npm run test     # Unit tests (Vitest)
npm run build    # Production build

# E2E Tests (requires backend running)
cd apps/frontend && npx playwright test
```

## Deployment (Vercel)

The frontend is deployed to Vercel as a static SPA. The `vercel.json` file configures the build, output, and rewrites.

```bash
npx vercel --prod
```

> **Note:** The backend is not deployed to Vercel. For a complete production environment, host the backend separately and configure `VITE_API_BASE_URL`.

## License

MIT
