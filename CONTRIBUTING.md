# Contributing

## Workflow

- Work from a dedicated branch.
- Keep each pull request scoped to one logical objective.
- Include validation evidence in the pull request body.

## Validation Baseline

- `npm run lint`
- `npm run type-check`
- run the targeted test command for the changed surface

Examples:

- backend changes: `npm run test:backend`
- frontend unit changes: `npm run test:frontend`
- critical UI flow changes: `npm run test:e2e`

## Delivery Guardrails

- Do not commit `.env` files.
- Preserve same-origin auth behavior and `/api` rewrite expectations.
- Respect `ALLOW_DEMO_SEED` production safeguards.
