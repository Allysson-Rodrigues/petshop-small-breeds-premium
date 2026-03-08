# 🐾 Petshop Small Breeds Premium

Monorepo for a premium petshop application specialized in small breeds. Single Page Application (SPA) frontend (React + Vite + Tailwind CSS) with a backend API (Express + Prisma + PostgreSQL).

## Objective

Provide a premium petshop experience for small breeds with a React SPA frontend and an Express API backend.

## Status

Active.

## Stack

| Layer | Technology |
|--------|-----------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, Framer Motion, React Router 7 |
| **Backend** | Express 5, Prisma 6, PostgreSQL, TypeScript |
| **Auth** | JWT (jsonwebtoken + bcrypt) |
| **Linting** | ESLint (frontend), Biome (backend) |
| **Deployment**| Vercel (frontend SPA + backend API in separate projects) |

## Project Structure

```text
.
├── apps/
│   ├── backend/         Express API + Prisma (Clean Architecture)
│   └── frontend/        React SPA + Vite + Tailwind CSS
├── package.json         Monorepo (npm Workspaces)
├── vercel.json          Frontend Vercel config
└── apps/backend/vercel.json  Backend Vercel config
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

The backend seed creates demo users so anyone can test both areas:

- **Client**
  - Email: `cliente@petshop.com`
  - Password: `cliente123`
- **Client**
  - Email: `cliente2@petshop.com`
  - Password: `cliente456`
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
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require` |
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
npm run build    # Production build
npm run type-check
```

## Tests

```bash
# Frontend
npm --prefix apps/frontend run test
npm --prefix apps/frontend run test:e2e
npm --prefix apps/frontend run test:e2e:mobile

# Backend
npm --prefix apps/backend run test
npm --prefix apps/backend run test:integration
```

Backend integration tests require a dedicated PostgreSQL test database via `.env.test(.local)` or an explicit `DATABASE_URL` / `TEST_DATABASE_URL`.

## Deployment (Vercel)

The application is deployed as two separate Vercel projects:

- **Frontend:** static SPA built from the monorepo root `vercel.json`
- **Backend:** Express API deployed separately from `apps/backend/vercel.json`

```bash
# Frontend
npx vercel --prod

# Backend
cd apps/backend
npx vercel --prod
```

In production, configure the frontend `VITE_API_BASE_URL` to point to the deployed backend API.

## License

MIT
