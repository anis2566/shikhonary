# STACK.md

## Languages & Runtimes
- **TypeScript**: version `5.9.3` or greater, strict typing.
- **Node.js**: Expected `engine` is `>=20`.
- **Package Manager**: `pnpm@10.4.1`.

## Monorepo
- **Turbo**: Monorepo build system (`turbo@^2.8.1`). Manage workspace tasks like `build`, `dev`, `lint`, and `db:generate`.
- **pnpm workspaces**: Configured root workspace. See `pnpm-workspace.yaml`.

## Frameworks
- **Next.js**: Primary web framework used for `apps/admin` and `apps/tenant`.
- **UI Components**: Likely built with React and possibly Tailwind CSS, provided via the `packages/ui` package.

## Tooling
- **Linting**: ESLint, configured via `packages/eslint-config`.
- **Formatting**: Prettier (`^3.8.1`), custom script runs `prettier --write "**/*.{ts,tsx,md}"`.
- **TypeScript Config**: Shared configurations via `packages/typescript-config`.

## Datastore & ORM
- **Database**: Multiple databases (`DATABASE_URL`, `TENANT_DATABASE_URL`), configured in `packages/db`.
- **DB Generation**: Automated generation via `db:generate` and `db:generate:tenant` turbo tasks.

## Other Dependencies
- **Authentication**: `better-auth` (based on `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` env vars).
- **Background Jobs**: `inngest` (based on `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`).
- **Emails**: `resend` (based on `RESEND_API_KEY`).
- **AI/ML**: `Gemini API`, configured with `GEMINI_API_KEY`.
