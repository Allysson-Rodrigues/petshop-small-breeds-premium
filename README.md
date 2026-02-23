# Petshop Small Breeds Premium

Monorepo com npm Workspaces, integrando frontend (React + Vite) e backend (Express + Prisma).

## Estrutura do Projeto

```text
.
├── .github/workflows/ CI (lint/tests/e2e)
├── apps/
│   ├── backend/       API Express + Prisma
│   └── frontend/      SPA React + Vite
├── package.json       Configuração de Monorepo (Workspaces)
└── vercel.json        Deployment Unificado
```

## Como Iniciar

### Requisitos
- Node.js 24+ e npm 10+ (para rodar backend e scripts do monorepo)
- Se seu Node local for menor, use Docker (abaixo)

### Setup
Instala dependências e cria `apps/backend/.env` a partir do template:

```bash
npm run setup
```

### Desenvolvimento
Subir backend + frontend:

```bash
npm run dev:all
```

Ou individualmente utilizando o padrão de Workspaces:
- `npm run dev -w backend`
- `npm run dev -w frontend`

### Desenvolvimento via Docker
```bash
docker run --rm -it -p 5173:5173 -p 3000:3000 \
  -v "$PWD":/app -v petshop_small_breeds_node_modules:/app/node_modules \
  -w /app node:24 bash -lc \
  'npm install && npm run setup:env && (npm run dev -w backend & npm run dev -w frontend -- --host 0.0.0.0 --port 5173) && wait'
```

Abra:
- Frontend: http://localhost:5173
- Backend health: http://localhost:3000/api/health

## Qualidade

- **Lint**: `npm run lint`
- **Tests**: `npm run test`

## Pastas locais (nao versionadas)
Por decisao de repositorio, estas pastas ficam apenas localmente:
- `apps/frontend/design-system/`
- `docs/`
