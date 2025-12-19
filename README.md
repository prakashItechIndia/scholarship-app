# app-icaptur-ai Monorepo

A pnpm-powered monorepo that hosts the first release of the iCaptur.AI platform. It currently ships:

- Frontend React applications (SSO portal, Billing portal portal) served via Vite.
- NestJS backend services for SSO and Billing, backed by PostgreSQL via Drizzle ORM.
- Shared UI + utility packages that are consumed across apps and services.

Use this document as the hand-off reference for the team lead and any new contributors.

## System Requirements

- Node.js `>= 18.0.0`
- pnpm `>= 8.0.0`
- PostgreSQL 14+ (local or containerised)
- Optional tooling: Docker Desktop, TablePlus/pgAdmin, VS Code

Install pnpm once globally:

```bash
npm install -g pnpm
```

## Repository Layout

```
app.icaptur.ai/
├── apps/
│   └── web/
│       ├── apps/
│       │   └── scholarship-app/   # React Scholarship portal (Vite)
│       ├── packages/
│       │   └── shared/           # Shared React UI + utilities
│       └── README.md
├── packages/
│   ├── ui/                       # Cross-app design system building blocks
│   └── types/                    # Shared TypeScript contracts
├── services/
│   └── scholarship-api/          # NestJS service (authentication + Scholarship)
├── docs/                         # Product & engineering documentation
├── BRD_iCaptur_SSO_Billing_Platform_v1.0.md
├── pnpm-workspace.yaml
└── package.json                  # Shared scripts and tooling
```

Each workspace owns its own `package.json` with framework-specific scripts. The root `package.json` exposes one-command entry points for the workflows listed below.

## First-Time Setup

1. **Clone & install**

   ```bash
   git clone <repository-url>
   cd app.icaptur.ai
   pnpm install
   ```

2. **Bootstrap local environment variables**
   - Copy any available `.env.example` files to `.env.local` (or create new `.env` files) inside each workspace you plan to run.
   - Minimum required secrets:
     - `services/scholarship-api`: `DATABASE_URL`
   - Use `postgresql://user:password@localhost:5432/<db>` for local development.

3. **Prepare databases (PostgreSQL)**

   ```bash
   # Create local databases once (names are suggestions)
   createdb app_icaptur
   createdb icaptur_billing

   # Update DATABASE_URL in each service to point to the respective DB
   ```

4. **Run initial migrations**

   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

## Day-to-Day Commands

### Root scripts (run from repository root)

```bash
pnpm dev                      # Start all frontend apps and backend services
pnpm dev:scholarship-app      # Run only the Scholarship React app
pnpm dev:billing-app          # Run only the Billing React app
pnpm dev:scholarship-api      # Run Scholarship NestJS service in watch mode
pnpm dev:billing-api          # Run Billing NestJS service in watch mode

pnpm build               # Build all packages, apps, and services
pnpm build:scholarship   # Build the Scholarship NestJS service
pnpm build:billing       # Build the Billing NestJS service

pnpm lint                # Lint all workspaces
pnpm lint:scholarship    # Lint Scholarship service only
pnpm lint:billing        # Lint Billing service only
pnpm type-check          # Run TypeScript checks across the workspace

pnpm test                # Run all unit tests
pnpm test:scholarship-api # Scholarship API test suite (Jest)
pnpm test:e2e            # End-to-end test placeholder workspace

pnpm db:generate:sso     # Generate SSO Drizzle SQL (based on schema changes)
pnpm db:migrate:sso      # Apply SSO migrations

pnpm format              # Format code with Prettier
pnpm format:check        # Prettier consistency check
pnpm clean               # Remove build outputs + node_modules (all workspaces)
```

### Common workspace entry points

- Frontend Vite apps: `pnpm --filter scholarship-app dev` (or run via root aliases above).
- NestJS services: `pnpm --filter @icaptur-api/<service> start:dev`.
- Shared package unit tests: `pnpm --filter ./apps/web/packages/shared test` (if/when tests exist).

## Running the Full Stack Locally

1. Start backend dependencies (PostgreSQL). If you prefer Docker:

   ```bash
   docker run --name icaptur-postgres -p 5432:5432 \
     -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres \
     -e POSTGRES_DB=app_icaptur -d postgres:15
   ```

   Create additional databases via `psql` or GUI tools.

2. Launch the API:

   ```bash
   pnpm dev:scholarship-api
   ```

   - Scholarship API listens on `http://localhost:3000` by default (`GLOBAL_PREFIX=/api`).

3. In a separate terminal, run the Scholarship frontend:

   ```bash
   pnpm dev:scholarship-app   # Vite dev server on http://localhost:5173
   ```

4. Updates propagate instantly thanks to Vite + NestJS watch modes.

## Database & Migrations

- Shared schema definitions live in `packages/database-schema`.
- All SQL migrations are generated into `database/drizzle` via `database/drizzle.config.ts`.
- Apply migrations (for both services) after schema updates:

  ```bash
  pnpm db:generate
  pnpm db:migrate
  ```

  Service-level scripts delegate to these root commands, ensuring a single source of truth for the database.

## Testing & Quality Gates

```bash
pnpm lint            # ESLint across apps, services, packages
pnpm type-check      # TypeScript project references
pnpm test            # Aggregated unit tests
pnpm format:check    # Prettier formatting check
```

- Frontend apps use Vite + React Testing Library (tests to be added).
- Backend services rely on Jest (unit, integration, and e2e skeleton under `services/**/test`).
- Add new suites per workspace as features mature.

## Troubleshooting

- **`DATABASE_URL is required`** – ensure `.env` is loaded or export the variable before starting NestJS services.
- **Port collisions** – adjust `PORT` in each service `.env`.
- **Drizzle migrations drifting** – rerun `db:generate` and commit the generated SQL.
- **pnpm filter not finding workspace** – run `pnpm install` after creating new packages and make sure they are declared in `pnpm-workspace.yaml`.

## Additional References

- `apps/web/packages/shared/DESIGN_TOKENS_USAGE.md` & `THEME_VARIABLES_GUIDE.md` for UI system conventions.
- `services/sso-api/README.md` for focused backend notes.
- `docs/` and `BRD_iCaptur_SSO_Billing_Platform_v1.0.md` for product background.

---

Maintained by the iCaptur.AI engineering team. Reach out in the `#icaptur-platform` Slack channel for support or onboarding.
