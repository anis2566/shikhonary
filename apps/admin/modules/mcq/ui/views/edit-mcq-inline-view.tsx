"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  Save,
  X,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Switch } from "@workspace/ui/components/switch";
import { Badge } from "@workspace/ui/components/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { parseMathString } from "@/lib/katex";

import { useMCQs, useUpdateMCQ } from "@workspace/api-client";
import { MCQFormValues } from "@workspace/schema";
import { MCQ_TYPE, mcqTypeOptions } from "@workspace/utils/constants";

import { McqListStat } from "../components/stat-card";
import { Filter } from "../components/filter";
import { Pagination } from "../components/pagination";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EditableMcq extends MCQFormValues {
  id: string;
  _isDirty: boolean;
  _isValid: boolean;
  _errors: string[];
}

/** Minimal shape we need from the server MCQ list items. */
interface RawMcq {
  id: string;
  [key: string]: unknown;
}

const MCQ_TYPE_OPTIONS = mcqTypeOptions.map((o) => ({
  value: o.value,
  label: o.label,
}));

// ─── Validation ───────────────────────────────────────────────────────────────

function validateMcq(mcq: Partial<MCQFormValues>): string[] {
  const errors: string[] = [];
  if (!mcq.question?.trim()) errors.push("Question is required");
  if (!mcq.options || mcq.options.length < 4)
    errors.push("At least 4 options required");
  if (mcq.statements && mcq.statements.length > 0 && mcq.statements.length < 3)
    errors.push("At least 3 statements required if using statements");
  if (!mcq.answer?.trim()) errors.push("Answer is required");
  if (!mcq.type) errors.push("Type is required");
  if (!mcq.session || mcq.session < 1900)
    errors.push("Valid session year required");
  return errors;
}

function buildEditable(raw: RawMcq): EditableMcq {
  const base: EditableMcq = {
    id: raw.id as string,
    question: (raw.question as string) ?? "",
    answer: (raw.answer as string) ?? "",
    chapterId: (raw.chapterId as string) ?? "",
    subjectId: (raw.subjectId as string) ?? "",
    topicId: (raw.topicId as string) || undefined,
    subTopicId: (raw.subTopicId as string) || undefined,
    options: (raw.options as string[]) ?? [],
    type: (raw.type as MCQ_TYPE) ?? MCQ_TYPE.SINGLE,
    isMath: (raw.isMath as boolean) ?? false,
    reference: (raw.reference as string[]) ?? [],
    explanation: (raw.explanation as string) ?? "",
    context: (raw.context as string) ?? "",
    statements: (raw.statements as string[]) ?? [],
    session: (raw.session as number) ?? new Date().getFullYear(),
    source: (raw.source as string) ?? "",
    _isDirty: false,
    _isValid: true,
    _errors: [],
  };
  return base;
}

// ─── Editable Field ───────────────────────────────────────────────────────────

interface EditableFieldProps {
  value: string;
  onSave: (v: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  renderDisplay?: (v: string) => React.ReactNode;
  disabled?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  multiline,
  className,
  placeholder,
  renderDisplay,
  disabled,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  // Store the previous `value` prop in state so we can compare during render.
  // This is the React-recommended pattern for adjusting state when a prop changes
  // without using an effect or a ref (both of which trigger linter errors here).
  const [prevValue, setPrevValue] = useState(value);

  if (!editing && prevValue !== value) {
    setPrevValue(value);
    setDraft(value);
  }

  const startEditing = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.stopPropagation();
      setDraft(value);
      setEditing(true);
    },
    [value, disabled],
  );

  const commit = useCallback(() => {
    setEditing(false);
    if (draft !== value) onSave(draft);
  }, [draft, value, onSave]);

  const cancel = useCallback(() => {
    setEditing(false);
    setDraft(value);
  }, [value]);

  if (editing) {
    if (multiline) {
      return (
        <Textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Escape") cancel();
          }}
          rows={3}
          className={cn(
            "text-sm resize-y bg-background/70 border-primary/30 rounded-xl",
            className,
          )}
        />
      );
    }
    return (
      <Input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") cancel();
        }}
        className={cn(
          "h-8 text-sm bg-background/70 border-primary/30 rounded-xl",
          className,
        )}
      />
    );
  }

  const isEmpty = !value || value.trim() === "";
  return (
    <div
      onDoubleClick={startEditing}
      role="button"
      tabIndex={disabled ? -1 : 0}
      title={disabled ? undefined : "Double-click to edit"}
      className={cn(
        "rounded-lg px-2 py-1 min-h-[28px] transition-colors border border-transparent",
        !disabled &&
        "cursor-pointer hover:bg-primary/5 hover:border-primary/20",
        isEmpty && "text-muted-foreground/50 italic",
        className,
      )}
    >
      <div className="pointer-events-none">
        {renderDisplay
          ? renderDisplay(value)
          : isEmpty
            ? placeholder || "Double-click to edit…"
            : value}
      </div>
    </div>
  );
};

// ─── Inline Edit Card ─────────────────────────────────────────────────────────

interface InlineMcqCardProps {
  mcq: EditableMcq;
  index: number;
  isSaving: boolean;
  onUpdate: (id: string, updates: Partial<EditableMcq>) => void;
  onSave: (id: string) => void;
  onDiscard: (id: string) => void;
}

const InlineMcqCard: React.FC<InlineMcqCardProps> = ({
  mcq,
  index,
  isSaving,
  onUpdate,
  onSave,
  onDiscard,
}) => {
  const update = (updates: Partial<EditableMcq>) => onUpdate(mcq.id, updates);

  const updateOption = (i: number, v: string) => {
    const opts = [...mcq.options];
    opts[i] = v;
    update({ options: opts });
  };

  const removeOption = (i: number) => {
    if (mcq.options.length <= 2) return;
    update({ options: mcq.options.filter((_, idx) => idx !== i) });
  };

  const updateStatement = (i: number, v: string) => {
    const stmts = [...(mcq.statements ?? [])];
    stmts[i] = v;
    update({ statements: stmts });
  };

  return (
    <div
      className={cn(
        "rounded-[2rem] border bg-card/80 backdrop-blur-2xl overflow-hidden transition-all duration-300",
        mcq._isDirty
          ? mcq._isValid
            ? "border-primary/40 shadow-medium ring-1 ring-primary/10"
            : "border-destructive/40 bg-destructive/5 shadow-soft ring-1 ring-destructive/10"
          : "border-border/60 shadow-soft hover:shadow-medium hover:border-border/80",
      )}
    >
      {/* Header strip */}
      <div
        className={cn(
          "px-6 py-3 flex items-center justify-between border-b gap-3 flex-wrap",
          mcq._isDirty
            ? mcq._isValid
              ? "border-primary/20 bg-primary/5"
              : "border-destructive/20 bg-destructive/10"
            : "border-border/40 bg-muted/30",
        )}
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-black text-muted-foreground w-7">
            #{index + 1}
          </span>

          {mcq._isDirty ? (
            mcq._isValid ? (
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            )
          ) : null}

          {mcq._isDirty && (
            <Badge
              variant="outline"
              className="text-[9px] h-5 px-2 font-bold border-amber-400/40 text-amber-600 bg-amber-50/50 dark:bg-amber-900/20"
            >
              Unsaved
            </Badge>
          )}

          {/* Type selector */}
          <Select
            value={mcq.type}
            onValueChange={(v) => update({ type: v as MCQ_TYPE })}
            disabled={isSaving}
          >
            <SelectTrigger className="h-7 w-auto text-xs gap-1 px-2.5 rounded-lg border-border/50 bg-background/50 font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
              {MCQ_TYPE_OPTIONS.map((t) => (
                <SelectItem
                  key={t.value}
                  value={t.value}
                  className="text-xs font-medium rounded-lg"
                >
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Badge variant="outline" className="text-[10px] h-5 font-bold">
            {mcq.session}
          </Badge>

          {mcq.isMath && (
            <Badge className="bg-amber-500/20 text-amber-600 border-amber-400/30 text-[10px] h-5 font-bold">
              Math
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Math toggle */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-muted-foreground">
              Math
            </span>
            <Switch
              checked={mcq.isMath}
              onCheckedChange={(v) => update({ isMath: v })}
              disabled={isSaving}
              className="scale-75 data-[state=checked]:bg-amber-500"
            />
          </div>

          {/* Per-card save / discard */}
          {mcq._isDirty && (
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDiscard(mcq.id)}
                disabled={isSaving}
                className="h-7 px-3 text-xs rounded-xl text-muted-foreground hover:text-foreground font-semibold"
              >
                Discard
              </Button>
              <Button
                size="sm"
                onClick={() => onSave(mcq.id)}
                disabled={!mcq._isValid || isSaving}
                className="h-7 px-3 text-xs rounded-xl bg-primary text-primary-foreground font-bold shadow-glow hover:scale-[1.03] active:scale-[0.97] transition-all"
              >
                {isSaving ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Save className="h-3 w-3 mr-1 stroke-[3]" />
                )}
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Validation errors */}
        {mcq._errors.length > 0 && (
          <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-xl p-3">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-destructive font-semibold">
              {mcq._errors.join(" · ")}
            </p>
          </div>
        )}

        {/* Context */}
        {mcq.context !== undefined && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Context
            </label>
            <EditableField
              value={mcq.context ?? ""}
              onSave={(v) => update({ context: v })}
              multiline
              disabled={isSaving}
              placeholder="No context — double-click to add"
              renderDisplay={(v) =>
                v ? (
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 rounded-xl p-3 leading-relaxed">
                    {mcq.isMath ? parseMathString(v) : v}
                  </div>
                ) : null
              }
            />
          </div>
        )}

        {/* Question */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
            Question *
          </label>
          <EditableField
            value={mcq.question}
            onSave={(v) => update({ question: v })}
            multiline
            disabled={isSaving}
            placeholder="Double-click to edit question…"
            renderDisplay={(v) => (
              <div className="text-sm font-semibold whitespace-pre-wrap leading-relaxed text-foreground">
                {v
                  ? mcq.isMath
                    ? parseMathString(v)
                    : v
                  : "Untitled question"}
              </div>
            )}
          />
        </div>

        {/* Statements */}
        {(mcq.statements ?? []).length > 0 && (
          <div
            className={cn(
              "space-y-2 p-3 rounded-2xl transition-all",
              (mcq.statements ?? []).length < 3 &&
              "bg-destructive/5 border border-destructive/20",
            )}
          >
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center justify-between">
              Statements
              {(mcq.statements ?? []).length < 3 && (
                <span className="text-destructive animate-pulse">
                  Min 3 required
                </span>
              )}
            </label>
            <div className="space-y-1.5 pl-1">
              {(mcq.statements ?? []).map((stmt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs font-black text-muted-foreground/50 w-5 text-right shrink-0">
                    {i + 1}.
                  </span>
                  <EditableField
                    value={stmt}
                    onSave={(v) => updateStatement(i, v)}
                    disabled={isSaving}
                    className="flex-1 text-sm"
                    renderDisplay={(v) => (
                      <span className="text-sm">
                        {v
                          ? mcq.isMath
                            ? parseMathString(v)
                            : v
                          : `Statement ${i + 1}`}
                      </span>
                    )}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() =>
                      update({
                        statements: (mcq.statements ?? []).filter(
                          (_, si) => si !== i,
                        ),
                      })
                    }
                    disabled={isSaving}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Options */}
        <div
          className={cn(
            "space-y-2 p-3 rounded-2xl transition-all",
            mcq.options.length < 4 &&
            "bg-destructive/5 border border-destructive/20",
          )}
        >
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center justify-between">
            Options * (click letter to set correct answer)
            {mcq.options.length < 4 && (
              <span className="text-destructive animate-pulse">
                Min 4 required
              </span>
            )}
          </label>
          <div className="space-y-1.5 pl-1">
            {mcq.options.map((opt, i) => {
              const isCorrect = mcq.answer === opt;
              return (
                <div key={i} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => update({ answer: opt })}
                    disabled={isSaving}
                    className={cn(
                      "h-6 w-6 rounded-full text-xs font-black flex items-center justify-center border-2 transition-all shrink-0",
                      isCorrect
                        ? "bg-primary border-primary text-primary-foreground scale-110"
                        : "border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary",
                    )}
                  >
                    {String.fromCharCode(65 + i)}
                  </button>
                  <EditableField
                    value={opt}
                    onSave={(v) => updateOption(i, v)}
                    disabled={isSaving}
                    className={cn(
                      "flex-1 text-sm",
                      isCorrect && "text-primary font-semibold",
                    )}
                    renderDisplay={(v) => (
                      <span
                        className={cn(
                          "text-sm",
                          isCorrect && "text-primary font-semibold",
                        )}
                      >
                        {v
                          ? mcq.isMath
                            ? parseMathString(v)
                            : v
                          : `Option ${String.fromCharCode(65 + i)}`}
                      </span>
                    )}
                  />
                  {mcq.options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeOption(i)}
                      disabled={isSaving}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add buttons */}
          <div className="flex items-center gap-2 pt-1 pl-8">
            {mcq.options.length < 6 && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[10px] px-2 rounded-lg border-border/50 font-bold"
                onClick={() => update({ options: [...mcq.options, ""] })}
                disabled={isSaving}
              >
                <Plus className="h-3 w-3 mr-1" /> Option
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[10px] px-2 rounded-lg border-border/50 font-bold"
              onClick={() =>
                update({ statements: [...(mcq.statements ?? []), ""] })
              }
              disabled={isSaving}
            >
              <Plus className="h-3 w-3 mr-1" /> Statement
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[10px] px-2 rounded-lg border-border/50 font-bold"
              onClick={() =>
                update({ reference: [...(mcq.reference ?? []), ""] })
              }
              disabled={isSaving}
            >
              <Plus className="h-3 w-3 mr-1" /> Reference
            </Button>
            <span className="text-[10px] text-muted-foreground/50 font-medium ml-auto">
              Double-click any field to edit
            </span>
          </div>
        </div>

        {/* Correct Answer */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
            Correct Answer *
          </label>
          <EditableField
            value={mcq.answer}
            onSave={(v) => update({ answer: v })}
            disabled={isSaving}
            placeholder="Click an option letter or double-click to type"
            renderDisplay={(v) =>
              v ? (
                <span className="text-sm font-semibold text-primary">
                  {mcq.isMath ? parseMathString(v) : v}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground/50 italic">
                  Not set — click an option letter or double-click here
                </span>
              )
            }
          />
        </div>

        {/* Explanation */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
            Explanation
          </label>
          <EditableField
            value={mcq.explanation ?? ""}
            onSave={(v) => update({ explanation: v })}
            multiline
            disabled={isSaving}
            placeholder="No explanation — double-click to add"
            renderDisplay={(v) =>
              v ? (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {v}
                </p>
              ) : null
            }
          />
        </div>

        {/* References */}
        {(mcq.reference ?? []).length > 0 && (
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              References
            </label>
            <div className="flex flex-wrap gap-2 pl-1">
              {(mcq.reference ?? []).map((ref, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 bg-primary/5 border border-primary/20 rounded-xl pl-2 pr-1 py-0.5"
                >
                  <EditableField
                    value={ref}
                    onSave={(v) => {
                      const refs = [...(mcq.reference ?? [])];
                      refs[i] = v;
                      update({ reference: refs });
                    }}
                    disabled={isSaving}
                    className="h-6 min-h-0 py-0 px-2 text-[11px] border-none hover:bg-transparent"
                    placeholder="Reference…"
                    renderDisplay={(v) => (
                      <span className="text-[11px] font-semibold text-primary">
                        {v || "New Reference"}
                      </span>
                    )}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 shrink-0 rounded-lg text-primary/60 hover:text-destructive hover:bg-destructive/10"
                    onClick={() =>
                      update({
                        reference: (mcq.reference ?? []).filter(
                          (_, ri) => ri !== i,
                        ),
                      })
                    }
                    disabled={isSaving}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session + Source */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1 border-t border-border/30">
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-muted-foreground/60">Session:</span>
            <EditableField
              value={String(mcq.session)}
              onSave={(v) =>
                update({ session: parseInt(v, 10) || mcq.session })
              }
              disabled={isSaving}
              renderDisplay={(v) => (
                <span className="font-semibold text-foreground">{v}</span>
              )}
            />
          </span>
          {mcq.source !== undefined && (
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-muted-foreground/60">
                Source:
              </span>
              <EditableField
                value={mcq.source ?? ""}
                onSave={(v) => update({ source: v })}
                disabled={isSaving}
                placeholder="Add source…"
                renderDisplay={(v) => (
                  <span className="font-semibold text-foreground">
                    {v || "—"}
                  </span>
                )}
              />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main View ────────────────────────────────────────────────────────────────

export const EditMcqInlineView: React.FC = () => {
  const { data: mcqsData } = useMCQs();
  const { mutateAsync: updateMCQ, isPending: isSaving } = useUpdateMCQ();

  // Local state: map of id → EditableMcq (only for dirty cards)
  const [localEdits, setLocalEdits] = useState<Record<string, EditableMcq>>({});
  // Keep a snapshot of the server data per id so we can discard
  const serverSnapshot = useRef<Record<string, EditableMcq>>({});

  const mcqs = mcqsData?.items ?? [];
  const total = mcqsData?.meta?.total ?? 0;

  // Sync server data into snapshot when it arrives / page changes
  // (only for items not currently dirty)
  useEffect(() => {
    if (!mcqs.length) return;
    mcqs.forEach((raw: RawMcq) => {
      if (!localEdits[raw.id]) {
        const editable = buildEditable(raw);
        serverSnapshot.current[raw.id] = editable;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mcqs]);

  // Resolve: if there's a local edit for this MCQ, show that; else build from server
  const resolve = (raw: RawMcq): EditableMcq =>
    localEdits[raw.id] ?? serverSnapshot.current[raw.id] ?? buildEditable(raw);

  const handleUpdate = useCallback(
    (id: string, updates: Partial<EditableMcq>) => {
      setLocalEdits((prev) => {
        const base = prev[id] ?? serverSnapshot.current[id];
        if (!base) return prev;
        const updated = { ...base, ...updates };
        const errors = validateMcq(updated);
        return {
          ...prev,
          [id]: {
            ...updated,
            _isDirty: true,
            _isValid: errors.length === 0,
            _errors: errors,
          },
        };
      });
    },
    [],
  );

  const handleDiscard = useCallback((id: string) => {
    setLocalEdits((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const handleSave = useCallback(
    async (id: string) => {
      const mcq = localEdits[id];
      if (!mcq || !mcq._isValid) return;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, _isDirty, _isValid, _errors, ...data } = mcq;
      try {
        await updateMCQ({ id, data: data as MCQFormValues });
        // After save: update snapshot and clear dirty state
        serverSnapshot.current[id] = { ...mcq, _isDirty: false };
        setLocalEdits((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      } catch {
        // toast handled in hook onError
      }
    },
    [localEdits, updateMCQ],
  );

  const dirtyCount = Object.keys(localEdits).length;

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-10 text-foreground animate-in fade-in duration-700">
      {/* Stats */}
      <McqListStat />

      <div className="flex flex-col gap-10">
        {/* Filter */}
        <div className="space-y-4">
          <Filter
            setSelectedIds={(_) => {
              /* selection not used in inline-edit mode */
            }}
            isLoading={isSaving}
          />

          {/* Dirty‑count indicator */}
          {dirtyCount > 0 && (
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-400/30">
              <Badge
                variant="outline"
                className="border-amber-400/40 text-amber-600 bg-amber-50/50 dark:bg-amber-900/20 font-bold text-xs"
              >
                {dirtyCount} unsaved
              </Badge>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                You have unsaved changes on {dirtyCount} MCQ
                {dirtyCount !== 1 ? "s" : ""}. Save or discard each card
                individually.
              </p>
            </div>
          )}
        </div>

        {/* Cards */}
        {mcqs.length === 0 ? (
          <div className="bg-card/80 backdrop-blur-2xl rounded-[3rem] border border-dashed border-border/60 p-20 text-center shadow-medium transition-all duration-500 hover:border-primary/30">
            <div className="size-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-primary/10 shadow-inner group transition-transform duration-500 hover:rotate-12">
              <span className="text-5xl group-hover:scale-110 transition-transform cursor-default">
                🤔
              </span>
            </div>
            <h3 className="text-3xl font-black bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              No MCQs Found
            </h3>
            <p className="text-base text-muted-foreground/80 mt-3 max-w-sm mx-auto font-medium leading-relaxed">
              We couldn&apos;t find any MCQs matching your criteria. Try
              adjusting the filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mcqs.map((raw: RawMcq, index: number) => {
              const mcq = resolve(raw);
              return (
                <InlineMcqCard
                  key={mcq.id}
                  mcq={mcq}
                  index={index}
                  isSaving={isSaving}
                  onUpdate={handleUpdate}
                  onSave={handleSave}
                  onDiscard={handleDiscard}
                />
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="pt-2">
          <Pagination totalItem={total} />
        </div>
      </div>
    </div>
  );
};
