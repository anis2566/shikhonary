import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
  processPdfIngestion,
  handlePdfIngestionFailure,
} from "@/inngest/functions/process-pdf-ingestion";
import { generateTtsAudio } from "@/inngest/functions/generate-tts-audio";

// This route is what Inngest calls to invoke your functions.
// Local dev: make sure `inngest dev` is running (or use `npx inngest-cli@latest dev`).
// Production: Inngest Cloud calls POST /api/inngest with signed requests.
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processPdfIngestion, handlePdfIngestionFailure, generateTtsAudio],
});
