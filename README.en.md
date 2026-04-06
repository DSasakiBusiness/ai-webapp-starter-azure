# ai-webapp-starter-azure

Starter repository for developing web services specialized in AI.
Centered around Next.js + NestJS + Prisma + LLM integration, it provides an end-to-end framework including Claude Code agents/skills design, Docker-based local development, and Azure deployment.

---

## ✨ Features

- **Instant AI Chat App Construction** (Supports OpenAI / Azure OpenAI with exponential backoff retries)
- **RAG (Retrieval-Augmented Generation) Pipeline Foundation** (Vector embeddings generation supported)
- **AI-Driven Development via Claude Code agents/skills** (Includes 10 agents, 28 skills)
- **TDD & E2E Ready** (Jest + Playwright)
- **Docker-Contained Local Development** (Launch with a single `make dev`)
- **One-Command Deployment to Azure Container Apps** (Bicep + GitHub Actions CI/CD)
- **Automated Code Quality Gates** via Conventional Commits + lint-staged

---

## 🏗️ Tech Stack

| Category       | Technology                                                            |
| -------------- | --------------------------------------------------------------------- |
| Frontend       | Next.js 15 (App Router), React 19, TypeScript                         |
| Backend        | NestJS 10, TypeScript                                                 |
| ORM            | Prisma 5                                                              |
| AI/LLM         | OpenAI SDK, Azure OpenAI (Automatic Switching Supported)              |
| DB             | PostgreSQL 16                                                         |
| Testing        | Jest (unit/integration), Playwright (E2E)                             |
| CI/CD          | GitHub Actions (CI / staging CD / production CD)                      |
| Containers     | Docker, Docker Compose                                                |
| Cloud          | Azure Container Apps, ACR, PostgreSQL Flexible Server                 |
| Monorepo       | npm workspaces, Turborepo                                             |
| Code Quality   | ESLint, Prettier, husky, lint-staged, commitlint, cspell, knip, madge |

---

## 📁 Directory Structure

```
.
├── .claude/                     # Claude Code Design (Primary)
│   ├── CLAUDE.md                # Cross-project rules
│   ├── agents/                  # Decision makers (10 agents)
│   │   ├── product/             #   product-manager
│   │   ├── engineering/         #   solution-architect, frontend/backend-developer,
│   │   │                        #   ai-engineer, azure-platform-engineer
│   │   └── testing/             #   qa-reviewer, tdd-coach, e2e-tester, security-reviewer
│   └── skills/                  # Reusable execution steps (28 skills)
│       ├── common/              #   General skills (23 items)
│       └── azure/               #   Azure specific skills (5 items)
├── apps/
│   ├── web/                     # Next.js Frontend
│   │   ├── src/app/             #   App Router (page, layout, error boundary)
│   │   └── src/lib/             #   API Clients
│   └── api/                     # NestJS Backend
│       ├── src/ai/              #   AI Services (Chat, Embeddings, Retry)
│       ├── src/common/          #   HttpExceptionFilter, LoggingInterceptor
│       ├── src/prisma/          #   PrismaService
│       └── prisma/              #   Schema, Migrations, Seeds
├── packages/
│   └── shared/                  # Shared Types (ApiResponse, AI types)
├── tests/
│   ├── unit/                    # Unit testing guidelines
│   ├── integration/             # Integration testing guidelines
│   └── e2e/                     # Playwright E2E tests & configuration
├── infra/
│   └── azure/                   # Bicep templates + Deployment scripts
├── .github/workflows/           # CI/CD (ci.yml, cd-staging.yml, cd-production.yml)
├── docs/                        # Design documentation
├── docker-compose.yml           # Local dev (dev DB + test DB)
├── Makefile                     # All common operation commands
└── Quality Configuration Files
    ├── .eslintrc.js             # ESLint (enforces no-console, no-any)
    ├── .prettierrc              # Prettier
    ├── .commitlintrc.json       # Conventional Commits rules
    ├── .cspell.json             # Spell checker dictionary
    ├── tsconfig.base.json       # Shared TypeScript settings
    └── .husky/                  # Git hooks (pre-commit, commit-msg)
```

---

## 🚀 Initial Setup

### Prerequisites

- Node.js 20+
- Docker Desktop
- Git

### Setup with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/DSasakiBusiness/ai-webapp-starter-azure.git
cd ai-webapp-starter-azure

# Initial setup (Dependencies + DB + Migrations + Seeds)
make setup

# Start all services with Docker
make dev
```

Access URLs once started:

| Service | URL                         |
| ------- | --------------------------- |
| Web     | http://localhost:3000       |
| API     | http://localhost:3001/api   |
| DB      | postgresql://localhost:5432 |

### Local Setup (Without Docker)

```bash
npm install
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Start only the database with Docker
docker compose up -d db

# Prisma Setup
cd apps/api && npx prisma generate && npx prisma migrate dev && npx prisma db seed && cd ../..

# Start dev server
npm run dev
```

---

## 🤖 AI Features

### Chat API

Executes chat completions at `POST /api/ai/chat`. Includes built-in exponential backoff retries (up to 3 times).

```json
// Request
{
  "messages": [
    { "role": "user", "content": "Hello" }
  ]
}

// Response
{
  "success": true,
  "data": {
    "content": "Hello! How can I help you today?",
    "model": "gpt-4o",
    "usage": { "promptTokens": 10, "completionTokens": 20, "totalTokens": 30 }
  }
}
```

### Automatic OpenAI / Azure OpenAI Switching

Switched via environment variables. If `AZURE_OPENAI_ENDPOINT` is set, Azure is used. Otherwise, direct OpenAI is utilized.

```env
# Direct OpenAI
OPENAI_API_KEY=sk-xxxxx

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=xxxxx
AZURE_OPENAI_DEPLOYMENT=gpt-4o
AZURE_OPENAI_API_VERSION=2024-08-01-preview
```

### Design Patterns Advised for the AI Engineer

8 Agent Design Patterns (based on [awesome-agentic-patterns](https://github.com/nibzard/awesome-agentic-patterns)) are predefined for the `ai-engineer` agent:

| #   | Pattern                                            | Importance |
| --- | -------------------------------------------------- | ---------- |
| 1   | Structured Output Specification (Zod typings)      | **Required** |
| 2   | Plan-then-Execute (Separation of planning & exec)  | **Required** |
| 3   | Budget-Aware Model Routing (Cost Control)          | **Required** |
| 4   | Failover-Aware Model Fallback (Auto-switching)     | **Required** |
| 5   | Self-Critique Evaluator Loop (Quality regenerations) | Recommended |
| 6   | Hook-Based Safety Guard Rails (Input/output sec)   | **Required** |
| 7   | LLM Observability (Metrics & Cost tracking)        | **Required** |
| 8   | Prompt Caching (Prefix caching)                    | Recommended |

---

## 🧪 Testing

```bash
# All tests
make test

# Unit tests
make test-unit

# Unit tests (Watch mode)
make test-unit-watch

# Integration tests
make test-integration

# Integration tests (with test DB in Docker)
make test-integration-docker

# E2E Tests (Playwright)
make test-e2e

# E2E Tests (Running all services in Docker)
make test-e2e-docker

# Run all tests in a Docker environment
make test-docker
```

### Testing Strategy

| Type        | Scope                                   | External Dependencies |
| ----------- | --------------------------------------- | --------------------- |
| Unit        | Business logic, Validations, Transmutes | Mocks                 |
| Integration | API endpoints, DB operations, Auth      | Test DB               |
| E2E         | E2E user flows, error displays, retries | Full Services         |
| AI Quality  | Struct evals, boundary cases, citations | Evaluation Datasets   |

---

## 🔧 Quality Assurance Tools

### Git hooks (Automated executions)

| Hook         | Tool        | Action                                             |
| ------------ | ----------- | -------------------------------------------------- |
| `pre-commit` | lint-staged | Automatically apply Prettier + ESLint to staged    |
| `commit-msg` | commitlint  | Enforce Conventional Commits (`feat:`, `fix:`, etc)|

### Quality Check Commands

```bash
# === Run All ===
make quality              # Runs lint + format + spell + knip + circular checks

# === Run Individually ===
make lint                 # ESLint (enforces no-console, no-any)
make format               # Auto-formats via Prettier
make format-check         # Prettier validation (For CI)
make spell                # cspell spell check
make knip                 # Unused codes, exports, and deps detection
make circular             # Circular dependencies detection (madge)
make deps-check           # Detects unused dependencies (depcheck)
make deps-update          # Dependency updates checks (ncu)
make sort-pkg             # Sort package.json keys
```

### ESLint Rules (Compliant with CLAUDE.md)

- `no-console`: **error** (Use NestJS `Logger`)
- `@typescript-eslint/no-explicit-any`: **error** (Use `unknown` + type guards)
- Test files allow `console`

---

## 🐳 Docker Operations

```bash
make dev              # Run all services (web:3000, api:3001, db:5432)
make dev-local        # DB only in Docker, apps run locally
make stop             # Stop containers
make restart          # Restart containers
make rebuild          # Rebuild containers (without cache)
make logs             # View all logs
make logs-api         # API logs only
make logs-web         # Web logs only
make clean            # Delete containers, volumes, node_modules wholly
make docker-shell-api # Open shell in the API container
make docker-shell-web # Open shell in the Web container
make docker-shell-db  # Open psql in DB container
```

---

## 🗄️ Database (Prisma)

### Schema Overview

| Model           | Description                                  |
| --------------- | -------------------------------------------- |
| `User`          | User management (email, role)                |
| `Conversation`  | AI Conversation Session                      |
| `Message`       | Individual message context (role, tokens, etc)|
| `Document`      | Documents for RAG retrieval                  |
| `DocumentChunk` | Document chunks (with embeddings)            |

### Operation Commands

```bash
make db-migrate            # Run migrates (via Docker)
make db-migrate-local      # Run migrates (locally)
make db-migrate-create NAME=xxx  # Create new migration
make db-seed               # Run database seeding
make db-studio             # Start Prisma Studio (locally)
make db-reset              # Reset DB (Delete all data + re-migrate)
make db-generate           # Regenerate Prisma Client
```

---

## 🤖 Claude Code Agents & Skills

### Agents (10 entities)

| Agent                     | Role                            | When to Use                          |
| ------------------------- | ------------------------------- | ------------------------------------ |
| `product-manager`         | Requirements, MVP, Priorities   | Ambiguous requirements, MVP scoping  |
| `solution-architect`      | Technical design, NFRs          | Architecture, bounded contexts       |
| `frontend-developer`      | Next.js UI Implementations      | Components, Pages                    |
| `backend-developer`       | NestJS API, DB design           | APIs, Prisma schemas changes         |
| `ai-engineer`             | LLM integration, RAG, Prompts   | AI features implementation & evals   |
| `qa-reviewer`             | Quality review, test strategies | Code quality assessments             |
| `tdd-coach`               | Enforcing TDD cycles            | Test designing prior to builds       |
| `e2e-tester`              | Playwright E2E Tests            | End-user flow validations            |
| `security-reviewer`       | PentAGI Security Validations    | Staging environment security checks  |
| `azure-platform-engineer` | Azure architecture, deploy, mon | Azure-specific operations            |

### Skills (28 skills)

<details>
<summary>General Skills (23 skills)</summary>

`clarify-product-requirements`, `define-mvp`, `implement-nextjs-ui`, `implement-nestjs-api`, `implement-prisma-schema`, `integrate-llm-feature`, `build-rag-pipeline`, `tdd-feature-delivery`, `e2e-readiness-pipeline`, `review-security-with-pentagi`, `run-ai-evals`, `review-ai-output-quality`, `review-performance`, `write-api-contract`, `generate-ui-spec`, `secure-release-pipeline`, `setup-pentagi-scan`, `review-release-readiness`, `clarify-ai-requirements`, `clarify-test-scope`, `setup-docker-dev-environment`, `run-tests-in-docker`, `manage-prisma-in-docker`

</details>

<details>
<summary>Azure Specific Skills (5 skills)</summary>

`design-azure-architecture`, `deploy-to-azure`, `setup-azure-ci-cd`, `configure-azure-secrets`, `monitor-on-azure`

</details>

---

## ☁️ Azure Deployments

### Prerequisites

- Azure CLI (`az`) is installed
- Logged in via `az login`

### Deploy

```bash
# Staging
cd infra/azure && ./scripts/deploy.sh staging

# Production
./scripts/deploy.sh production
```

### CI/CD Pipelines

| Trigger                        | Action                                  |
| ------------------------------ | --------------------------------------- |
| PR / push to `main`, `develop` | CI (lint, format check, test, build)    |
| push to `develop`              | Staging Auto-Deployment                 |
| `v*` tag push                  | Production Deployment (Manual Approval) |

---

## 🔒 Security

### PentAGI Security Reviews

> ⚠️ **IMPORTANT**: PentAGI must **NEVER** be run against production environments. Restrict dynamically to isolated/staging.

1. Deploy to staging environment.
2. Set `PENTAGI_*` variables in `.env`.
3. Request review to `security-reviewer` agent.
4. Triage by critical / high / medium / low.
5. **Human review required** before applying remediation.

### Implementation Restrictions

- ❌ Using `any` type (Strictly `unknown` + Type Guards)
- ❌ Logging via `console.log` commit (Use NestJS `Logger`)
- ❌ Hardcoding of secrets
- ❌ Adding features without tests
- ❌ Direct `.env` referencing (Retrieve strictly from `ConfigService`)

---

## 🧩 Extensions

### Adding New API Modules

```bash
cd apps/api
npx nest generate module modules/feature-name
npx nest generate controller modules/feature-name
npx nest generate service modules/feature-name
```

### Adding New Schemas

1. Add explicit model entities to `apps/api/prisma/schema.prisma`
2. Run `make db-migrate-create NAME=add_new_model`
3. Execute `make db-generate` to regenerate Prisma client.

### Adding New Agents / Skills

- Agent: Include `.md` rule specs beneath `.claude/agents/<category>/`
- Skill: Construct `.claude/skills/<category>/<skill-name>/SKILL.md`

---

## 📝 Commit Conventions

All commits strictly enforce [Conventional Commits](https://www.conventionalcommits.org/) standards (verified automatically via commitlint).

```
<type>: <subject>     (Max 100 chars)

[optional body]
[optional footer]
```

Allowed Types:

| type       | Usage                 |
| ---------- | --------------------- |
| `feat`     | New Features          |
| `fix`      | Bug Fixes             |
| `docs`     | Documentations        |
| `style`    | Format / Styles       |
| `refactor` | Refactoring           |
| `perf`     | Performance Gains     |
| `test`     | Adding / Modding Tests|
| `build`    | Build / Dependencies  |
| `ci`       | CI/CD Pipeline configs|
| `chore`    | Chore tasks           |
| `revert`   | Reverting patches     |

---

## 📄 License

[MIT License](LICENSE)
