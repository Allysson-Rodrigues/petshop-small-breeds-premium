# Petshop Small Breeds Premium

Monorepo using npm Workspaces, integrating a frontend (React + Vite) and a backend (Express + Prisma).

## Project Structure

```text
.
├── .github/workflows/  CI (lint/tests/e2e)
├── apps/
│   ├── backend/        Express API + Prisma
│   └── frontend/       React + Vite SPA
├── package.json        Monorepo configuration (Workspaces)
└── vercel.json         Unified deployment
```

## Getting Started

### Requirements
- Node.js 24+ and npm 10+ (to run the backend and monorepo scripts)
- If your local Node version is lower, use Docker (below)

### Setup
Installs dependencies and creates `apps/backend/.env` from the template:

```bash
npm run setup
```

### Development
Start backend + frontend:

```bash
npm run dev:all
```

Or individually using the Workspaces pattern:
- `npm run dev -w backend`
- `npm run dev -w frontend`

### Development via Docker
```bash
docker run --rm -it -p 5173:5173 -p 3000:3000 \
  -v "$PWD":/app -v petshop_small_breeds_node_modules:/app/node_modules \
  -w /app node:24 bash -lc \
  'npm install && npm run setup:env && (npm run dev -w backend & npm run dev -w frontend -- --host 0.0.0.0 --port 5173) && wait'
```

Open:
- Frontend: http://localhost:5173
- Backend health: http://localhost:3000/api/health

## Quality

- **Lint**: `npm run lint`
- **Tests**: `npm run test`

## Local folders (not versioned)
By repository decision, these folders exist only locally:
- `apps/frontend/design-system/`
- `docs/`
