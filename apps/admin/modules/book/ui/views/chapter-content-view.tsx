"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Loader2,
  XCircle,
  Pencil,
  Trash2,
  Check,
  X,
  ChevronDown,
  FileText,
  Type,
  Image as ImageIcon,
  Table2,
  FunctionSquare,
  Heading1,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";
import {
  useChapterById,
  useUpdateContentBlock,
  useDeleteContentBlock,
  useUpdateBlockMedia,
  useDeleteBlockMedia,
} from "@workspace/api-client";

// ── Block type meta ───────────────────────────────────────────────────────────
const BLOCK_META: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  heading: { label: "Heading", icon: Heading1, color: "text-purple-400" },
  paragraph: { label: "Paragraph", icon: Type, color: "text-blue-400" },
  figure: { label: "Figure", icon: ImageIcon, color: "text-emerald-400" },
  formula: { label: "Formula", icon: FunctionSquare, color: "text-amber-400" },
  table: { label: "Table", icon: Table2, color: "text-pink-400" },
};

// ── Inline editable text area ─────────────────────────────────────────────────
function EditableText({
  value,
  onSave,
  placeholder,
  rows = 3,
}: {
  value?: string | null;
  onSave: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  if (!editing) {
    return (
      <div
        className="group relative cursor-pointer"
        onClick={() => {
          setDraft(value ?? "");
          setEditing(true);
        }}
      >
        <p
          className={cn(
            "text-sm leading-relaxed pr-8",
            !value && "text-muted-foreground/50 italic",
          )}
        >
          {value || placeholder || "Click to edit…"}
        </p>
        <Pencil className="absolute top-0 right-0 w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={rows}
        className="text-sm bg-muted/30 border-primary/40 resize-none rounded-xl"
        autoFocus
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          className="h-7 text-xs rounded-lg px-3 gap-1"
          onClick={() => {
            onSave(draft);
            setEditing(false);
          }}
        >
          <Check className="w-3 h-3" /> Save
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs rounded-lg px-3 gap-1"
          onClick={() => setEditing(false)}
        >
          <X className="w-3 h-3" /> Cancel
        </Button>
      </div>
    </div>
  );
}

// ── Single Media Image ────────────────────────────────────────────────────────
function MediaItem({ media }: { media: any }) {
  const { mutate: updateMedia } = useUpdateBlockMedia();
  const { mutate: deleteMedia, isPending } = useDeleteBlockMedia();

  return (
    <div className="bg-muted/20 rounded-xl border border-border/40 p-3 space-y-2">
      {/* Image */}
      <div className="relative rounded-lg overflow-hidden bg-muted/40 aspect-[4/3]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api${media.mediaPath}`}
          alt={media.altText ?? "Figure"}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Caption */}
      <EditableText
        value={media.caption}
        placeholder="Add caption…"
        rows={1}
        onSave={(caption) => updateMedia({ mediaId: media.id, caption })}
      />

      {/* Alt text (Gemini description) */}
      {media.altText && (
        <p className="text-[10px] text-muted-foreground/70 italic line-clamp-2">
          {media.altText}
        </p>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="h-6 text-[10px] text-destructive hover:bg-destructive/10 rounded-lg px-2 w-full"
        disabled={isPending}
        onClick={() => deleteMedia({ mediaId: media.id })}
      >
        <Trash2 className="w-3 h-3 mr-1" />
        Remove
      </Button>
    </div>
  );
}

// ── Content Block Card ────────────────────────────────────────────────────────
function BlockCard({ block }: { block: any }) {
  const [open, setOpen] = useState(true);
  const { mutate: updateBlock } = useUpdateContentBlock();
  const { mutate: deleteBlock, isPending: isDeleting } =
    useDeleteContentBlock();

  const meta = (BLOCK_META[block.type] ?? BLOCK_META["paragraph"])!;
  const Icon = meta.icon;

  return (
    <div className="bg-card/80 backdrop-blur-xl rounded-[1.75rem] border border-border/60 overflow-hidden transition-all duration-200 hover:border-primary/20">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-3 cursor-pointer select-none"
        onClick={() => setOpen((o) => !o)}
      >
        <div
          className={cn(
            "w-7 h-7 rounded-lg bg-current/10 flex items-center justify-center flex-shrink-0",
            meta.color,
          )}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span
          className={cn(
            "text-xs font-bold uppercase tracking-wider",
            meta.color,
          )}
        >
          {meta.label}
        </span>
        <span className="text-xs text-muted-foreground ml-auto mr-2">
          p.{block.pageNumber}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-lg text-destructive hover:bg-destructive/10 flex-shrink-0"
          disabled={isDeleting}
          onClick={(e) => {
            e.stopPropagation();
            deleteBlock({ id: block.id });
          }}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </div>

      {/* Body */}
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-border/40 pt-4">
          {/* Raw Text */}
          {block.type !== "figure" && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Text
              </p>
              <EditableText
                value={block.rawText}
                placeholder="No text extracted — click to add"
                rows={block.type === "heading" ? 1 : 4}
                onSave={(rawText) => updateBlock({ id: block.id, rawText })}
              />
            </div>
          )}

          {/* AI Description */}
          {block.aiDescription && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                AI Description
              </p>
              <EditableText
                value={block.aiDescription}
                rows={3}
                onSave={(aiDescription) =>
                  updateBlock({ id: block.id, aiDescription })
                }
              />
            </div>
          )}

          {/* Figure images — horizontal strip */}
          {block.media && block.media.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Images ({block.media.length})
              </p>
              <div
                className={cn(
                  "grid gap-3",
                  block.media.length === 1 ? "grid-cols-1" : "grid-cols-2",
                )}
              >
                {block.media.map((m: any) => (
                  <MediaItem key={m.id} media={m} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Chapter Content View (main export) ────────────────────────────────────────
export const ChapterContentView = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { data: chapter, isLoading } = useChapterById(chapterId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <XCircle className="w-12 h-12 text-destructive" />
        <p className="text-lg font-semibold text-foreground">
          Chapter not found
        </p>
      </div>
    );
  }

  const blocks: any[] = chapter.blocks ?? [];

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Chapter meta bar */}
      <div className="bg-card/80 backdrop-blur-xl rounded-[2rem] border border-border/60 px-8 py-6 flex flex-wrap items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-black text-foreground">
            {chapter.chapterName}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Chapter {chapter.chapterNo}
            {chapter.pageStart &&
              ` · Pages ${chapter.pageStart}–${chapter.pageEnd ?? chapter.pageStart}`}
          </p>
        </div>
        <div className="flex gap-3 text-center">
          <div className="bg-muted/30 rounded-xl px-4 py-2">
            <p className="text-lg font-black text-foreground">
              {blocks.length}
            </p>
            <p className="text-[9px] text-muted-foreground">Blocks</p>
          </div>
          <div className="bg-muted/30 rounded-xl px-4 py-2">
            <p className="text-lg font-black text-foreground">
              {blocks.filter((b) => b.type === "figure").length}
            </p>
            <p className="text-[9px] text-muted-foreground">Figures</p>
          </div>
        </div>
      </div>

      {/* Blocks */}
      {blocks.length === 0 ? (
        <div className="bg-card/60 rounded-[2rem] border border-dashed border-border/60 p-16 text-center">
          <p className="text-muted-foreground">
            No content blocks found for this chapter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block) => (
            <BlockCard key={block.id} block={block} />
          ))}
        </div>
      )}
    </div>
  );
};
