# Backend

REST API built with Express 5, Prisma, PostgreSQL, and JWT-based session authentication via HTTP-only cookies.

Production deploy currently runs on the dedicated Vercel project `petshop-small-breeds-premium-backend`. The public frontend consumes it through a rewrite on the frontend Vercel project, so browser requests stay on the frontend domain.

## Stack

- Express 5
- Prisma
- PostgreSQL
- TypeScript
- Biome
- Vitest + Supertest

## Main routes

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/register` | Registration |
| `POST` | `/api/auth/login` | Login and session cookie issuance |
| `POST` | `/api/auth/logout` | Session cookie cleanup |
| `GET` | `/api/auth/me` | Authenticated session hydration |
| `POST` | `/api/public/booking-requests` | Public booking request intake |
| `GET` | `/api/dashboard/customer` | Customer dashboard |
| `GET` | `/api/dashboard/admin` | Admin dashboard |
| `GET/POST/PUT/DELETE` | `/api/dashboard/pets` | Pet CRUD |
| `GET/POST/PUT/DELETE` | `/api/dashboard/appointments` | Appointment CRUD |
| `GET/PUT/DELETE` | `/api/dashboard/clients` | Admin client management |
| `GET/POST/PUT/DELETE` | `/api/dashboard/products` | Inventory |

## Structure

```text
src/
├── domain/
├── infrastructure/
├── main/
│   ├── config/
│   ├── middlewares/
│   └── utils/
├── presentation/
└── test/
```

## Database and environment

Default setup:

```bash
cp .env.example .env
```

Local values:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/petshop?schema=public"
JWT_SECRET="change-me-to-a-strong-random-secret"
AUTH_COOKIE_NAME="petshop_session"
ALLOW_DEMO_SEED="false"
CORS_ORIGIN="http://localhost:5173,http://127.0.0.1:5173"
```

For production, `CORS_ORIGIN` must include the public frontend origin, for example `https://petshop-small-breeds.vercel.app`.

Test file:

```bash
cp .env.test.example .env.test
```

Test default:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/petshop?schema=test"
```

## Scripts

```bash
npm run dev
npm run dev:seed
npm run build
npm run start
npm run start:test
npm run prisma:push
npm run prisma:seed
npm run test
npm run lint
npm run type-check
```

`npm run prisma:seed` only runs in `test` or in local development with `ALLOW_DEMO_SEED=true`.

## Local Docker

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Start API + PostgreSQL:

```bash
docker compose up --build
```

## Tests

Tests use a real PostgreSQL database with seed-based resets. The suite covers:

- auth
- public booking requests
- `/auth/me`
- role-based restrictions
- creation and update of critical resources
