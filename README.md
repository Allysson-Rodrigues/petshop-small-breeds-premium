# Petshop Small Breeds Premium

Full stack monorepo for a premium pet shop focused on small breeds. The project combines a React/Vite SPA frontend with an Express/Prisma REST backend, JWT-based session authentication via HTTP-only cookies, an RBAC-enabled dashboard, and automated quality checks with unit, integration, and E2E tests.

The public website can open booking requests without prior login via `POST /api/public/booking-requests`, while authenticated sessions are hydrated through `GET /api/auth/me`.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Frontend | React 19, Vite 7, Tailwind CSS 4, React Router 7, Framer Motion |
| Backend | Express 5, Prisma, TypeScript |
| Database | PostgreSQL |
| Auth | JWT em cookie HTTP-only + bcrypt |
| Quality | ESLint, Biome, Vitest, Playwright |
| Deploy | Frontend on Vercel, backend on Vercel, database PostgreSQL managed externally |

## Structure

```text
.
├── apps/
│   ├── backend/
│   └── frontend/
├── .github/workflows/
├── package.json
└── RUNBOOK.md
```

Repository hygiene:

- single lockfile at the repository root
- frontend and backend documentation kept inside each workspace
- local-only artifacts such as `.vercel/`, `dist/`, `playwright-report/`, `test-results/`, and development databases are not part of the repository

## Local setup

Prerequisites:

- Node.js 24+
- npm 10+
- Docker com `docker compose`

Passos:

```bash
npm install --legacy-peer-deps
npm run setup:env
npm run db:up
npm run backend:db:push
npm run backend:db:seed
```

`npm run backend:db:seed` exports `ALLOW_DEMO_SEED=true` for local demo data and is blocked in production.

After that:

```bash
npm run dev:backend
npm run dev:frontend
```

Ou, em paralelo:

```bash
npm run dev:all
```

## Main variables

Backend variables in `apps/backend/.env`:

| Variable | Example |
| --- | --- |
| `PORT` | `3000` |
| `NODE_ENV` | `development` |
| `DATABASE_URL` | `postgresql://postgres:postgres@127.0.0.1:5432/petshop?schema=public` |
| `JWT_SECRET` | `change-me-to-a-strong-random-secret` |
| `AUTH_COOKIE_NAME` | `petshop_session` |
| `ALLOW_DEMO_SEED` | `false` |
| `CORS_ORIGIN` | `http://localhost:5173,http://127.0.0.1:5173` |

Backend tests use `apps/backend/.env.test` based on `apps/backend/.env.test.example`.
The current default uses the local `petshop` database with a dedicated `test` schema to avoid collisions with development data.

Frontend:

| Variable | Default |
| --- | --- |
| `VITE_API_BASE_URL` | `/api` |

In production, the frontend keeps using `/api` and the Vercel project rewrites those requests to the dedicated backend deployment. That preserves same-origin requests in the browser and avoids CORS issues for session cookies.

## Demo credentials

- Admin: `admin@petshop.com` / `admin123`
- Customer: `cliente@petshop.com` / `cliente123`
- Customer 2: `cliente2@petshop.com` / `cliente456`

## Useful scripts

```bash
npm run lint
npm run type-check
npm run build
npm run test:backend
npm run test:frontend
npm run test:e2e
npm run db:up
npm run db:down
```

The demo seed is blocked in production and only runs automatically in `test` or when local commands export `ALLOW_DEMO_SEED=true`.

## Tests

Backend:

- auth integration
- dashboard permissions
- core admin CRUD

Frontend:

- `AuthProvider` and route guard unit tests with Vitest
- Playwright E2E covering login, dashboard, critical flows, and mobile smoke

## CI and smoke

Versioned workflows:

- `CI`: lint, type-check, build, backend tests, frontend unit tests, frontend E2E, and a repeated stability pass for critical Playwright flows
- `Deploy Smoke`: manual smoke check for frontend, frontend `/api` rewrite, API health, and admin login

Required secrets for the manual smoke workflow:

- `FRONTEND_URL`
- `API_HEALTH_URL`
- `SMOKE_ADMIN_EMAIL`
- `SMOKE_ADMIN_PASSWORD`

## Deployment

Current production setup:

- Frontend: Vercel project `petshop-small-breeds-premium`
- Backend: Vercel project `petshop-small-breeds-premium-backend`
- Database: PostgreSQL configured through backend environment variables

Production requests from the public site use the frontend domain and are rewritten to the backend deployment through [vercel.json](/home/allysson/projetos/01-projetos/petshop-small-breeds-premium/vercel.json).
