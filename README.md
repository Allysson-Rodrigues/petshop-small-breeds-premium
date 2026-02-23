# Petshop Small Breeds Premium

Monorepo com frontend (React + Vite) e backend (Express + Prisma).

## Pré-requisitos

- Node.js 24+
- npm 10+

## Rodando localmente (fluxo recomendado)

1. Instalar dependências e criar `.env` do backend automaticamente:

```bash
npm run setup
```

2. Subir frontend + backend com um comando:

```bash
npm run dev:all
```

## Scripts úteis

- `npm run dev:backend` → sobe apenas o backend
- `npm run dev:frontend` → sobe apenas o frontend
- `npm run setup:env` → cria `backend/.env` a partir de `backend/.env.example` se ainda não existir

## Endereços padrão

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000` (ou a porta definida em `backend/.env` via `PORT`)
