# INTEGRATIONS.md

## Database
- **Primary Database**: Connected via `DATABASE_URL`.
- **Tenant Database**: Connected via `TENANT_DATABASE_URL`.
- *Details*: Connection details reside in `packages/db`.

## Authentication
- **Better Auth**: Utilizes `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` for secure session management and authentication handling.
- *Location*: Primarily managed within `packages/auth`.

## Email & Communications
- **Resend**: Transactional emails handled by `Resend` via `RESEND_API_KEY`.
- *Location*: Configured and used within `packages/email`.

## Background Jobs & Events
- **Inngest**: Event-driven background jobs and scheduled tasks.
- *Keys*: `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY`.
- *Usage*: Orchestrates resilient async workloads.

## AI & Third-Party APIs
- **Google Gemini**: Uses `GEMINI_API_KEY` to connect to Google's generative AI models.
- **Google TTS**: Text-to-speech integration using `GOOGLE_TTS_API_KEY`.

## Environment Expectations
- `NEXT_PUBLIC_APP_URL`: Base application URL.
- `NODE_ENV`: Standard environment indicator (`development`, `production`, `test`).
