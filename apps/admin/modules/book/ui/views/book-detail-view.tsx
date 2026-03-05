"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  ArrowLeft,
  FileText,
  BarChart3,
  Hash,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { useBookById, useChaptersByBook } from "@workspace/api-client";

function StatusPill({ status }: { status?: string }) {
  const map: Record<string, { label: string; cls: string; spin?: boolean }> = {
    COMPLETED: {
      label: "Extraction Complete",
      cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    },
    PROCESSING: {
      label: "Extracting…",
      cls: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      spin: true,
    },
    PENDING: {
      label: "Queued",
      cls: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    },
    FAILED: {
      label: "Extraction Failed",
      cls: "bg-destructive/10 text-destructive border-destructive/30",
    },
  };
  const cfg = (map[status ?? ""] ?? map["PENDING"])!;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border",
        cfg.cls,
      )}
    >
      {cfg.spin && <Loader2 className="w-3 h-3 animate-spin" />}
      {cfg.label}
    </span>
  );
}

function ProgressBar({ job }: { job: any }) {
  if (!job || !["PROCESSING", "PENDING"].includes(job.status)) return null;
  const pct = job.totalPages
    ? Math.min(Math.round((job.processedPages / job.totalPages) * 100), 99)
    : 0;
  return (
    <div className="space-y-2 bg-muted/30 rounded-2xl p-4 border border-border/40">
      <div className="flex justify-between text-xs font-semibold text-muted-foreground">
        <span>Gemini is analysing your PDF — this may take a few minutes</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-700 relative overflow-hidden"
          style={{ width: `${Math.max(pct, 5)}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>
      <div className="flex gap-6 text-[10px] text-muted-foreground">
        <span>
          Pages: {job.processedPages ?? 0}/{job.totalPages ?? "?"}
        </span>
        <span>Chapters: {job.chaptersFound ?? 0}</span>
        <span>Blocks: {job.blocksExtracted ?? 0}</span>
        <span>Figures: {job.figuresCropped ?? 0}</span>
      </div>
    </div>
  );
}

export const BookDetailView = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const router = useRouter();
  const { data: book, isLoading } = useBookById(bookId);
  const { data: chapters, isLoading: chaptersLoading } =
    useChaptersByBook(bookId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <XCircle className="w-12 h-12 text-destructive" />
        <p className="text-lg font-semibold">Book not found</p>
        <Button variant="outline" onClick={() => router.push("/books")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Books
        </Button>
      </div>
    );
  }

  const job = book.ingestionJob;

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      {/* ── Book header ─────────────────────────────────────────────── */}
      <div className="bg-card/80 backdrop-blur-xl rounded-[2.5rem] border border-border/60 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="text-2xl font-black text-foreground">
              {book.title}
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              Class {book.classLevel} · {book.version} Version
            </p>
            <StatusPill status={job?.status} />
          </div>
          {job?.status === "COMPLETED" && (
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Chapters", val: job.chaptersFound ?? 0 },
                { label: "Blocks", val: job.blocksExtracted ?? 0 },
                { label: "Figures", val: job.figuresCropped ?? 0 },
              ].map(({ label, val }) => (
                <div key={label} className="bg-muted/30 rounded-xl p-3">
                  <p className="text-2xl font-black text-foreground">{val}</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live progress bar */}
        {job && (
          <div className="mt-6">
            <ProgressBar job={job} />
          </div>
        )}

        {/* Error */}
        {job?.status === "FAILED" && job.errorMessage && (
          <div className="mt-4 flex gap-3 items-start p-4 rounded-2xl bg-destructive/10 border border-destructive/25 text-destructive text-sm">
            <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{job.errorMessage}</span>
          </div>
        )}
      </div>

      {/* ── Chapters list ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Chapters ({chapters?.length ?? 0})
        </h3>

        {chaptersLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-card/50 rounded-[1.5rem] border border-border/40 animate-pulse"
              />
            ))}
          </div>
        ) : (chapters ?? []).length === 0 ? (
          <div className="bg-card/60 rounded-[2rem] border border-dashed border-border/60 p-12 text-center">
            <p className="text-muted-foreground font-medium">
              {job?.status === "PROCESSING" || job?.status === "PENDING"
                ? "Chapters will appear as Gemini extracts them…"
                : "No chapters found yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {(chapters ?? []).map((ch: any) => (
              <Link
                key={ch.id}
                href={`/books/${bookId}/chapters/${ch.id}`}
                className="group flex items-center gap-5 bg-card/80 backdrop-blur-xl rounded-[1.75rem] border border-border/60 px-6 py-5 transition-all duration-200 hover:border-primary/40 hover:shadow-medium hover:bg-card"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Hash className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground truncate">
                    {ch.chapterName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Chapter {ch.chapterNo}
                    {ch.pageStart &&
                      ` · Pages ${ch.pageStart}–${ch.pageEnd ?? ch.pageStart}`}
                    {" · "}
                    <span className="font-semibold text-primary">
                      {ch._count?.blocks ?? 0}
                    </span>{" "}
                    blocks
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
