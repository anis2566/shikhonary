# ARCHITECTURE.md

## High-Level Pattern
- **Monorepo (Turborepo)**: The architecture is structured as a single monorepo housing multiple independent frontend applications and shared internal packages.
- **Micro-Frontends/Multiple Apps**: Distinct web apps logic separated into `apps/admin` (back-office) and `apps/tenant` (customer-facing).

## Layers & Data Flow
1. **Presentation Layer**: Next.js applications in `apps/`.
2. **API/Client Layer**: `packages/api` provides server-side routers, while `packages/api-client` likely provides hooks/clients for the frontends to consume.
3. **Business Logic & Schema**: `packages/schema` defines shared data models or validations (e.g., Zod schemas).
4. **Data Access Layer**: `packages/db` abstracts database connectivity, migrations, and queries.

## Key Abstractions
- **UI Components**: `packages/ui` abstracts common interface elements for reuse.
- **Authentication**: `packages/auth` decouples authentication logic from the individual apps.
- **Email**: `packages/email` centralizes all templating and delivery logic.
- **Utils**: `packages/utils` contains shared pure helper functions.

## Entry Points
- `apps/admin`: Admin dashboard entry point.
- `apps/tenant`: Tenant portal entry point.
- Individual apps expose standard Next.js routes (e.g., `app/page.tsx` or `pages/index.tsx`).
