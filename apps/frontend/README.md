# Petshop Small Breeds Premium — Frontend

Single Page Application (SPA) built with React 19, Vite 7, Tailwind CSS 4, and Framer Motion.

## Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7 (with SWC)
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Routing:** React Router 7
- **Icons:** Lucide React

## Development

```bash
# From the monorepo root
npm run dev:frontend

# Or directly from the frontend directory
cd apps/frontend && npm run dev
```

The dev server starts at http://localhost:5173 with automatic API proxying (`/api` → `http://127.0.0.1:3000`).

> If the backend is not running, login and registration functionality will not work.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | API base URL | `/api` (local proxy) |
| `VITE_ADMIN_EMAILS` | Admin emails for client-side RBAC | `admin@petshop.com` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build (`tsc + vite build`) |
| `npm run lint` | ESLint check |
| `npm run preview` | Local build preview |

## Tests

Frontend tests are available in the codebase, for example:

- `src/App.test.tsx`
- `src/services/authService.test.ts`

## Structure

```text
src/
├── components/        # Reusable UI components (layout, shared UI)
├── pages/             # Page views and routing components
│   └── dashboard/     # Dashboard for admins/clients (tabs, sub-components)
├── services/          # Authentication service, dashboard API client
├── App.tsx            # Main application router
└── index.css          # Design tokens and Tailwind configuration
```

## Docker (Alternative)

```bash
# From the monorepo root
docker run --rm -it -p 5173:5173 -p 3000:3000 \
  -v "$PWD":/app -v petshop_node_modules:/app/node_modules \
  -w /app node:24 bash -lc \
  'npm install && npm run setup:env && (npm run dev -w backend & npm run dev -w frontend -- --host 0.0.0.0 --port 5173) && wait'
```

## Build & Deployment

The build process generates static files in the `dist/` directory. The frontend is deployed to Vercel using the root [`vercel.json`](/home/allysson/projetos/01-projetos/petshop-small-breeds-premium/vercel.json) configuration.

For a fully working environment, the frontend must point to a deployed backend API through `VITE_API_BASE_URL`.
