# Petshop Small Breeds Premium Backend

API do monorepo `petshop-small-breeds-premium` (Express + Prisma + TypeScript), com separacao por camadas (Domain, Presentation, Main).

## Requisitos
- Node.js 24+ (ver `engines` em `package.json`)
- npm 10+

## Como rodar (monorepo)
Na raiz do repo:
```bash
npm run setup
npm run dev:backend
```

Ou diretamente no workspace:
```bash
cd apps/backend
npm install
cp .env.example .env
npm run dev
```

## Variaveis de ambiente
Baseado em `apps/backend/.env.example`:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="development-secret"
CORS_ORIGIN="http://localhost:5173"
```

## Prisma (SQLite)
Para aplicacao de migrations (quando necessario):
```bash
cd apps/backend
npx prisma migrate deploy
```

## Testes e qualidade
```bash
cd apps/backend
npm run lint
npm test
```

## Estrutura

```plaintext
.
├── src/
│   ├── domain/        # Entities and Use Cases (Pure Business Logic)
│   ├── presentation/  # Controllers (Framework Independent)
│   ├── main/          # Infrastructure, Adapters, and Composition
│   ├── app.ts         # Express application bootstrap
│   └── server.ts      # Application entry point
├── dist/              # Compiled output (nao versionado)
├── .env               # Secrets locais (nao versionado)
└── package.json       # Scripts and dependencies
```

## Notas
- `apps/backend/prisma/dev.db` e um banco local de desenvolvimento e nao entra no Git.
