# Backend TypeScript Foundations

![CI Status](https://github.com/Allysson-Rodrigues/backend-ts-foundations/actions/workflows/main.yml/badge.svg)

A professional, high-performance, and production-ready foundation for scalable RESTful APIs. Built with **TypeScript**, **Node.js 24+**, and **Clean Architecture** principles.

---

### Core Stack

- **Runtime**: [Node.js 24+ (LTS)](https://nodejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js v5+](https://expressjs.com/)
- **Execution**: [tsx](https://tsx.is/) (Native ESM Support)
- **Quality**: [Biome](https://biomejs.dev/) & [Vitest](https://vitest.dev/)

---

### Engineering Features

- **Strict Typing**: Full TypeScript implementation for maximum reliability.
- **Modern ESM**: Native ECMAScript Modules support.
- **Standards-First**: Pre-configured Biome (Fastest Lint/Format) and Vitest.
- **Zero Vulnerabilities**: 100% dependency health audited for 2025 standards.
- **Clean Architecture**: Strict separation between Domain, Presentation, and Main layers.

---

### Getting Started

1. **Clone & Setup**
   ```bash
   git clone https://github.com/Allysson-Rodrigues/backend-ts-foundations.git
   cd backend-ts-foundations
   npm install
   ```

2. **Environment**
   Create a `.env` file based on your infrastructure needs:
   ```env
   PORT=3000
   NODE_ENV=development
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Testing**
   ```bash
   npm test
   ```

---

### Architecture Overview

```plaintext
.
├── src/
│   ├── domain/        # Entities and Use Cases (Pure Business Logic)
│   ├── presentation/  # Controllers (Framework Independent)
│   ├── main/          # Infrastructure, Adapters, and Composition
│   ├── app.ts         # Express application bootstrap
│   └── server.ts      # Application entry point
├── dist/              # Compiled output (Gitignored)
├── .env               # Infrastructure secrets
└── package.json       # Scripts and dependencies
```

---

### ⚠️ Technical Debt (Auditoria 21/02/2026)

- [ ] **Architecture**: Implementar Singleton para o `PrismaClient` para evitar esgotamento de conexões.
- [ ] **Type Quality**: Corrigir cast de tipo pendente em `get-customer-dashboard.controller.ts`.
- [ ] **Higiene**: Remover `console.log` residuais em `create-pet.controller.ts`.

---

**Allysson Rodrigues**
Backend Infrastructure & AI Engineering
