# Runbook Operacional

## Ambientes

- `local`: Docker + PostgreSQL local
- `preview`: frontend em Vercel + backend em Railway + banco em Neon
- `production`: mesmo split, com variáveis e smoke de deploy separados

## Checklist de release

1. Garantir `npm run lint`
2. Garantir `npm run type-check`
3. Garantir `npm run build`
4. Garantir `npm run test:backend`
5. Garantir `npm run test:frontend`
6. Garantir `npm run test:e2e`
7. Publicar frontend
8. Publicar backend
9. Executar `Deploy Smoke`

## Rollback

Frontend:

1. Reverter para o deployment anterior na Vercel
2. Reexecutar o smoke em `FRONTEND_URL`

Backend:

1. Reverter release/rollback na Railway
2. Validar `API_HEALTH_URL`
3. Rodar smoke de login

## Troubleshooting rápido

### API devolvendo 401 em massa

- confirmar `JWT_SECRET`
- verificar expiração de token
- validar `/api/auth/me`

### Frontend sem conectar no backend

- conferir `VITE_API_BASE_URL`
- conferir `CORS_ORIGIN`
- validar `API_HEALTH_URL`

### Testes backend falhando por banco

- subir PostgreSQL local com `npm run db:up`
- copiar `apps/backend/.env.test.example` para `apps/backend/.env.test`
- confirmar `DATABASE_URL` apontando para `petshop?schema=test`

### E2E falhando por ambiente

- confirmar `DATABASE_URL` ou `E2E_DATABASE_URL`
- confirmar Playwright browsers instalados
- checar se `http://127.0.0.1:3000/api/health` responde
- checar se `http://127.0.0.1:4173` abre via preview
