# TESTING.md

## Framework & Tooling
- Currently, no distinct testing framework (e.g., Jest, Vitest) is overtly listed in the root `package.json`. However, unit testing might be configured within individual packages.
- Need to verify if Playwright or Cypress workflows exist for end-to-end tests inside the `apps` directories.

## Structure
- Unit tests typically co-located with their sources (e.g., `filename.test.ts`).
- End-to-end tests (if present) are typically separated in an `e2e` folder.

## Mocking
- Mocks are generally structured near the tests or inside a dedicated `__mocks__` directory for heavy abstractions.
- External dependencies like `DATABASE_URL`, `RESEND_API_KEY`, etc. must be mocked consistently during test execution.

## Coverage
- The project relies heavily on TypeScript's compilation `pnpm turbo run check-types` for type safety as the primary guardrail.
- Integration tests assume successful connectivity to development database instances rather than strictly mocking DB queries.
