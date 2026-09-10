# Petshop Small Breeds Premium Agent Protocol

When this repository is checked out under `/mnt/dados/Workspace/workspace/01-projects/petshop-small-breeds-premium`,
the parent workspace protocol is `/mnt/dados/Workspace/workspace/AGENTS.md`. Read that first in
workspace-managed sessions.

This file documents only the petshop-specific deltas.

## Stack

- Monorepo with `apps/frontend` (React 19, Vite 7, Tailwind CSS 4, React Router 7, Framer Motion)
  and `apps/backend` (Express 5, Prisma, PostgreSQL, JWT in HTTP-only cookies, bcrypt).
- Quality: ESLint, Biome, Vitest, Playwright.
- Deployment: Vercel for frontend and backend.

## Local commands

```bash
npm install --legacy-peer-deps
npm run setup:env
npm run db:up
npm run backend:db:push
npm run backend:db:seed
npm run dev:backend
npm run dev:frontend
npm test
```

## Project-local conventions

- Required env vars: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`. Never commit `.env`; use `.env.example` templates.
- Authentication uses HTTP-only session cookies; public booking endpoint `POST /api/public/booking-requests` requires no auth.
- Repository hygiene: single lockfile at repository root; local-only artifacts (`.vercel/`, `dist/`, `playwright-report/`) must stay untracked.

## Boundary with the workspace

- This repository is isolated. Do not edit files outside this repository. In the
  parent workspace layout, this repository lives at `01-projects/petshop-small-breeds-premium/`.
- Workspace-level governance, MCP, memory, and skill contracts come from the
  workspace root and must not be duplicated here.
