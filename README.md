# Petshop Small Breeds Premium

Full stack monorepo for a premium pet shop focused on small breeds. The project combines a React/Vite SPA frontend with an Express/Prisma REST backend, JWT authentication, an RBAC-enabled dashboard, and automated quality checks with unit, integration, and E2E tests.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Frontend | React 19, Vite 7, Tailwind CSS 4, React Router 7, Framer Motion |
| Backend | Express 5, Prisma, TypeScript |
| Database | PostgreSQL |
| Auth | JWT Bearer + bcrypt |
| Quality | ESLint, Biome, Vitest, Playwright |
| Deploy | Frontend on Vercel, backend planned for Railway, database planned for Neon |

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
| `CORS_ORIGIN` | `http://localhost:5173,http://127.0.0.1:5173` |

Backend tests use `apps/backend/.env.test` based on `apps/backend/.env.test.example`.
The current default uses the local `petshop` database with a dedicated `test` schema to avoid collisions with development data.

Frontend:

| Variable | Default |
| --- | --- |
| `VITE_API_BASE_URL` | `/api` |

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

- `CI`: lint, type-check, build, backend tests, frontend unit tests, and frontend E2E
- `Deploy Smoke`: manual smoke check for frontend, API health, and admin login

Required secrets for the manual smoke workflow:

- `FRONTEND_URL`
- `API_HEALTH_URL`
- `API_LOGIN_URL`
- `SMOKE_ADMIN_EMAIL`
- `SMOKE_ADMIN_PASSWORD`

## Deployment

Recommended setup:

- Frontend: Vercel
- Backend: Railway
- Database: Neon

The repository is already documented for this split setup, but the actual infrastructure provisioning and secret management are still manual.
