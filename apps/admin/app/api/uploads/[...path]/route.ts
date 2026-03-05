import { NextRequest, NextResponse } from "next/server";
import { createReadStream, statSync } from "fs";
import { join, normalize, resolve } from "path";
import { Readable } from "stream";

const UPLOAD_ROOT = join(process.cwd(), "uploads");

const MIME_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  // ── Security: prevent directory traversal ─────────────────────────────────
  const relativePath = normalize(segments.join("/"));
  const absolutePath = resolve(UPLOAD_ROOT, relativePath);

  if (!absolutePath.startsWith(UPLOAD_ROOT)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ── Check file exists ──────────────────────────────────────────────────────
  let stat: ReturnType<typeof statSync>;
  try {
    stat = statSync(absolutePath);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!stat.isFile()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // ── Determine MIME type ───────────────────────────────────────────────────
  const ext = absolutePath.slice(absolutePath.lastIndexOf(".")).toLowerCase();
  const contentType = MIME_TYPES[ext] ?? "application/octet-stream";

  // ── Stream the file ───────────────────────────────────────────────────────
  const nodeStream = createReadStream(absolutePath);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream;

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": stat.size.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
