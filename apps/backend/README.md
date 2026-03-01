# Petshop Small Breeds Premium — Backend

API REST construída com Express 5, Prisma 7 e TypeScript, organizada em Clean Architecture (`domain`, `presentation`, `main`).

## Stack

- **Framework:** Express 5 + TypeScript
- **ORM:** Prisma 7 (SQLite via Better-SQLite3)
- **Auth:** JWT (jsonwebtoken) + bcrypt
- **Lint:** Biome
- **Testes:** Vitest + Supertest

## Desenvolvimento

```bash
# A partir da raiz do monorepo
npm run setup        # Instala deps + cria .env
npm run dev:backend  # Inicia com tsx watch

# Ou diretamente
cd apps/backend
cp .env.example .env  # Ajuste os valores!
npm install
npm run dev
```

## Variáveis de Ambiente

Copie `.env.example` como `.env` e ajuste:

| Variável | Descrição | Default |
|----------|-----------|---------|
| `PORT` | Porta do servidor | `3000` |
| `NODE_ENV` | Ambiente (`development` / `production` / `test`) | `development` |
| `DATABASE_URL` | Caminho do banco SQLite | `file:./dev.db` |
| `JWT_SECRET` | Segredo para tokens JWT | — (**obrigatório**) |
| `CORS_ORIGIN` | Origens CORS permitidas (vírgula) | `http://localhost:5173` |

> ⚠️ **Segurança:** Nunca commite `.env` no repositório. O `.gitignore` já cobre `*.env` e `dev.db`.

## Prisma (SQLite)

```bash
cd apps/backend
npx prisma migrate deploy   # Aplicar migrations
npx prisma studio           # UI visual do banco
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server com hot-reload (tsx watch) |
| `npm run build` | Compila TypeScript → `dist/` |
| `npm start` | Inicia build compilado |
| `npm run lint` | Biome check |
| `npm run lint:fix` | Biome auto-fix |
| `npm test` | Testes unitários (Vitest) |

## Estrutura

```text
src/
├── domain/           # Entidades, use cases, repositórios (puro)
├── presentation/     # Controllers (framework-independent)
├── infrastructure/   # Prisma adapters
├── main/             # Config, routes, composition root
├── app.ts            # Express bootstrap
└── server.ts         # Entry point
```

## Docker

```bash
cd apps/backend
docker build -t petshop-backend .
docker run -p 3000:3000 --env-file .env petshop-backend
```

> O `.dockerignore` previne que `.env` e `dev.db` sejam copiados para a imagem.

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/login` | Login (retorna JWT) |
| `POST` | `/api/auth/register` | Registro de novo usuário |
| `GET` | `/api/dashboard/*` | Rotas protegidas do dashboard |
