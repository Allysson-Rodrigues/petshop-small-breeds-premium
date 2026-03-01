# Petshop Small Breeds Premium — Frontend

SPA (Single Page Application) construída com React 19, Vite 7, Tailwind CSS 4 e Framer Motion.

## Stack

- **Framework:** React 19 + TypeScript
- **Build:** Vite 7 (com SWC)
- **Estilos:** Tailwind CSS 4
- **Animações:** Framer Motion
- **Roteamento:** React Router 7
- **Ícones:** Lucide React
- **Testes:** Vitest (unit) + Playwright (E2E)

## Desenvolvimento

```bash
# A partir da raiz do monorepo
npm run dev:frontend

# Ou diretamente
cd apps/frontend && npm run dev
```

O dev server inicia em http://localhost:5173 com proxy automático para a API (`/api` → `http://127.0.0.1:3000`).

> Se o backend não estiver rodando, login/registro não funcionarão.

## Variáveis de Ambiente

| Variável | Descrição | Default |
|----------|-----------|---------|
| `VITE_API_BASE_URL` | URL base da API | `/api` (proxy local) |
| `VITE_ADMIN_EMAILS` | E-mails admin para RBAC client-side | `admin@petshop.com` |

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server com HMR |
| `npm run build` | Build de produção (`tsc + vite build`) |
| `npm run lint` | ESLint |
| `npm run test` | Testes unitários (Vitest) |
| `npm run preview` | Preview do build local |

## Testes E2E (Playwright)

```bash
# Instalar browsers (primeira vez)
npx playwright install

# Rodar testes (requer backend rodando)
npx playwright test
```

### Specs disponíveis

| Arquivo | Cobertura |
|---------|-----------|
| `tests/home.spec.ts` | Home page, heading, links |
| `tests/login.spec.ts` | Validação, credenciais erradas, login com sucesso |
| `tests/dashboard.spec.ts` | Navegação entre tabs, modais |
| `tests/auth_full_flow.spec.ts` | Registro → Login → RBAC (admin vs client) |

## Estrutura

```text
src/
├── components/        # UI reutilizável (layout, ui)
├── pages/             # Páginas e rotas
│   └── dashboard/     # Dashboard admin/client (tabs, components)
├── services/          # Auth service, dashboard API
├── App.tsx            # Router principal
└── index.css          # Design tokens + Tailwind
```

## Docker (se seu Node for antigo)

```bash
# Da raiz do monorepo
docker run --rm -it -p 5173:5173 -p 3000:3000 \
  -v "$PWD":/app -v petshop_node_modules:/app/node_modules \
  -w /app node:24 bash -lc \
  'npm install && npm run setup:env && (npm run dev -w backend & npm run dev -w frontend -- --host 0.0.0.0 --port 5173) && wait'
```

## Build & Deploy

O build gera arquivos estáticos em `dist/`. Deployado automaticamente na Vercel via `vercel.json` na raiz do monorepo.
