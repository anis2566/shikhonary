"use client";

import * as React from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Award,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useQuestionTypesForSelection } from "@workspace/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MarkDistributionRow {
  id: string;
  questionTypeId: string;
  marksPerQuestion: number;
  questionCount: number;
  questionsToAttempt: number | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const makeRow = (questionTypeId?: string): MarkDistributionRow => ({
  id: crypto.randomUUID(),
  questionTypeId: questionTypeId || "",
  marksPerQuestion: 1,
  questionCount: 10,
  questionsToAttempt: null,
});

export const rowTotal = (r: MarkDistributionRow) =>
  r.marksPerQuestion * (r.questionsToAttempt ?? r.questionCount);

// ─── BreakdownTable ───────────────────────────────────────────────────────────

interface BreakdownTableProps {
  subjectId: string;
  initialRows?: MarkDistributionRow[];
  /** Stable ref the parent uses to read rows at submit time. */
  registryRef: React.MutableRefObject<Map<string, () => MarkDistributionRow[]>>;
  disabled?: boolean;
}

export const BreakdownTable = React.memo(
  ({ subjectId, initialRows, registryRef, disabled }: BreakdownTableProps) => {
    const [rows, setRows] = React.useState<MarkDistributionRow[]>(initialRows || []);
    const { data: qTypes } = useQuestionTypesForSelection(subjectId);

    // If initialRows arrive later (async fetch), sync them
    React.useEffect(() => {
      if (initialRows && initialRows.length > 0) {
        setRows(initialRows);
      }
    }, [initialRows]);

    // Keep registry up-to-date whenever rows change
    React.useLayoutEffect(() => {
      registryRef.current.set(subjectId, () => rows);
    }, [subjectId, rows, registryRef]);

    // Cleanup on unmount
    React.useEffect(() => {
      const registry = registryRef.current;
      return () => {
        registry.delete(subjectId);
      };
    }, [subjectId, registryRef]);

    const update = (id: string, patch: Partial<MarkDistributionRow>) =>
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      );

    const remove = (id: string) =>
      setRows((prev) => prev.filter((r) => r.id !== id));

    const add = () => {
      const firstValidType = qTypes?.[0]?.id || "";
      setRows((prev) => [...prev, makeRow(firstValidType)]);
    };

    const total = rows.reduce((s, r) => s + rowTotal(r), 0);

    return (
      <div className="space-y-3">
        {/* Column headers */}
        <div className="hidden md:grid grid-cols-[1.5rem_1fr_6rem_6rem_6rem_6rem_2.5rem] gap-2 px-3 py-1.5 rounded-lg bg-muted/40">
          <span />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Type
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">
            Marks/Q
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">
            # Qs
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">
            Attempt
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">
            Subtotal
          </span>
          <span />
        </div>

        {rows.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground italic rounded-xl border border-dashed border-border/50">
            No rows yet — click{" "}
            <span className="font-bold text-primary">Add Row</span> below.
          </div>
        )}

        {rows.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[1.5rem_1fr_6rem_6rem_6rem_6rem_2.5rem] gap-2 items-center px-3 py-2 rounded-xl bg-background/60 border border-border/40 hover:border-border/70 transition-colors group"
          >
            <GripVertical className="size-3.5 text-muted-foreground/30 cursor-grab" />

            {/* Type (Shadcn Select) */}
            <div className="flex flex-col gap-1 min-w-0">
              <Select
                value={row.questionTypeId}
                onValueChange={(val) =>
                  update(row.id, { questionTypeId: val })
                }
                disabled={disabled}
              >
                <SelectTrigger className="h-8 w-full rounded-lg border border-border/40 bg-background/50 px-2 text-xs font-bold text-foreground focus:ring-1 focus:ring-primary/30">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {qTypes?.map((t: { id: string; displayName: string }) => (
                    <SelectItem key={t.id} value={t.id} className="text-xs font-bold">
                      {t.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input
              type="number"
              min={0}
              step={0.5}
              value={row.marksPerQuestion}
              onChange={(e) =>
                update(row.id, { marksPerQuestion: Number(e.target.value) })
              }
              disabled={disabled}
              className="h-8 text-xs font-bold text-right bg-transparent border-border/40 rounded-lg px-2"
            />
            <Input
              type="number"
              min={0}
              value={row.questionCount}
              onChange={(e) =>
                update(row.id, { questionCount: Number(e.target.value) })
              }
              disabled={disabled}
              className="h-8 text-xs font-bold text-right bg-transparent border-border/40 rounded-lg px-2"
            />
            <Input
              type="number"
              min={0}
              placeholder="All"
              value={row.questionsToAttempt ?? ""}
              onChange={(e) =>
                update(row.id, {
                  questionsToAttempt: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
              disabled={disabled}
              className="h-8 text-xs font-bold text-right bg-transparent border-border/40 rounded-lg px-2 placeholder:text-muted-foreground/40"
            />

            <div className="text-right text-xs font-black text-primary tabular-nums">
              {rowTotal(row)}
            </div>

            <button
              type="button"
              onClick={() => remove(row.id)}
              disabled={disabled}
              className="flex items-center justify-center size-6 rounded-lg text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}

        <div className="flex items-center justify-between pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={add}
            disabled={disabled}
            className="h-7 px-3 text-xs font-bold rounded-lg border-dashed border-border/60 hover:border-primary/40 hover:bg-primary/5"
          >
            <Plus className="size-3 mr-1.5 stroke-[3]" />
            Add Row
          </Button>
          <div className="flex items-center gap-2 text-sm font-black">
            <Award className="size-4 text-primary" />
            <span className="text-muted-foreground font-medium">Total:</span>
            <span className="text-primary tabular-nums">{total} marks</span>
          </div>
        </div>
      </div>
    );
  },
);
BreakdownTable.displayName = "BreakdownTable";
