# Operational runbook

## Environments

- `local`: Docker + local PostgreSQL
- `preview`: frontend on Vercel + backend on Vercel + PostgreSQL configured through backend environment variables
- `production`: same split, with dedicated environment variables and deploy smoke checks

## Release checklist

1. Ensure `npm run lint`
2. Ensure `npm run type-check`
3. Ensure `npm run build`
4. Ensure `npm run test:backend`
5. Ensure `npm run test:frontend`
6. Ensure `npm run test:e2e`
7. Deploy frontend
8. Deploy backend
9. Run `Deploy Smoke`

## Rollback

Frontend:

1. Roll back to the previous Vercel deployment
2. Re-run the smoke check against `FRONTEND_URL`

Backend:

1. Roll back the backend Vercel deployment
2. Validate `API_HEALTH_URL`
3. Run the login smoke check

## Quick troubleshooting

### API returning widespread 401 responses

- confirm `JWT_SECRET`
- verify token expiration
- validate `/api/auth/me`

### Frontend cannot reach backend

- check `VITE_API_BASE_URL`
- check `CORS_ORIGIN`
- validate the `/api/*` rewrite in `vercel.json`
- validate `API_HEALTH_URL`

### Backend tests failing because of the database

- start local PostgreSQL with `npm run db:up`
- copy `apps/backend/.env.test.example` to `apps/backend/.env.test`
- confirm `DATABASE_URL` points to `petshop?schema=test`

### E2E failing because of environment setup

- confirm `DATABASE_URL` or `E2E_DATABASE_URL`
- confirm Playwright browsers are installed
- check whether `http://127.0.0.1:3300/api/health` responds
- check whether `http://127.0.0.1:4273` opens through preview
