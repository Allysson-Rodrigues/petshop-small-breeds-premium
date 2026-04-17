# Copilot Instructions

This repository is a full-stack application with separate frontend and backend workspaces.

- Read `README.md` and `RUNBOOK.md` before changing commands, environment setup, or deployment behavior.
- Keep frontend and backend concerns separated; avoid coupling UI code to infrastructure details.
- Preserve the current production contract:
  - browser traffic stays same-origin through `/api`
  - the frontend deployment rewrites `/api` requests to the backend deployment
- Do not commit secrets, live credentials, or populated `.env` files.
- Changes that affect authentication, cookies, RBAC, Prisma, or deployment rewrites require explicit validation evidence.
- Prefer repository-root scripts and the documented command set over ad hoc local commands.
