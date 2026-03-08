# Backend

REST API built with Express 5, Prisma, PostgreSQL, and JWT authentication.

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
| `POST` | `/api/auth/login` | Login |
| `GET` | `/api/auth/me` | Authenticated session hydration |
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
CORS_ORIGIN="http://localhost:5173,http://127.0.0.1:5173"
```

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
- `/auth/me`
- role-based restrictions
- creation and update of critical resources
