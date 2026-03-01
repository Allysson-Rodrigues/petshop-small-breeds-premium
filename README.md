# 🐾 Petshop Small Breeds Premium

Monorepo para uma aplicação de petshop premium especializada em raças pequenas. Frontend SPA (React + Vite + Tailwind CSS) com backend API (Express + Prisma + SQLite).

## Stack

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, Framer Motion, React Router 7 |
| **Backend** | Express 5, Prisma 7, SQLite (Better-SQLite3), TypeScript |
| **Auth** | JWT (jsonwebtoken + bcrypt) |
| **Testes** | Vitest (unit), Playwright (E2E) |
| **Lint** | ESLint (frontend), Biome (backend) |
| **Deploy** | Vercel (frontend SPA) |

## Estrutura do Projeto

```text
.
├── .github/workflows/   CI (lint, tests, E2E)
├── apps/
│   ├── backend/          Express API + Prisma (Clean Architecture)
│   └── frontend/         React SPA + Vite + Tailwind CSS
├── package.json          Monorepo (npm Workspaces)
└── vercel.json           Deploy config (frontend)
```

## Pré-requisitos

- **Node.js 24+** e **npm 10+**
- Alternativamente, use Docker (veja abaixo)

## Setup

```bash
# Instala dependências e cria apps/backend/.env a partir do template
npm run setup
```

## Desenvolvimento

```bash
# Backend + Frontend (paralelo)
npm run dev:all

# Ou individualmente
npm run dev:backend
npm run dev:frontend
```

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api/health |

## Docker (alternativo)

```bash
docker run --rm -it -p 5173:5173 -p 3000:3000 \
  -v "$PWD":/app -v petshop_node_modules:/app/node_modules \
  -w /app node:24 bash -lc \
  'npm install && npm run setup:env && (npm run dev -w backend & npm run dev -w frontend -- --host 0.0.0.0 --port 5173) && wait'
```

## Variáveis de Ambiente

### Backend (`apps/backend/.env`)

| Variável | Descrição | Default |
|----------|-----------|---------|
| `PORT` | Porta do servidor | `3000` |
| `NODE_ENV` | Ambiente | `development` |
| `DATABASE_URL` | Caminho do SQLite | `file:./dev.db` |
| `JWT_SECRET` | Segredo para tokens JWT | — (**obrigatório**) |
| `CORS_ORIGIN` | Origens permitidas (separadas por vírgula) | `http://localhost:5173` |

### Frontend (variáveis `VITE_*`)

| Variável | Descrição | Default |
|----------|-----------|---------|
| `VITE_API_BASE_URL` | URL base da API | `/api` (proxy local) |
| `VITE_ADMIN_EMAILS` | E-mails admin (separados por vírgula) | `admin@petshop.com` |

## Qualidade

```bash
npm run lint     # Lint (ambos workspaces)
npm run test     # Testes unitários (Vitest)
npm run build    # Build de produção

# Testes E2E (requer backend rodando)
cd apps/frontend && npx playwright test
```

## Deploy (Vercel)

O frontend é deployado na Vercel como SPA estático. O `vercel.json` configura build, output e rewrites.

```bash
npx vercel --prod
```

> **Nota:** O backend não é deployado na Vercel. Para produção completa, hospede o backend separadamente e configure `VITE_API_BASE_URL`.

## Licença

MIT
