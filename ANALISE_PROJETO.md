# Análise técnica do projeto Petshop Small Breeds Premium

## Visão geral

O projeto está organizado como **monorepo** com duas aplicações:

- `frontend/`: SPA em React + Vite + TypeScript.
- `backend/`: API em Express + TypeScript + Prisma (SQLite).

A estrutura geral indica uma boa separação entre camadas de UI e API, com presença de testes unitários/integrados em ambos os lados.

## Diagnóstico arquitetural

### Frontend

- O roteamento está centralizado no `App.tsx`, com transições animadas (`framer-motion`) e múltiplas rotas públicas e privadas de dashboard, o que melhora a experiência de navegação.
- O módulo de autenticação atual (`authService`) ainda funciona em modo **simulado**, persistindo sessão e usuários no `localStorage`.
- Isso acelera desenvolvimento inicial, mas cria um desacoplamento com o backend real de autenticação.

### Backend

- A API utiliza organização em camadas (domain/presentation/main/infrastructure), alinhada com Clean Architecture.
- O `app.ts` possui middleware padrão (`cors`, `express.json`) e rotas modulares (`/api`, `/api/auth`, `/api/dashboard`).
- O schema Prisma cobre entidades principais para o domínio petshop: `User`, `Pet`, `Product`, `Appointment` e `Breed`.

## Riscos e gargalos observados

1. **Convergência de autenticação**
   - Frontend usa fluxo mock em `localStorage`, enquanto backend já expõe infraestrutura de auth.
   - Risco: divergência de regras de negócio, validação e roles entre cliente e servidor.

2. **Ambiente de testes backend depende de `DATABASE_URL`**
   - A suíte backend falha quando a variável não está configurada.
   - Risco: CI local inconsistente e falsos negativos de regressão.

3. **Dependências frontend com conflito de peer dependency**
   - `react-helmet-async@2.0.5` não é compatível com React 19 no `npm ci` padrão.
   - Risco: instalação quebrada em ambientes limpos, dificultando onboarding e pipeline.

## Priorização recomendada (próximos 7 dias)

1. **Unificar autenticação frontend ↔ backend (prioridade máxima)**
   - Trocar `authService` mock por chamadas HTTP reais ao backend.
   - Persistir apenas `token` e perfil retornado pela API.

2. **Padronizar setup de ambiente backend para testes**
   - Adicionar `.env.example` com `DATABASE_URL` de teste.
   - Configurar script de testes com banco efêmero/isolado.

3. **Resolver lock de dependências do frontend**
   - Atualizar `react-helmet-async` para versão compatível com React 19 (ou migrar alternativa).
   - Garantir `npm ci` limpo sem flags de bypass.

## Quick wins

- Ajustar documentação raiz com instruções únicas de execução (`backend` + `frontend`).
- Criar um checklist de saúde pós-clone: install, lint, test, build.
- Definir uma política de ambiente (dev/test/prod) com variáveis explícitas.

## Conclusão

O projeto já apresenta uma base sólida de arquitetura e organização. O principal ponto para elevar maturidade agora é reduzir o “gap” entre interface e API (especialmente em autenticação), além de estabilizar a experiência de instalação e testes em ambiente limpo.
