# Frontend

React 19 SPA for the public website, authentication flows, and the pet shop dashboard.

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

## Main contracts

- `VITE_API_BASE_URL`: base API endpoint
- session auth via HTTP-only cookie, hydrated through `GET /api/auth/me`
- public booking requests sent to `POST /api/public/booking-requests`
- in production on Vercel, `/api/*` stays same-origin on the frontend domain and is rewritten to the backend deployment
- formal guards:
  - `ProtectedRoute`
  - `GuestOnlyRoute`
  - `RoleGuard`

## Tests

- Unit tests in `src/**/*.test.ts`
- E2E tests in `tests/**/*.spec.ts`
- Versioned configs:
  - `vitest.config.ts`
  - `playwright.config.ts`

## Local E2E execution

Prerequisites:

- backend with PostgreSQL reachable at `127.0.0.1:5432`
- `apps/backend/.env.test` configured, or `DATABASE_URL`/`E2E_DATABASE_URL` exported

Command:

```bash
npm run test:e2e
```

Playwright starts:

- backend at `http://127.0.0.1:3300`
- frontend preview at `http://127.0.0.1:4273`
