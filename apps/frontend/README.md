# Petshop Small Breeds Premium Frontend

SPA React + Vite do monorepo `petshop-small-breeds-premium`.

## Requisitos
- Node.js 20.19+ ou 22.12+ (Vite 7)
- npm 10+

## Como rodar (monorepo)
Na raiz do repo:
```bash
npm run setup
npm run dev:frontend
```

## Como rodar (apenas frontend)
```bash
cd apps/frontend
npm install
npm run dev
```

Abra `http://localhost:5173`.

## Backend e proxy
Em desenvolvimento, o frontend usa proxy do Vite para `/api` apontando para `http://127.0.0.1:3000`.

Se o backend nao estiver rodando, rotas como login/cadastro vao falhar.

## Variaveis de ambiente (opcional)
- `VITE_API_BASE_URL`: base da API (padrao: `/api`)
- `VITE_ADMIN_EMAILS`: lista separada por virgula (padrao: `admin@petshop.com`)

## Qualidade
```bash
cd apps/frontend
npm run lint
npm test
npm run build
```

## Desenvolvimento via Docker (se seu Node local for antigo)
Na raiz do repo:
```bash
docker run --rm -it -p 5173:5173 -p 3000:3000 \
  -v "$PWD":/app -v petshop_small_breeds_node_modules:/app/node_modules \
  -w /app node:24 bash -lc \
  'npm install && npm run setup:env && (npm run dev -w backend & npm run dev -w frontend -- --host 0.0.0.0 --port 5173) && wait'
```
