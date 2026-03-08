# Backend

API REST em Express 5 com Prisma, PostgreSQL e autenticação JWT.

## Stack

- Express 5
- Prisma
- PostgreSQL
- TypeScript
- Biome
- Vitest + Supertest

## Rotas principais

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/register` | Cadastro |
| `POST` | `/api/auth/login` | Login |
| `GET` | `/api/auth/me` | Hidratação da sessão autenticada |
| `GET` | `/api/dashboard/customer` | Dashboard do cliente |
| `GET` | `/api/dashboard/admin` | Dashboard admin |
| `GET/POST/PUT/DELETE` | `/api/dashboard/pets` | CRUD de pets |
| `GET/POST/PUT/DELETE` | `/api/dashboard/appointments` | CRUD de agendamentos |
| `GET/PUT/DELETE` | `/api/dashboard/clients` | Gestão admin de clientes |
| `GET/POST/PUT/DELETE` | `/api/dashboard/products` | Estoque |

## Estrutura

```text
src/
├── domain/
├── infrastructure/
├── main/
│   ├── config/
│   ├── middlewares/
│   └── utils/
├── presentation/
└── test/
```

## Banco e ambiente

Arquivo padrão:

```bash
cp .env.example .env
```

Valores locais:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/petshop?schema=public"
JWT_SECRET="change-me-to-a-strong-random-secret"
CORS_ORIGIN="http://localhost:5173,http://127.0.0.1:5173"
```

Arquivo de teste:

```bash
cp .env.test.example .env.test
```

Default de teste:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/petshop?schema=test"
```

## Scripts

```bash
npm run dev
npm run dev:seed
npm run build
npm run start
npm run start:test
npm run prisma:push
npm run prisma:seed
npm run test
npm run lint
npm run type-check
```

## Docker local

Subir PostgreSQL:

```bash
docker compose up -d postgres
```

Subir API + PostgreSQL:

```bash
docker compose up --build
```

## Testes

Os testes usam PostgreSQL real e reset de dados por seed. A suíte cobre:

- auth
- `/auth/me`
- restrições por papel
- criação e atualização de recursos críticos
