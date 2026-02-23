# Petshop Small Breeds Premium Backend

API do monorepo `petshop-small-breeds-premium` (Express + Prisma + TypeScript), seguindo separacao por camadas (Domain, Presentation, Main).

---

### Core Stack

- **Runtime**: [Node.js 24+ (LTS)](https://nodejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js v5+](https://expressjs.com/)
- **Execution**: [tsx](https://tsx.is/) (Native ESM Support)
- **Quality**: [Biome](https://biomejs.dev/) & [Vitest](https://vitest.dev/)

---

### Features

- **Strict Typing**: Full TypeScript implementation for maximum reliability.
- **Modern ESM**: Native ECMAScript Modules support.
- **Standards-First**: Pre-configured Biome (Fastest Lint/Format) and Vitest.
- **Clean Architecture**: Strict separation between Domain, Presentation, and Main layers.

---

### Requisitos
- Node.js 24+ (ver `engines` em `package.json`)
- npm 10+

### Como rodar (monorepo)
Na raiz do repo:
```bash
npm run setup
npm run dev:backend
```

Ou diretamente neste workspace:
```bash
cd apps/backend
npm install
cp .env.example .env
npm run dev
```

### Variaveis de ambiente
Baseado em `apps/backend/.env.example`:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="development-secret"
CORS_ORIGIN="http://localhost:5173"
```

### Prisma (SQLite)
Para aplicacao de migrations (quando necessario):
```bash
cd apps/backend
npx prisma migrate deploy
```

### Testes e qualidade
```bash
cd apps/backend
npm run lint
npm test
```

---

### Architecture Overview

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

---

### Notas
- `apps/backend/prisma/dev.db` e um banco local de desenvolvimento e nao entra no Git.

- [ ] **Architecture**: Implementar Singleton para o `PrismaClient` para evitar esgotamento de conexões.
- [ ] **Type Quality**: Corrigir cast de tipo pendente em `get-customer-dashboard.controller.ts`.
- [ ] **Higiene**: Remover `console.log` residuais em `create-pet.controller.ts`.

---

**Allysson Rodrigues**
Backend Infrastructure & AI Engineering
