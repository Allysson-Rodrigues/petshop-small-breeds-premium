# Petshop Small Breeds Premium — Backend

RESTful API built with Express 5, Prisma 7, and TypeScript, organized using Clean Architecture principles (`domain`, `presentation`, `main`).

## Stack

- **Framework:** Express 5 + TypeScript
- **ORM:** Prisma 7 (SQLite via Better-SQLite3)
- **Auth:** JWT (jsonwebtoken) + bcrypt
- **Linting:** Biome

## Development

```bash
# From the monorepo root
npm run setup        # Install dependencies + create .env
npm run dev:backend  # Start with tsx watch

# Or directly from the backend directory
cd apps/backend
cp .env.example .env  # Adjust the values!
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment (`development` / `production` / `test`) | `development` |
| `DATABASE_URL` | SQLite database path | `file:./dev.db` |
| `JWT_SECRET` | Secret for JWT | — (**required**) |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | `http://localhost:5173` |

> ⚠️ **Security:** Never commit `.env` to the repository. The `.gitignore` file already covers `*.env` and `dev.db`.

## Prisma (SQLite)

```bash
cd apps/backend
npx prisma migrate deploy   # Apply migrations
npx prisma studio           # Visual database UI
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with hot-reload (tsx watch) |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Start compiled build |
| `npm run lint` | Biome check |
| `npm run lint:fix` | Biome auto-fix |

## Architecture Structure

```text
src/
├── domain/           # Entities, use cases, repositories (pure layer)
├── presentation/     # Controllers (framework-independent)
├── infrastructure/   # Prisma adapters and external services
├── main/             # Configuration, routes, composition root
├── app.ts            # Express application bootstrap
└── server.ts         # Server entry point
```

## Docker

```bash
cd apps/backend
docker build -t petshop-backend .
docker run -p 3000:3000 --env-file .env petshop-backend
```

> The `.dockerignore` file prevents `.env` and `dev.db` from being copied to the image.

## Main Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/health` | API health check |
| `POST` | `/api/auth/login` | User login (returns JWT) |
| `POST` | `/api/auth/register` | New user registration |
| `GET` | `/api/dashboard/*` | Protected dashboard routes |
