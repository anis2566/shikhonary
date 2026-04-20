# CONCERNS.md

## Technical Debt
- Ensure shared packages (`ui`, `utils`) maintain strict backward compatibility. Breaking changes here impact both `apps/admin` and `apps/tenant`.
- Database schemas in `packages/db` likely handle complicated multi-tenant setups. Migrations must be handled cautiously so tenant data boundaries are preserved.

## Security
- External dependencies such as Better Auth must be audited regularly.
- Keep `GEMINI_API_KEY`, `RESEND_API_KEY`, etc., purely server-side. Never leak them into the client bundle in the Next.js applications (avoid using `NEXT_PUBLIC_` prefixed vars for sensitive keys).

## Performance
- Cold start of Turborepo dev server (`pnpm dev`) relies strictly on local cache performance.
- Large number of dependencies might impact Next.js build times. Monitor `pnpm-lock.yaml` size.

## Fragile Areas
- `db:generate:all` and `db:generate:tenant` might collide if both databases process overlapping operations asynchronously. Proper dependency tree in `turbo.json` must be strictly observed.
- Code generation synchronization across `packages/api` and frontend consumers in `packages/api-client` must remain in lockstep.
