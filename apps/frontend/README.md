# Petshop Small Breeds Premium — Frontend

React + Vite SPA for the `petshop-small-breeds-premium` monorepo.

## Requirements
- Node.js 20.19+ or 22.12+ (Vite 7)
- npm 10+

## Run (from monorepo root)
```bash
npm run setup
npm run dev:frontend
```

## Run (frontend only)
```bash
cd apps/frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Backend & Proxy
In development, the frontend uses a Vite proxy so `/api` points to `http://127.0.0.1:3000`.

If the backend is not running, routes like login/register will fail.

## Environment Variables (optional)
- `VITE_API_BASE_URL`: API base URL (default: `/api`)
- `VITE_ADMIN_EMAILS`: comma-separated list (default: `admin@petshop.com`)

## Quality
```bash
cd apps/frontend
npm run lint
npm test
npm run build
```

## Development via Docker (if your local Node is too old)
From the monorepo root:
```bash
docker run --rm -it -p 5173:5173 -p 3000:3000 \
  -v "$PWD":/app -v petshop_small_breeds_node_modules:/app/node_modules \
  -w /app node:24 bash -lc \
  'npm install && npm run setup:env && (npm run dev -w backend & npm run dev -w frontend -- --host 0.0.0.0 --port 5173) && wait'
```
