# TODO

## Status

- `P0`: hardening operacional
- `P1`: robustez de frontend e testes
- `P2`: backend, seguranca e observabilidade
- `P3`: performance, manutencao e evolucao de produto

## P0

Objetivo:
Fortalecer deploy, smoke e contrato operacional para que quebra de rewrite, healthcheck ou login nao passe despercebida.

Escopo:
- manter `vercel.json` e smoke alinhados
- validar frontend real e rewrite `/api/*`
- padronizar o contrato de variaveis e secrets por ambiente
- consolidar checklist de release e rollback

Itens:
- [x] corrigir rewrite do frontend para o backend de producao
- [x] validar `FRONTEND_URL/api/health` no workflow de smoke
- [x] validar login via frontend `/api/auth/login` no workflow de smoke
- [x] remover secret obsoleto `API_LOGIN_URL` da documentacao e do fluxo
- [x] documentar variaveis e secrets criticos no runbook
- [x] consolidar checklist de release e rollback com foco no rewrite

Criterio de aceite:
- nenhuma quebra de rewrite ou login passa despercebida no pos-deploy

## P1

Objetivo:
Reduzir fragilidade do dashboard e aumentar previsibilidade do frontend.

Itens:
- [x] remover `eslint-disable` de efeitos nas tabs do dashboard
- [x] extrair hooks de dados por dominio: pets, clientes, estoque, agendamentos
- [x] padronizar loading, erro, refresh e invalidacao de listas
- [x] reduzir duplicacao entre telas mobile e desktop nas tabs
- [x] ampliar testes unitarios do frontend para tabs e sincronizacao de auth
- [x] medir e reduzir flake rate do Playwright em CI

## P2

Objetivo:
Melhorar endurecimento do backend e capacidade de diagnostico.

Itens:
- [x] padronizar resposta de erro para consumo do frontend
- [x] revisar cookie de sessao por ambiente: `Secure`, `SameSite`, dominio e expiracao
- [x] revisar protecao e rate limit dos endpoints publicos
- [x] adicionar request id/correlation id para troubleshooting
- [x] revisar logs operacionais para erros de auth e integracao

## P3

Objetivo:
Melhorar manutencao, performance e valor operacional do produto.

Itens:
- [x] modularizar formularios e tabelas reutilizaveis do dashboard
- [x] revisar bundles e carregamento do dashboard
- [x] substituir notificacoes mockadas por dados reais ou feature flag explicita
- [x] criar fluxo administrativo para booking requests publicos
- [x] adicionar metricas reais e historico operacional no dashboard
