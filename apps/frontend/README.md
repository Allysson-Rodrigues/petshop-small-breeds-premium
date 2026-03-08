# Frontend

SPA em React 19 para navegação pública, autenticação e dashboard do petshop.

## Stack

- React 19
- Vite 7
- Tailwind CSS 4
- React Router 7
- Framer Motion
- Vitest + Testing Library
- Playwright

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run type-check
npm run test
npm run test:e2e
```

## Contratos principais

- `VITE_API_BASE_URL`: endpoint base da API
- autenticação baseada em JWT Bearer validado no boot via `GET /api/auth/me`
- guards formais:
  - `ProtectedRoute`
  - `GuestOnlyRoute`
  - `RoleGuard`

## Testes

- Unitários em `src/**/*.test.ts`
- E2E em `tests/**/*.spec.ts`
- Configs versionadas:
  - `vitest.config.ts`
  - `playwright.config.ts`

## Execução local de E2E

Pré-requisitos:

- backend com PostgreSQL acessível em `127.0.0.1:5432`
- `apps/backend/.env.test` configurado ou `DATABASE_URL`/`E2E_DATABASE_URL` exportados

Comando:

```bash
npm run test:e2e
```

O Playwright sobe:

- backend em `http://127.0.0.1:3000`
- preview do frontend em `http://127.0.0.1:4173`
