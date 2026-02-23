# Petshop Small Breeds Premium 🐾

Monorepo estruturado profissionalmente com **npm Workspaces**, integrando frontend (React + Vite) e backend (Express + Prisma).

## 🏗️ Estrutura do Projeto

```text
.
├── .github/workflows/ CI Automado (Lint/Tests)
├── apps/ (Em evolução)
├── backend/           API Express + Prisma
├── frontend/          SPA React + Vite
├── docs/              Documentação Técnica e Análises
├── package.json       Configuração de Monorepo (Workspaces)
└── vercel.json        Deployment Unificado
```

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js 24+
- npm 10+

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

## 🧪 Qualidade de Código (CI/CD)

O projeto conta com automação via GitHub Actions. Toda contribuição é validada automaticamente:
- **Lint**: `npm run lint`
- **Tests**: `npm run test`

---
*Este projeto segue as melhores práticas de Clean Core e Monorepo Management de 2025.*
