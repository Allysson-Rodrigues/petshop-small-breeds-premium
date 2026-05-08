# petshop-small-breeds-premium Project Audit

Date: 2026-05-08

## Scope

Full-stack validation, dependency security, backend/frontend linting, GitHub PR posture, and local test readiness.

## Score

Overall score: 8.2 / 10

The project builds, type-checks, lints, passes frontend tests locally, and has a clean local npm audit after a targeted Prisma transitive dependency override. Remaining risk is concentrated in backend integration test environment availability.

## Evidence

- Local branch: `main`.
- Local branches: `main` only.
- Remote branches observed read-only: `main`.
- Open PR: `#81 chore(deps): bump the npm_and_yarn group across 1 directory with 5 updates`, merge state `BEHIND`.
- Open Dependabot alerts were previously observed remotely; local npm audit now returns 0 vulnerabilities and remote alert state needs GitHub rescan after push.
- Workflows: `ci.yml`, `deploy-smoke.yml`, `linear-validation.yml`, `sentry-release.yml`.
- Local backend `.env` detected; contents were not read or printed.

## Changes Applied

- Added `formatter.lineEnding: "crlf"` to backend Biome configuration and formatted the two backend files Biome still flagged.
- Updated Vite config to let `defineConfig` infer plugin types after the Vite 8 upgrade, matching Vite documentation for plugin presets that return arrays.
- Ran `npm audit fix` and `npm install` to apply non-forced dependency remediation and restore platform-specific Biome CLI resolution.
- Added a root npm override and lockfile ratchet for `@hono/node-server@1.19.13` under Prisma's transitive `@prisma/dev` path, clearing GHSA-92pp-h63x-v22m without downgrading Prisma 7.
- Pinned GitHub Actions to immutable SHAs and made Linear validation explicitly allow trusted maintenance bot branches.

## Validation

- `npm run type-check`: passed.
- `npm run build`: passed.
- `npm run lint`: passed.
- `npm run test:frontend`: passed, 30 tests.
- `npm run test:backend`: blocked by missing dedicated PostgreSQL `DATABASE_URL` / `TEST_DATABASE_URL` and no Docker availability in this shell.
- `npm audit --audit-level=high`: passed with 0 vulnerabilities.
- `npm ls @hono/node-server @prisma/dev prisma`: confirms Prisma 7.8.0 uses `@hono/node-server@1.19.13`.

## Findings

1. Backend tests require a real isolated PostgreSQL test database. Docker is not available in the current shell, so integration validation remains blocked locally.
2. Remote PR/check/alert state cannot be cleared until local fixes are pushed and GitHub recalculates checks.

## Resolution Status

Local build/type/lint/frontend-test and dependency audit issues were resolved. Backend integration validation remains environment-blocked on this host.
