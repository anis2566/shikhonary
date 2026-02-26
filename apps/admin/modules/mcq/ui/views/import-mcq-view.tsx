"use client";

import React, { useCallback, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  FileJson,
  Layers,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@workspace/ui/components/sonner";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Switch } from "@workspace/ui/components/switch";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { parseMathString } from "@/lib/katex";

import {
  useBulkCreateMCQs,
  useAcademicSubjectsForSelection,
  useAcademicChaptersForSelection,
  useAcademicTopicsForSelection,
  useAcademicSubTopicsForSelection,
} from "@workspace/api-client";
import { MCQFormValues } from "@workspace/schema";
import { MCQ_TYPE, mcqTypeOptions } from "@workspace/utils/constants";

// ─── Types ──────────────────────────────────────────────────────────────────

interface SelectionItem {
  id: string;
  displayName: string;
}

interface ImportedMcq extends MCQFormValues {
  _tempId: string;
  _isValid: boolean;
  _errors: string[];
}

const SAMPLE_JSON = [
  {
    question: "Which of the following is a fundamental force in nature?",
    options: ["Friction", "Gravitational force", "Tension", "Normal force"],
    statements: [],
    answer: "Gravitational force",
    type: MCQ_TYPE.SINGLE,
    reference: ["NCERT Physics Class 11"],
    explanation:
      "Gravitational force is one of the four fundamental forces in nature.",
    isMath: false,
    session: 2024,
    source: "Board Exam 2024",
    context: "",
  },
  {
    question:
      "Assertion (A): An object moving in a circle at constant speed has acceleration.\nReason (R): Acceleration is the rate of change of velocity, which is a vector.",
    options: [
      "Both A and R are true and R is the correct explanation of A",
      "Both A and R are true but R is not the correct explanation of A",
      "A is true but R is false",
      "A is false but R is true",
    ],
    statements: [],
    answer: "Both A and R are true and R is the correct explanation of A",
    type: MCQ_TYPE.CONTEXTUAL,
    reference: ["Circular Motion Guide"],
    explanation:
      "In circular motion, the direction of velocity changes constantly causing centripetal acceleration.",
    isMath: false,
    session: 2023,
    source: "",
    context: "",
  },
];

const MCQ_TYPE_OPTIONS = mcqTypeOptions.map((o) => ({
  value: o.value,
  label: o.label,
}));

// ─── Validation ───────────────────────────────────────────────────────────────

function validateMcqEntry(mcq: Partial<MCQFormValues>): string[] {
  const errors: string[] = [];
  if (!mcq.question?.trim()) errors.push("Question is required");
  if (!mcq.options || mcq.options.length < 4)
    errors.push("At least 4 options required");
  if (mcq.statements && mcq.statements.length > 0 && mcq.statements.length < 3)
    errors.push("At least 3 statements required if using statements");
  if (!mcq.answer?.trim()) errors.push("Answer is required");
  if (!mcq.type) errors.push("Type is required");
  if (!mcq.subjectId?.trim()) errors.push("Subject is required");
  if (!mcq.chapterId?.trim()) errors.push("Chapter is required");
  if (!mcq.session || mcq.session < 1900)
    errors.push("Valid session year required");
  return errors;
}

// ─── Editable Field ───────────────────────────────────────────────────────────

interface EditableFieldProps {
  value: string;
  onSave: (v: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  renderDisplay?: (v: string) => React.ReactNode;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  multiline,
  className,
  placeholder,
  renderDisplay,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const startEditing = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setDraft(value);
      setEditing(true);
    },
    [value],
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
      tabIndex={0}
      title="Double-click to edit"
      className={cn(
        "cursor-pointer rounded-lg px-2 py-1 min-h-[28px]",
        "hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20",
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

// ─── MCQ Preview Card ─────────────────────────────────────────────────────────

interface McqCardProps {
  mcq: ImportedMcq;
  index: number;
  onUpdate: (tempId: string, updates: Partial<ImportedMcq>) => void;
  onRemove: (tempId: string) => void;
}

const McqPreviewCard: React.FC<McqCardProps> = ({
  mcq,
  index,
  onUpdate,
  onRemove,
}) => {
  const updateOption = (i: number, v: string) => {
    const opts = [...mcq.options];
    opts[i] = v;
    onUpdate(mcq._tempId, { options: opts });
  };

  const removeOption = (i: number) => {
    if (mcq.options.length <= 2) return;
    onUpdate(mcq._tempId, {
      options: mcq.options.filter((_, idx) => idx !== i),
    });
  };

  const updateStatement = (i: number, v: string) => {
    const stmts = [...(mcq.statements ?? [])];
    stmts[i] = v;
    onUpdate(mcq._tempId, { statements: stmts });
  };

  return (
    <div
      className={cn(
        "rounded-[2rem] border bg-card/80 backdrop-blur-2xl overflow-hidden transition-all duration-300",
        mcq._isValid
          ? "border-border/60 shadow-medium hover:shadow-large hover:border-primary/30"
          : "border-destructive/30 bg-destructive/5 shadow-soft",
      )}
    >
      {/* Card header strip */}
      <div
        className={cn(
          "px-6 py-4 flex items-center justify-between border-b",
          mcq._isValid
            ? "border-border/40 bg-primary/5"
            : "border-destructive/20 bg-destructive/10",
        )}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-black text-muted-foreground w-7">
            #{index + 1}
          </span>
          {mcq._isValid ? (
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
          )}

          {/* Type selector */}
          <Select
            value={mcq.type}
            onValueChange={(v) =>
              onUpdate(mcq._tempId, { type: v as MCQ_TYPE })
            }
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

        <div className="flex items-center gap-2">
          {/* isMath toggle */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-muted-foreground">
              Math
            </span>
            <Switch
              checked={mcq.isMath}
              onCheckedChange={(v) => onUpdate(mcq._tempId, { isMath: v })}
              className="scale-75 data-[state=checked]:bg-amber-500"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            onClick={() => onRemove(mcq._tempId)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
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
              onSave={(v) => onUpdate(mcq._tempId, { context: v })}
              multiline
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
            onSave={(v) => onUpdate(mcq._tempId, { question: v })}
            multiline
            placeholder="Click to write question…"
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
              "bg-destructive/5 border border-destructive/20 ring-1 ring-destructive/10",
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
                      onUpdate(mcq._tempId, {
                        statements: (mcq.statements ?? []).filter(
                          (_, si) => si !== i,
                        ),
                      })
                    }
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
            "bg-destructive/5 border border-destructive/20 ring-1 ring-destructive/10",
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
                    onClick={() => onUpdate(mcq._tempId, { answer: opt })}
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
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Option actions */}
          <div className="flex items-center gap-2 pt-1 pl-8">
            {mcq.options.length < 6 && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[10px] px-2 rounded-lg border-border/50 font-bold"
                onClick={() =>
                  onUpdate(mcq._tempId, { options: [...mcq.options, ""] })
                }
              >
                <Plus className="h-3 w-3 mr-1" /> Option
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[10px] px-2 rounded-lg border-border/50 font-bold"
              onClick={() =>
                onUpdate(mcq._tempId, {
                  statements: [...(mcq.statements ?? []), ""],
                })
              }
            >
              <Plus className="h-3 w-3 mr-1" /> Statement
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[10px] px-2 rounded-lg border-border/50 font-bold"
              onClick={() =>
                onUpdate(mcq._tempId, {
                  reference: [...(mcq.reference ?? []), ""],
                })
              }
            >
              <Plus className="h-3 w-3 mr-1" /> Reference
            </Button>
            <span className="text-[10px] text-muted-foreground/50 font-medium ml-auto">
              Double-click any field to edit
            </span>
          </div>
        </div>

        {/* Answer display */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
            Correct Answer *
          </label>
          <EditableField
            value={mcq.answer}
            onSave={(v) => onUpdate(mcq._tempId, { answer: v })}
            placeholder="Type or click an option letter above"
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
            onSave={(v) => onUpdate(mcq._tempId, { explanation: v })}
            multiline
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
                      onUpdate(mcq._tempId, { reference: refs });
                    }}
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
                    className="h-5 w-5 shrink-0 rounded-lg text-primary/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={() =>
                      onUpdate(mcq._tempId, {
                        reference: (mcq.reference ?? []).filter(
                          (_, ri) => ri !== i,
                        ),
                      })
                    }
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
                onUpdate(mcq._tempId, {
                  session: parseInt(v, 10) || mcq.session,
                })
              }
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
                onSave={(v) => onUpdate(mcq._tempId, { source: v })}
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

export const ImportMcqView: React.FC = () => {
  const router = useRouter();
  const { mutateAsync: bulkCreate, isPending: isSaving } = useBulkCreateMCQs();

  // ── JSON step ───────────────────────────────────────────────────────────────
  const [jsonInput, setJsonInput] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [step, setStep] = useState<"json" | "preview">("json");
  const [importedMcqs, setImportedMcqs] = useState<ImportedMcq[]>([]);

  // ── Global classification ───────────────────────────────────────────────────
  const [globalSubjectId, setGlobalSubjectId] = useState("");
  const [globalChapterId, setGlobalChapterId] = useState("");
  const [globalTopicId, setGlobalTopicId] = useState("");
  const [globalSubTopicId, setGlobalSubTopicId] = useState("");

  const { data: subjects } = useAcademicSubjectsForSelection();
  const { data: chapters } = useAcademicChaptersForSelection(
    globalSubjectId || undefined,
  );
  const { data: topics } = useAcademicTopicsForSelection(
    globalChapterId || undefined,
  );
  const { data: subTopics } = useAcademicSubTopicsForSelection(
    globalTopicId || undefined,
  );

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleLoadSample = () => {
    setJsonInput(JSON.stringify(SAMPLE_JSON, null, 2));
    toast.success("Sample JSON loaded");
  };

  const handleCopySchema = () => {
    const schema = {
      question: "string (required)",
      options: ["string (min 2)"],
      statements: ["string (optional)"],
      answer: "string — must match one of the option values (required)",
      type: "SINGLE | MULTIPLE | CONTEXTUAL (required)",
      reference: ["string (optional)"],
      explanation: "string (optional)",
      isMath: "boolean (default false)",
      session: "number e.g. 2024 (required)",
      source: "string (optional)",
      context: "string (optional)",
    };
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    toast.success("Schema copied to clipboard");
  };

  const buildEntry = (mcq: Record<string, unknown>): ImportedMcq => {
    // Safe helpers for extracting typed values from unknown JSON
    const str = (v: unknown, fallback = ""): string =>
      typeof v === "string" ? v : fallback;
    const strArr = (v: unknown, fallback: string[] = []): string[] =>
      Array.isArray(v) ? (v as string[]) : fallback;
    const bool = (v: unknown, fallback = false): boolean =>
      typeof v === "boolean" ? v : fallback;

    const entry: MCQFormValues = {
      question: str(mcq.question),
      options: strArr(mcq.options, ["", ""]),
      statements: strArr(mcq.statements),
      answer: str(mcq.answer),
      type: (str(mcq.type) as MCQ_TYPE) || MCQ_TYPE.SINGLE,
      reference: strArr(mcq.reference),
      explanation: str(mcq.explanation),
      isMath: bool(mcq.isMath),
      session: Number(mcq.session) || new Date().getFullYear(),
      source: str(mcq.source),
      context: str(mcq.context),
      subjectId: globalSubjectId,
      chapterId: globalChapterId,
      topicId: globalTopicId || "",
      subTopicId: globalSubTopicId || "",
    };
    const errors = validateMcqEntry(entry);
    return {
      ...entry,
      _tempId: `import-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      _isValid: errors.length === 0,
      _errors: errors,
    };
  };

  const handleImport = () => {
    if (!globalSubjectId || !globalChapterId) {
      toast.error("Please select Subject and Chapter first");
      return;
    }
    try {
      let parsed;
      try {
        parsed = JSON.parse(jsonInput);
      } catch (e) {
        // If regular JSON parse fails, attempt to fix common KaTeX issues
        // Users often paste single backslashes for math delimiters (e.g., \(, \))
        // We escape backslashes that aren't already part of a valid JSON escape
        // but carefully avoid \" to not break string boundaries.
        const sanitized = jsonInput.replace(/\\(?!")/g, "\\\\");
        parsed = JSON.parse(sanitized);
      }

      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const processed = arr.map(buildEntry);
      setImportedMcqs(processed);
      setStep("preview");
      const valid = processed.filter((m) => m._isValid).length;
      toast.success(
        `Parsed ${processed.length} MCQs — ${valid} valid, ${processed.length - valid} with issues`,
      );
    } catch (err: unknown) {
      setParseError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const updateMcq = (tempId: string, updates: Partial<ImportedMcq>) => {
    setImportedMcqs((prev) =>
      prev.map((m) => {
        if (m._tempId !== tempId) return m;
        const updated = { ...m, ...updates };
        const errors = validateMcqEntry(updated);
        return { ...updated, _isValid: errors.length === 0, _errors: errors };
      }),
    );
  };

  const removeMcq = (tempId: string) => {
    setImportedMcqs((prev) => prev.filter((m) => m._tempId !== tempId));
  };

  const handleSaveAll = async () => {
    const valid = importedMcqs.filter((m) => m._isValid);
    if (valid.length === 0) {
      toast.error("No valid MCQs to save");
      return;
    }
    const payload = valid.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ _tempId, _isValid, _errors, ...rest }) => rest,
    );
    try {
      await bulkCreate(payload);
      router.push("/mcqs");
    } catch {
      // toast handled in hook onError
    }
  };

  const validCount = importedMcqs.filter((m) => m._isValid).length;
  const invalidCount = importedMcqs.length - validCount;

  // ── JSON Step ───────────────────────────────────────────────────────────────

  if (step === "json") {
    return (
      <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6 animate-in fade-in duration-500">
        {/* Back */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="w-fit -ml-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        {/* Classification Card */}
        <Card className="bg-card/80 backdrop-blur-2xl border-border/60 rounded-[2.5rem] overflow-hidden shadow-large relative transition-all duration-500 hover:shadow-glow/5">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Layers className="size-24 text-primary" />
          </div>
          <CardHeader className="pb-4 px-8 pt-8">
            <CardTitle className="text-2xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Academic Classification
            </CardTitle>
            <CardDescription className="font-bold text-muted-foreground/80">
              Apply classification to all imported MCQs
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Subject */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Subject *
                </label>
                <Select
                  value={globalSubjectId}
                  onValueChange={(v) => {
                    setGlobalSubjectId(v);
                    setGlobalChapterId("");
                    setGlobalTopicId("");
                    setGlobalSubTopicId("");
                  }}
                >
                  <SelectTrigger className="h-10 w-full bg-background/50 border-border/50 rounded-xl font-semibold text-sm">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50">
                    {(subjects as SelectionItem[] | undefined)?.map((s) => (
                      <SelectItem
                        key={s.id}
                        value={s.id}
                        className="font-medium rounded-lg"
                      >
                        {s.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Chapter */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Chapter *
                </label>
                <Select
                  value={globalChapterId}
                  onValueChange={(v) => {
                    setGlobalChapterId(v);
                    setGlobalTopicId("");
                    setGlobalSubTopicId("");
                  }}
                  disabled={!globalSubjectId}
                >
                  <SelectTrigger className="h-10 w-full bg-background/50 border-border/50 rounded-xl font-semibold text-sm">
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50">
                    {(chapters as SelectionItem[] | undefined)?.map((c) => (
                      <SelectItem
                        key={c.id}
                        value={c.id}
                        className="font-medium rounded-lg"
                      >
                        {c.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Topic */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Topic{" "}
                  <span className="normal-case text-muted-foreground/50 font-normal">
                    (optional)
                  </span>
                </label>
                <Select
                  value={globalTopicId}
                  onValueChange={(v) => {
                    setGlobalTopicId(v);
                    setGlobalSubTopicId("");
                  }}
                  disabled={!globalChapterId}
                >
                  <SelectTrigger className="h-10 w-full bg-background/50 border-border/50 rounded-xl font-semibold text-sm">
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50">
                    {(topics as SelectionItem[] | undefined)?.map((t) => (
                      <SelectItem
                        key={t.id}
                        value={t.id}
                        className="font-medium rounded-lg"
                      >
                        {t.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* SubTopic */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Sub-Topic{" "}
                  <span className="normal-case text-muted-foreground/50 font-normal">
                    (optional)
                  </span>
                </label>
                <Select
                  value={globalSubTopicId}
                  onValueChange={setGlobalSubTopicId}
                  disabled={!globalTopicId}
                >
                  <SelectTrigger className="h-10 w-full bg-background/50 border-border/50 rounded-xl font-semibold text-sm">
                    <SelectValue placeholder="Select sub-topic" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50">
                    {(subTopics as SelectionItem[] | undefined)?.map((s) => (
                      <SelectItem
                        key={s.id}
                        value={s.id}
                        className="font-medium rounded-lg"
                      >
                        {s.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* JSON Input Card */}
        <Card className="bg-card/80 backdrop-blur-2xl border-border/60 rounded-[2.5rem] overflow-hidden shadow-large relative transition-all duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="size-24 text-primary" />
          </div>
          <CardHeader className="pb-4 px-8 pt-8">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-glow/10">
                <FileJson className="size-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  JSON Input
                </CardTitle>
                <CardDescription className="font-bold text-muted-foreground/80">
                  Paste your MCQ array to begin the import process
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-2 space-y-6">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadSample}
                className="h-9 rounded-xl border-border/50 font-semibold"
              >
                <FileJson className="h-4 w-4 mr-1.5" />
                Load Sample
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySchema}
                className="h-9 rounded-xl border-border/50 font-semibold"
              >
                <Copy className="h-4 w-4 mr-1.5" />
                Copy Schema
              </Button>
            </div>

            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`[\n  {\n    "question": "Your question",\n    "options": ["Option A", "Option B", "Option C", "Option D"],\n    "answer": "Option A",\n    "type": "SINGLE",\n    "session": 2024\n  }\n]`}
              rows={16}
              className="font-mono text-sm resize-y bg-background/50 border-border/50 rounded-2xl"
            />

            {parseError && (
              <div className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/20 rounded-2xl p-4">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive font-semibold">
                  Parse error: {parseError}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleImport}
                disabled={!jsonInput.trim()}
                className="h-11 px-8 bg-primary text-primary-foreground rounded-xl shadow-glow font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Upload className="h-4 w-4 mr-2 stroke-[3]" />
                Import &amp; Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Preview Step ─────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setStep("json");
            setImportedMcqs([]);
          }}
          className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to JSON
        </Button>

        <div className="flex items-center gap-2">
          {validCount > 0 && (
            <Badge className="bg-primary/15 text-primary border-primary/20 gap-1.5 font-bold">
              <CheckCircle2 className="h-3 w-3" />
              {validCount} valid
            </Badge>
          )}
          {invalidCount > 0 && (
            <Badge
              variant="destructive"
              className="gap-1.5 font-bold bg-destructive/15 text-destructive border-destructive/20"
            >
              <AlertCircle className="h-3 w-3" />
              {invalidCount} invalid
            </Badge>
          )}
          <Button
            onClick={handleSaveAll}
            disabled={validCount === 0 || isSaving}
            className="h-10 px-6 bg-primary text-primary-foreground rounded-xl shadow-glow font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Save className="h-4 w-4 mr-2 stroke-[3]" />
            Save {validCount} MCQ{validCount !== 1 ? "s" : ""}
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {importedMcqs.length === 0 && (
        <div className="rounded-[2rem] border border-dashed border-border/50 bg-card/30 p-16 text-center">
          <p className="text-muted-foreground font-medium">
            No MCQs to preview.
          </p>
          <Button
            variant="outline"
            className="mt-4 rounded-xl border-border/50"
            onClick={() => setStep("json")}
          >
            Go back to JSON input
          </Button>
        </div>
      )}

      {/* Cards */}
      <div className="space-y-4">
        {importedMcqs.map((mcq, index) => (
          <McqPreviewCard
            key={mcq._tempId}
            mcq={mcq}
            index={index}
            onUpdate={updateMcq}
            onRemove={removeMcq}
          />
        ))}
      </div>

      {/* Sticky save bar */}
      {importedMcqs.length > 0 && (
        <div className="sticky bottom-4 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl px-5 py-4 shadow-medium flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground font-medium">
            <span className="font-bold text-foreground">
              {importedMcqs.length}
            </span>{" "}
            MCQ{importedMcqs.length !== 1 ? "s" : ""} imported ·{" "}
            <span className="font-bold text-primary">{validCount}</span> ready
            to save
          </p>
          <Button
            onClick={handleSaveAll}
            disabled={validCount === 0 || isSaving}
            className="h-10 px-6 bg-primary text-primary-foreground rounded-xl shadow-glow font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Save className="h-4 w-4 mr-2 stroke-[3]" />
            Save All Valid
          </Button>
        </div>
      )}
    </div>
  );
};
