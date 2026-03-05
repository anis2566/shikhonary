import { Inngest } from "inngest";

const isDev = process.env.NODE_ENV !== "production";

export const inngest = new Inngest({
  id: "shikhonary-admin",
  // In dev: point to the local Inngest dev server (http://localhost:8288)
  // In production: INNGEST_EVENT_KEY and INNGEST_SIGNING_KEY are read from env automatically.
  ...(isDev && {
    baseUrl: "http://localhost:8288",
  }),
});
