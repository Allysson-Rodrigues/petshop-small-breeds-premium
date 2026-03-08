# Petshop Small Breeds Premium

Monorepo full stack de um petshop premium para raças pequenas. O projeto combina frontend SPA em React/Vite com backend REST em Express/Prisma, autenticação JWT, dashboard com RBAC e automação de qualidade com testes unitários, integração e E2E.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Frontend | React 19, Vite 7, Tailwind CSS 4, React Router 7, Framer Motion |
| Backend | Express 5, Prisma, TypeScript |
| Banco | PostgreSQL |
| Auth | JWT Bearer + bcrypt |
| Qualidade | ESLint, Biome, Vitest, Playwright |
| Deploy | Frontend em Vercel, backend planejado para Railway, banco planejado para Neon |

## Estrutura

```text
.
├── apps/
│   ├── backend/
│   └── frontend/
├── .github/workflows/
├── package.json
└── RUNBOOK.md
```

## Setup local

Pré-requisitos:

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

Depois disso:

```bash
npm run dev:backend
npm run dev:frontend
```

Ou, em paralelo:

```bash
npm run dev:all
```

## Variáveis principais

Backend em `apps/backend/.env`:

| Variável | Exemplo |
| --- | --- |
| `PORT` | `3000` |
| `NODE_ENV` | `development` |
| `DATABASE_URL` | `postgresql://postgres:postgres@127.0.0.1:5432/petshop?schema=public` |
| `JWT_SECRET` | `change-me-to-a-strong-random-secret` |
| `CORS_ORIGIN` | `http://localhost:5173,http://127.0.0.1:5173` |

Testes backend usam `apps/backend/.env.test` baseado em `apps/backend/.env.test.example`.
O padrão atual usa o banco local `petshop` com schema dedicado `test`, evitando colisão com os dados de desenvolvimento.

Frontend:

| Variável | Default |
| --- | --- |
| `VITE_API_BASE_URL` | `/api` |

## Credenciais demo

- Admin: `admin@petshop.com` / `admin123`
- Cliente: `cliente@petshop.com` / `cliente123`
- Cliente 2: `cliente2@petshop.com` / `cliente456`

## Scripts úteis

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

## Testes

Backend:

- integração de auth
- permissões de dashboard
- CRUD administrativo básico

Frontend:

- unitários de `AuthProvider` e route guards com Vitest
- E2E com Playwright cobrindo login, dashboard, fluxos críticos e smoke mobile

## CI e Smoke

Workflows versionados:

- `CI`: lint, type-check, build, backend tests, frontend unit tests e frontend E2E
- `Deploy Smoke`: smoke manual para frontend, health da API e login admin

Secrets esperados para o smoke manual:

- `FRONTEND_URL`
- `API_HEALTH_URL`
- `API_LOGIN_URL`
- `SMOKE_ADMIN_EMAIL`
- `SMOKE_ADMIN_PASSWORD`

## Deploy

Fluxo recomendado:

- Frontend: Vercel
- Backend: Railway
- Banco: Neon

O repositório já está preparado documentalmente para esse split, mas o provisionamento real da infra e dos secrets ainda é manual.
