# Operational runbook

## Environments

- `local`: Docker + local PostgreSQL
- `preview`: frontend on Vercel + backend on Vercel + PostgreSQL configured through backend environment variables
- `production`: same split, with dedicated environment variables and deploy smoke checks

## Critical variables and secrets

Backend runtime:

- `DATABASE_URL`: PostgreSQL target for the active environment
- `JWT_SECRET`: required and environment-specific
- `AUTH_COOKIE_NAME`: defaults to `petshop_session`, keep aligned across environments if changed
- `AUTH_COOKIE_DOMAIN`: optional, use when frontend/backend share parent domains in preview/production
- `AUTH_COOKIE_SAME_SITE`: defaults to `lax`, supports `strict` and `none`
- `AUTH_COOKIE_SECURE`: optional override; cookies are forced to `Secure` when `SameSite=None`
- `AUTH_COOKIE_MAX_AGE_MS`: session cookie duration in milliseconds
- `CORS_ORIGIN`: must include the public frontend origin for preview/production

Frontend runtime:

- `VITE_API_BASE_URL`: keep `/api` in preview/production to preserve same-origin cookies

Deploy smoke secrets:

- `FRONTEND_URL`: public frontend origin used by real users
- `API_HEALTH_URL`: direct backend health endpoint
- `SMOKE_ADMIN_EMAIL`: admin user used by post-deploy login smoke
- `SMOKE_ADMIN_PASSWORD`: password for the smoke admin user

## Release checklist

1. Ensure `npm run lint`
2. Ensure `npm run type-check`
3. Ensure `npm run build`
4. Ensure `npm run test:backend`
5. Ensure `npm run test:frontend`
6. Ensure `npm run test:e2e`
7. Ensure the `CI` workflow finished the critical Playwright stability pass
8. Deploy frontend
9. Deploy backend
10. Run `Deploy Smoke` and confirm:
   - frontend responds
   - frontend `/api/health` rewrite responds
   - direct backend health responds
   - admin login through frontend `/api/auth/login` responds

## Rollback

Frontend:

1. Roll back to the previous Vercel deployment
2. Re-run the smoke check against `FRONTEND_URL`
3. Validate `${FRONTEND_URL%/}/api/health`

Backend:

1. Roll back the backend Vercel deployment
2. Validate `API_HEALTH_URL`
3. Validate `${FRONTEND_URL%/}/api/health`
4. Run the login smoke check

## Quick troubleshooting

### API returning widespread 401 responses

- confirm `JWT_SECRET`
- verify token expiration
- validate `/api/auth/me`
- inspect backend logs using the `requestId` returned in the response header/body

### Frontend cannot reach backend

- check `VITE_API_BASE_URL`
- check `CORS_ORIGIN`
- check `AUTH_COOKIE_SAME_SITE`, `AUTH_COOKIE_SECURE` and `AUTH_COOKIE_DOMAIN`
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
