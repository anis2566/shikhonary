# STRUCTURE.md

## Directory Layout overview

```text
/
├── apps/
│   ├── admin/            # Next.js admin application
│   └── tenant/           # Next.js tenant application
├── packages/
│   ├── api/              # Backend API routes / tRPC routers
│   ├── api-client/       # Frontend client hooks
│   ├── auth/             # Better Auth configuration
│   ├── db/               # Database ORM, schemas, migrations
│   ├── email/            # Resend templates
│   ├── eslint-config/    # Shared linting rules
│   ├── schema/           # Shared validation schemas (e.g. Zod)
│   ├── typescript-config/# Shared tsconfig.json files
│   ├── ui/               # Shared React components
│   └── utils/            # Common utility functions
├── .github/              # Likely CI/CD workflows (if it exists)
├── .vscode/              # Editor settings
├── turbo.json            # Turborepo pipeline configuration
├── pnpm-workspace.yaml   # Workspace definitions
└── package.json          # Root dependencies and scripts
```

## Naming Conventions
- Workspace packages are scoped under `@workspace/*` (e.g., `@workspace/eslint-config`, `@workspace/typescript-config`).
- Apps and packages use lowercase names with hyphens for separation (kebab-case).

## Key Locations
- **Scripts**: Root `package.json` drives `turbo` scripts.
- **Code standards**: `packages/eslint-config` dictates code hygiene across the monorepo.
- **Environment**: Global `.env` files coordinate local development keys (e.g., `DATABASE_URL`, `GEMINI_API_KEY`).
