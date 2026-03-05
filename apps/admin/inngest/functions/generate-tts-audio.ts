import { inngest } from "@/inngest/client";
import { prisma } from "@workspace/db";
import { createHash } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const AUDIO_DIR = join(process.cwd(), "uploads", "audio");

/** SHA-256 hash of a string — used as the deduplication key in AudioCache */
function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

/**
 * Call Google Cloud TTS REST API to synthesise Bangla speech.
 * Returns the raw mp3 Buffer.
 */
async function callGoogleTts(
  text: string,
  languageCode = "bn-BD",
): Promise<Buffer> {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_TTS_API_KEY is not set");

  const body = {
    input: { text },
    voice: { languageCode, name: "bn-BD-Wavenet-A" },
    audioConfig: { audioEncoding: "MP3" },
  };

  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Google TTS API error ${res.status}: ${error}`);
  }

  const { audioContent } = (await res.json()) as { audioContent: string };
  return Buffer.from(audioContent, "base64");
}

// ── Inngest Function ──────────────────────────────────────────────────────────

export const generateTtsAudio = inngest.createFunction(
  {
    id: "generate-tts-audio",
    retries: 2,
  },
  { event: "tts/audio.requested" },

  async ({ event, step }) => {
    const { blockId } = event.data as { blockId: string };

    // ── Step 1: Check AudioCache ──────────────────────────────────────────────
    const cached = await step.run("check-cache", async () => {
      const block = await prisma.contentBlock.findUnique({
        where: { id: blockId },
        select: { rawText: true, aiDescription: true },
      });

      const text = block?.aiDescription ?? block?.rawText ?? "";
      if (!text) return null;

      const hash = sha256(text);
      const existing = await prisma.audioCache.findUnique({
        where: { textHash: hash },
      });
      if (existing)
        return { fromCache: true, vpsPath: existing.vpsPath, textHash: hash };

      return { fromCache: false, text, textHash: hash };
    });

    if (!cached) {
      return {
        success: false,
        reason: "ContentBlock has no text to synthesise",
      };
    }
    if (cached.fromCache && "vpsPath" in cached) {
      return { success: true, fromCache: true, audioUrl: cached.vpsPath };
    }

    // ── Step 2: Call TTS API + save file ─────────────────────────────────────
    const result = await step.run("generate-and-save-audio", async () => {
      await mkdir(AUDIO_DIR, { recursive: true });

      const textToSynth = (
        cached as { text: string; textHash: string; fromCache: boolean }
      ).text;
      const mp3Buffer = await callGoogleTts(textToSynth);
      const vpsPath = `/uploads/audio/${cached.textHash}.mp3`;
      const filePath = join(AUDIO_DIR, `${cached.textHash}.mp3`);
      await writeFile(filePath, mp3Buffer);

      // Upsert to handle retries gracefully (avoid duplicate key errors)
      await prisma.audioCache.upsert({
        where: { textHash: cached.textHash },
        create: {
          blockId,
          textHash: cached.textHash!,
          vpsPath,
          language: "bn",
        },
        update: { vpsPath },
      });

      return { audioUrl: vpsPath };
    });

    return { success: true, fromCache: false, audioUrl: result.audioUrl };
  },
);
