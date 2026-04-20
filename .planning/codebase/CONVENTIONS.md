# CONVENTIONS.md

## Code Style
- **Formatting**: Managed by `Prettier` (v3+). Standard spacing and quotes.
- **Linting**: High standards enforced by `eslint` through `@workspace/eslint-config`. All files must pass `turbo lint`.
- **TypeScript**: Strict mode enabled. Types and interfaces should be explicit. No `any` unless absolutely necessary.

## Naming
- **Files/Folders**: `kebab-case` for file and directory names (e.g., `api-client`).
- **Variables/Functions**: `camelCase` for local instances, functions, and variables.
- **Components/Classes**: `PascalCase` for React components and class definitions.
- **Constants**: `UPPER_SNAKE_CASE` for global constant values.

## Patterns
- **Monorepo boundaries**: Apps in `apps/` must not import directly from each other. They import from `packages/*`.
- **Dependency Management**: Common dependencies should be aligned to avoid duplicates.
- **Validation**: Schema-first validation (likely `Zod`) before processing data in API layer.

## Error Handling
- Use structured responses from standard error classes.
- API layer should capture unexpected throws and return sensible HTTP status codes without leaking server internals.
- UI layer to handle form error states and standard global error boundaries using Next.js patterns.
