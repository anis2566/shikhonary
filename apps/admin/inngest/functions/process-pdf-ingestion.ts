import { inngest } from "@/inngest/client";
import { prisma } from "@workspace/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

// ── Types ─────────────────────────────────────────────────────────────────────

type ExtractedBlock = {
  type: "heading" | "paragraph" | "figure" | "formula" | "table";
  rawText?: string;
  /** Gemini's inline Bangla description for figures/tables */
  aiDescription?: string;
  caption?: string;
  pageNumber: number;
  isImage: boolean;
};

type ExtractedChapter = {
  chapterName: string;
  chapterNo: number;
  pageStart: number;
  pageEnd: number;
  blocks: ExtractedBlock[];
};

type ExtractionResult = {
  chapters: ExtractedChapter[];
};

// ── Gemini helpers ────────────────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);

/**
 * Upload the raw PDF to Gemini File API, extract all structured content,
 * then delete the uploaded file to avoid quota build-up.
 */
async function extractFromPdf(
  filePath: string,
  originalFileName: string,
  onProgress?: (msg: string) => void,
): Promise<ExtractionResult> {
  onProgress?.("Uploading PDF to Gemini File API…");

  // Upload the PDF
  const upload = await fileManager.uploadFile(filePath, {
    mimeType: "application/pdf",
    displayName: originalFileName,
  });

  onProgress?.(`PDF uploaded (${upload.file.name}). Waiting for processing…`);

  // Poll until the file is ACTIVE
  let file = await fileManager.getFile(upload.file.name);
  let waited = 0;
  while (file.state !== "ACTIVE") {
    if (file.state === "FAILED" || waited > 120_000) {
      throw new Error(`Gemini file processing failed: ${file.state}`);
    }
    await new Promise((r) => setTimeout(r, 3000));
    waited += 3000;
    file = await fileManager.getFile(upload.file.name);
  }

  onProgress?.("File active. Sending to Gemini for content extraction…");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  });

  const prompt = `
You are a precise content extractor for NCTB (Bangladesh National Curriculum) textbooks.

Analyse the entire PDF and extract ALL content into a structured JSON object.

Return ONLY this JSON (no markdown, no explanation):
{
  "chapters": [
    {
      "chapterName": "অধ্যায় ১: ভৌত রাশি ও পরিমাপ",
      "chapterNo": 1,
      "pageStart": 1,
      "pageEnd": 20,
      "blocks": [
        {
          "type": "heading",
          "rawText": "ভৌত রাশি ও পরিমাপ",
          "pageNumber": 1,
          "isImage": false
        },
        {
          "type": "paragraph",
          "rawText": "পদার্থবিজ্ঞানে পরিমাপ একটি গুরুত্বপূর্ণ বিষয়।",
          "pageNumber": 2,
          "isImage": false
        },
        {
          "type": "figure",
          "caption": "চিত্র ১.১: ভার্নিয়ার স্কেল",
          "aiDescription": "চিত্রটিতে একটি ভার্নিয়ার স্কেল দেখানো হয়েছে। স্কেলে প্রধান স্কেল ও ভার্নিয়ার স্কেল চিহ্নিত করা আছে।",
          "pageNumber": 5,
          "isImage": true
        }
      ]
    }
  ]
}

STRICT RULES:
1. Preserve all Bangla (Bengali) Unicode text EXACTLY as printed.
2. For "figure", "table", "formula" blocks: set isImage=true and write a detailed Bangla aiDescription (3–5 sentences) describing what the image/table/formula contains visually. Leave rawText null for pure figures.
3. For "heading", "paragraph" blocks: set isImage=false and include the exact rawText.
4. Identify chapter boundaries from large chapter headings (অধ্যায়, Chapter, etc.).
5. Every page must be covered. Number blocks in reading order.
6. Return ONLY the JSON — no markdown fences, no commentary.
`;

  // 429-aware retry — sleeps exactly as long as Gemini asks before retrying
  async function callGeminiWithRetry(maxAttempts = 3): Promise<string> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await model.generateContent([
          {
            fileData: { mimeType: "application/pdf", fileUri: upload.file.uri },
          },
          prompt,
        ]);
        return result.response.text().trim();
      } catch (err: any) {
        const msg: string = err?.message ?? "";
        const delayMatch =
          msg.match(/retry[^\d]*(\d+)s/i) ?? msg.match(/(\d+)s/i);
        const delaySec = delayMatch
          ? parseInt(delayMatch[1]!, 10)
          : 60 * attempt;

        if (msg.includes("429") && attempt < maxAttempts) {
          onProgress?.(
            `Gemini rate limited — waiting ${delaySec}s before retry (attempt ${attempt}/${maxAttempts})…`,
          );
          await new Promise((r) => setTimeout(r, delaySec * 1000));
          continue;
        }
        throw err;
      }
    }
    throw new Error("Gemini extraction failed after all retries");
  }

  const responseText = await callGeminiWithRetry();

  // Clean up the uploaded file (fire-and-forget, don't block on errors)
  fileManager.deleteFile(upload.file.name).catch(() => {});

  onProgress?.("Parsing Gemini response…");

  // Strip possible markdown fences just in case
  const json = responseText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: ExtractionResult;
  try {
    parsed = JSON.parse(json) as ExtractionResult;
  } catch {
    // If the whole response failed, return a single-chapter fallback
    console.error(
      "[pdf-ingestion] Failed to parse Gemini JSON:",
      json.slice(0, 500),
    );
    parsed = { chapters: [] };
  }

  if (!parsed.chapters || !Array.isArray(parsed.chapters)) {
    parsed.chapters = [];
  }

  return parsed;
}

// ── Inngest Function ──────────────────────────────────────────────────────────

export const processPdfIngestion = inngest.createFunction(
  {
    id: "process-pdf-ingestion",
    retries: 2,
    concurrency: { limit: 2, key: "event.data.jobId" },
    // Give Gemini file upload + extraction plenty of time (15 min per step)
    timeouts: { finish: "15m" },
  },
  { event: "pdf/ingestion.requested" },

  async ({ event, step }) => {
    const { jobId, bookId, filePath } = event.data as {
      jobId: string;
      bookId: string;
      filePath: string;
    };

    // ── Step 1: Mark PROCESSING ───────────────────────────────────────────────
    await step.run("mark-processing", async () => {
      await prisma.pdfIngestionJob.update({
        where: { id: jobId },
        data: {
          status: "PROCESSING",
          startedAt: new Date(),
          geminiModel: "gemini-2.0-flash",
        },
      });
    });

    // ── Step 2: Send PDF to Gemini & extract all content ──────────────────────
    const extraction = await step.run("gemini-extract-pdf", async () => {
      const job = await prisma.pdfIngestionJob.findUnique({
        where: { id: jobId },
      });
      const fileName = job?.fileName ?? "textbook.pdf";
      return await extractFromPdf(filePath, fileName);
    });

    // ── Step 3: Upsert Chapters ───────────────────────────────────────────────
    await step.run("upsert-chapters", async () => {
      await prisma.pdfIngestionJob.update({
        where: { id: jobId },
        data: {
          chaptersFound: extraction.chapters.length,
          totalPages: extraction.chapters.at(-1)?.pageEnd ?? 0,
        },
      });

      for (const ch of extraction.chapters) {
        await prisma.chapter.upsert({
          where: { bookId_chapterNo: { bookId, chapterNo: ch.chapterNo } },
          create: {
            bookId,
            chapterNo: ch.chapterNo,
            chapterName: ch.chapterName,
            pageStart: ch.pageStart,
            pageEnd: ch.pageEnd,
            position: ch.chapterNo - 1,
          },
          update: {
            chapterName: ch.chapterName,
            pageStart: ch.pageStart,
            pageEnd: ch.pageEnd,
          },
        });
      }
    });

    // ── Step 4: Save ContentBlocks ────────────────────────────────────────────
    let totalBlocks = 0;
    let totalFigures = 0;

    await step.run("save-content-blocks", async () => {
      for (const ch of extraction.chapters) {
        const chapter = await prisma.chapter.findUnique({
          where: { bookId_chapterNo: { bookId, chapterNo: ch.chapterNo } },
        });
        if (!chapter) continue;

        let orderIndex = 0;

        for (const block of ch.blocks) {
          const contentBlock = await prisma.contentBlock.create({
            data: {
              chapterId: chapter.id,
              type: block.type,
              rawText: block.rawText ?? null,
              aiDescription: block.aiDescription ?? null,
              orderIndex: orderIndex++,
              pageNumber: block.pageNumber,
            },
          });
          totalBlocks++;

          // For figure/table blocks: save a placeholder ContentBlockMedia entry
          // (no image bytes yet — Gemini gave us a text description instead)
          if (block.isImage && (block.aiDescription || block.caption)) {
            await prisma.contentBlockMedia.create({
              data: {
                blockId: contentBlock.id,
                // Placeholder path — admin can upload the actual image via UI later
                mediaPath: "",
                mimeType: "image/png",
                caption: block.caption ?? null,
                altText: block.aiDescription ?? null,
                pageNumber: block.pageNumber,
                position: 0,
              },
            });
            totalFigures++;
          }
        }

        // Update progress
        await prisma.pdfIngestionJob.update({
          where: { id: jobId },
          data: {
            processedPages: ch.pageEnd ?? 0,
            blocksExtracted: totalBlocks,
            figuresCropped: totalFigures,
          },
        });
      }
    });

    // ── Step 5: Mark COMPLETED ────────────────────────────────────────────────
    await step.run("mark-completed", async () => {
      await prisma.pdfIngestionJob.update({
        where: { id: jobId },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          blocksExtracted: totalBlocks,
          figuresCropped: totalFigures,
        },
      });
    });

    return {
      success: true,
      jobId,
      bookId,
      chaptersFound: extraction.chapters.length,
      blocksExtracted: totalBlocks,
      figuresCropped: totalFigures,
    };
  },
);

// ── Failure handler ───────────────────────────────────────────────────────────

export const handlePdfIngestionFailure = inngest.createFunction(
  { id: "handle-pdf-ingestion-failure" },
  { event: "inngest/function.failed" },
  async ({ event }) => {
    if (event.data.function_id !== "process-pdf-ingestion") return;
    const jobId = (event.data.event?.data as { jobId?: string })?.jobId;
    if (!jobId) return;
    await prisma.pdfIngestionJob.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
        errorMessage: event.data.error?.message ?? "Unknown error",
        completedAt: new Date(),
      },
    });
  },
);
