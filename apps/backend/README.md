# Petshop Small Breeds Premium — Backend

Backend API for the `petshop-small-breeds-premium` monorepo (Express + Prisma + TypeScript), organized in layers (`domain`, `presentation`, `main`).

## Requirements
- Node.js 24+ (see `engines` in the root `package.json`)
- npm 10+

## Run (from monorepo root)
```bash
npm run setup
npm run dev:backend
```

## Run (backend only)
```bash
cd apps/backend
npm install
cp .env.example .env
npm run dev
```

## Environment Variables
Based on `apps/backend/.env.example`:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="development-secret"
CORS_ORIGIN="http://localhost:5173"
```

## Prisma (SQLite)
Apply migrations when needed:
```bash
cd apps/backend
npx prisma migrate deploy
```

## Tests & Quality
```bash
cd apps/backend
npm run lint
npm test
```

## Structure
```text
.
├── src/
│   ├── domain/        # Entities and use cases (pure business logic)
│   ├── presentation/  # Controllers (framework-independent)
│   ├── main/          # Infrastructure, adapters, composition root
│   ├── app.ts         # Express app bootstrap
│   └── server.ts      # App entry point
├── dist/              # Compiled output (not versioned)
├── .env               # Local secrets (not versioned)
└── package.json       # Scripts and dependencies
```

## Notes
- `apps/backend/prisma/dev.db` is a local development database and is not committed to Git.
