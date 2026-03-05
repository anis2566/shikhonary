"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Trash2,
  ChevronRight,
  Search,
  FileText,
  BarChart3,
  Images,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { useBooks, useDeleteBook } from "@workspace/api-client";

// ── Job Status Badge ──────────────────────────────────────────────────────────
function JobBadge({ status }: { status?: string }) {
  if (!status)
    return (
      <Badge variant="secondary" className="text-[10px]">
        No Job
      </Badge>
    );

  const map: Record<
    string,
    { label: string; icon: React.ElementType; cls: string }
  > = {
    COMPLETED: {
      label: "Completed",
      icon: CheckCircle2,
      cls: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    },
    PROCESSING: {
      label: "Processing",
      icon: Loader2,
      cls: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    },
    PENDING: {
      label: "Pending",
      icon: Clock,
      cls: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
    FAILED: {
      label: "Failed",
      icon: XCircle,
      cls: "bg-destructive/15 text-destructive border-destructive/30",
    },
  };

  const cfg = (map[status] ?? map["PENDING"])!;
  const Icon = cfg.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full border",
        cfg.cls,
      )}
    >
      <Icon
        className={cn("w-3 h-3", status === "PROCESSING" && "animate-spin")}
      />
      {cfg.label}
    </span>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function IngestionProgress({ job }: { job: any }) {
  if (!job || job.status !== "PROCESSING") return null;
  const total = job.totalPages ?? 1;
  const done = job.processedPages ?? 0;
  const pct = Math.min(Math.round((done / total) * 100), 99);

  return (
    <div className="mt-3 space-y-1">
      <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
        <span>
          {done}/{total} pages
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Book Card ─────────────────────────────────────────────────────────────────
function BookCard({ book }: { book: any }) {
  const { mutate: deleteBook, isPending: isDeleting } = useDeleteBook();
  const job = book.ingestionJob;

  return (
    <div className="group bg-card/80 backdrop-blur-xl rounded-[2rem] border border-border/60 p-6 transition-all duration-300 hover:shadow-large hover:border-primary/30 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-foreground text-lg leading-tight line-clamp-2">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground font-semibold">
            Class {book.classLevel} · {book.version}
          </p>
        </div>
        <JobBadge status={job?.status} />
      </div>

      {/* Progress (only while PROCESSING) */}
      <IngestionProgress job={job} />

      {/* Stats row */}
      {job?.status === "COMPLETED" && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: BookOpen, label: "Chapters", val: job.chaptersFound },
            { icon: FileText, label: "Blocks", val: job.blocksExtracted },
            { icon: Images, label: "Figures", val: job.figuresCropped },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="bg-muted/30 rounded-xl p-3 text-center">
              <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="text-xs font-black text-foreground">{val ?? 0}</p>
              <p className="text-[9px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {job?.status === "FAILED" && job.errorMessage && (
        <p className="text-xs text-destructive bg-destructive/10 rounded-xl px-3 py-2 border border-destructive/25 line-clamp-2">
          {job.errorMessage}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Link href={`/books/${book.id}`} className="flex-1">
          <Button
            variant="outline"
            className="w-full h-9 rounded-xl text-xs font-semibold gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            View Chapters
            <ChevronRight className="w-3.5 h-3.5 ml-auto" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          disabled={isDeleting}
          onClick={() => deleteBook({ id: book.id })}
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────
function StatsBar({ items }: { items: any[] }) {
  const total = items.length;
  const completed = items.filter(
    (b) => b.ingestionJob?.status === "COMPLETED",
  ).length;
  const processing = items.filter(
    (b) =>
      b.ingestionJob?.status === "PROCESSING" ||
      b.ingestionJob?.status === "PENDING",
  ).length;
  const failed = items.filter(
    (b) => b.ingestionJob?.status === "FAILED",
  ).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Total Books", val: total, color: "text-foreground" },
        { label: "Completed", val: completed, color: "text-emerald-500" },
        { label: "Processing", val: processing, color: "text-blue-400" },
        { label: "Failed", val: failed, color: "text-destructive" },
      ].map(({ label, val, color }) => (
        <div
          key={label}
          className="bg-card/80 backdrop-blur-xl rounded-[2rem] border border-border/60 p-6 text-center"
        >
          <p className={cn("text-4xl font-black tracking-tighter", color)}>
            {val}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Main View ─────────────────────────────────────────────────────────────────
export const BooksListView = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useBooks({ search: search || undefined });
  const items: any[] = data?.items ?? [];

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Stats */}
      <StatsBar items={items} />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search books…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-muted/30 border-border/40"
          />
        </div>
        <Link href="/books/new">
          <Button className="gradient-primary shadow-glow h-11 rounded-xl px-5 font-semibold gap-2">
            <Upload className="w-4 h-4" />
            Upload PDF
          </Button>
        </Link>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-card/50 rounded-[2rem] border border-border/40 h-56 animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-card/80 rounded-[3rem] border border-dashed border-border/60 p-20 text-center">
          <div className="size-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
            <BookOpen className="w-10 h-10 text-primary/60" />
          </div>
          <h3 className="text-3xl font-black text-foreground">No Books Yet</h3>
          <p className="text-muted-foreground mt-3 mb-8">
            Upload your first NCTB PDF to get started.
          </p>
          <Link href="/books/new">
            <Button className="gradient-primary shadow-glow rounded-2xl h-12 px-8 font-bold gap-2">
              <Upload className="w-4 h-4" />
              Upload PDF
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};
