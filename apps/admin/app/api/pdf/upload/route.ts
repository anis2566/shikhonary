import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { inngest } from "@/inngest/client";
import { prisma } from "@workspace/db";

const UPLOAD_DIR = join(process.cwd(), "uploads", "pdfs");
const MAX_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // ── Extract fields ─────────────────────────────────────────────
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const classLevel = formData.get("classLevel") as string | null;
    const version = formData.get("version") as string | null;
    const academicClassId = formData.get("academicClassId") as string | null;
    const academicSubjectId = formData.get("academicSubjectId") as
      | string
      | null;

    // ── Validate ───────────────────────────────────────────────────
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 },
      );
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File exceeds 100 MB limit" },
        { status: 400 },
      );
    }
    if (!title || !classLevel || !version) {
      return NextResponse.json(
        { error: "title, classLevel, and version are required" },
        { status: 400 },
      );
    }

    // ── Save file to disk ──────────────────────────────────────────
    await mkdir(UPLOAD_DIR, { recursive: true });
    const uuid = randomUUID();
    const fileName = `${uuid}.pdf`;
    const filePath = join(UPLOAD_DIR, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Relative path stored in DB (served via /api/uploads/...)
    const fileUrl = `/uploads/pdfs/${fileName}`;

    // ── Create Book + PdfIngestionJob records ──────────────────────
    const db = prisma;

    const book = await db.book.create({
      data: {
        title,
        classLevel: parseInt(classLevel, 10),
        version,
        academicClassId: academicClassId ?? undefined,
        academicSubjectId: academicSubjectId ?? undefined,
        ingestionJob: {
          create: {
            status: "PENDING",
            fileName: file.name,
            fileUrl,
            fileSizeBytes: file.size,
            geminiModel: "gemini-2.0-flash",
          },
        },
      },
      include: { ingestionJob: true },
    });

    const jobId = book.ingestionJob!.id;

    // ── Fire Inngest event (non-blocking) ──────────────────────────
    const { ids } = await inngest.send({
      name: "pdf/ingestion.requested",
      data: {
        jobId,
        bookId: book.id,
        fileUrl,
        filePath, // absolute path used by the worker
      },
    });

    // Store the Inngest event ID for tracing
    await db.pdfIngestionJob.update({
      where: { id: jobId },
      data: { inngestEventId: ids[0] },
    });

    return NextResponse.json(
      { success: true, bookId: book.id, jobId },
      { status: 201 },
    );
  } catch (err) {
    console.error("[pdf/upload] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
