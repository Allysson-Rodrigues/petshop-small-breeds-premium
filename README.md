# Petshop Small Breeds Premium

Monorepo estruturado profissionalmente com **npm Workspaces**, integrando frontend (React + Vite) e backend (Express + Prisma).

## 🏗️ Estrutura do Projeto

```text
.
├── .github/workflows/ CI Automado (Lint/Tests)
├── apps/
│   ├── backend/       API Express + Prisma
│   └── frontend/      SPA React + Vite
├── package.json       Configuração de Monorepo (Workspaces)
└── vercel.json        Deployment Unificado
```

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js 24+ (backend) e npm 10+
- Se seu Node local for menor, use Docker (abaixo)

### Setup Rápido
Instale todas as dependências do monorepo e configure o ambiente com um único comando:

```bash
npm run setup
```

### Desenvolvimento
Suba ambos os serviços simultaneamente:

```bash
npm run dev:all
```

Ou individualmente utilizando o padrão de Workspaces:
- `npm run dev -w backend`
- `npm run dev -w frontend`

### Desenvolvimento via Docker (recomendado se seu Node local nao for 24+)
```bash
docker run --rm -it -p 5173:5173 -p 3000:3000 \
  -v "$PWD":/app -v petshop_small_breeds_node_modules:/app/node_modules \
  -w /app node:24 bash -lc \
  'npm install && npm run setup:env && (npm run dev -w backend & npm run dev -w frontend -- --host 0.0.0.0 --port 5173) && wait'
```

Abra:
- Frontend: http://localhost:5173
- Backend health: http://localhost:3000/api/health

## 🧪 Qualidade de Código (CI/CD)

O projeto conta com automação via GitHub Actions. Toda contribuição é validada automaticamente:
- **Lint**: `npm run lint`
- **Tests**: `npm run test`

## 🗂️ Pastas locais (nao versionadas)
Por decisao de repositorio, estas pastas ficam apenas localmente e nao entram no Git:
- `apps/frontend/design-system/`
- `docs/`

---
*Este projeto segue as melhores práticas de Clean Core e Monorepo Management de 2025.*
