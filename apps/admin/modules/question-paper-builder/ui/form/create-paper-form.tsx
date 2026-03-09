"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Loader2,
  Plus,
  Sparkles,
  FileText,
  Trash2,
  GripVertical,
  Award,
  BookOpen,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";

import {
  questionPaperFormSchema,
  QuestionPaperFormValues,
  defaultQuestionPaperValues,
} from "@workspace/schema";
import {
  useCreateQuestionPaper,
  useAcademicClassesForSelection,
  useAcademicSubjectsForSelection,
} from "@workspace/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MarkDistributionRow {
  id: string;
  type: string;
  marksPerQuestion: number;
  questionCount: number;
  questionsToAttempt: number | null;
  sectionLabel: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const QUESTION_TYPES = [
  "MCQ",
  "CQ",
  "Short",
  "Essay",
  "Practical",
  "Viva",
  "Fill-in-the-Blank",
  "True/False",
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeRow = (): MarkDistributionRow => ({
  id: crypto.randomUUID(),
  type: "MCQ",
  marksPerQuestion: 1,
  questionCount: 10,
  questionsToAttempt: null,
  sectionLabel: "",
});

const rowTotal = (r: MarkDistributionRow) =>
  r.marksPerQuestion * (r.questionsToAttempt ?? r.questionCount);

// ─── BreakdownTable ───────────────────────────────────────────────────────────
//
// ARCHITECTURE NOTE — why this is self-contained:
//
// Every previous attempt threaded an `onChange` callback from the parent into
// this component.  Each time ANY field changed, `setBreakdowns` ran in the
// parent, which re-rendered, which produced a new `onChange` reference, which
// Radix Select saw as a new prop, which triggered its internal position
// recalculation — causing another state update — infinite loop.
//
// Solution: state lives HERE.  The parent never writes to it.
// At submit time the parent reads rows via `registryRef` (a stable Map ref).
// Zero prop-drilling of callbacks → zero re-render cascade.

interface BreakdownTableProps {
  subjectId: string;
  /** Stable ref the parent uses to read rows at submit time. */
  registryRef: React.MutableRefObject<Map<string, () => MarkDistributionRow[]>>;
  disabled?: boolean;
}

const BreakdownTable = React.memo(
  ({ subjectId, registryRef, disabled }: BreakdownTableProps) => {
    const [rows, setRows] = React.useState<MarkDistributionRow[]>([]);

    // Keep registry up-to-date whenever rows change
    React.useLayoutEffect(() => {
      registryRef.current.set(subjectId, () => rows);
    }, [subjectId, rows, registryRef]);

    // Cleanup on unmount
    React.useEffect(() => {
      return () => {
        registryRef.current.delete(subjectId);
      };
    }, [subjectId, registryRef]);

    const update = (id: string, patch: Partial<MarkDistributionRow>) =>
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      );

    const remove = (id: string) =>
      setRows((prev) => prev.filter((r) => r.id !== id));

    const add = () => setRows((prev) => [...prev, makeRow()]);

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

            {/* Type (native select — no Radix, no re-render cascade) + section label */}
            <div className="flex flex-col gap-1 min-w-0">
              <select
                value={row.type}
                disabled={disabled}
                onChange={(e) => update(row.id, { type: e.target.value })}
                className="h-8 w-full rounded-lg border border-border/40 bg-background/50 px-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Section label (optional)"
                value={row.sectionLabel}
                onChange={(e) =>
                  update(row.id, { sectionLabel: e.target.value })
                }
                disabled={disabled}
                className="h-6 text-[10px] bg-transparent border-border/30 rounded-lg px-2"
              />
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

// ─── Main form ────────────────────────────────────────────────────────────────

export const CreatePaperForm = () => {
  const router = useRouter();
  const { mutateAsync: createPaper, isPending } = useCreateQuestionPaper();
  const { data: classes } = useAcademicClassesForSelection();

  const form = useForm<QuestionPaperFormValues>({
    resolver: zodResolver(questionPaperFormSchema),
    defaultValues: { ...defaultQuestionPaperValues, status: "Draft" as const },
  });

  // Plain React state — no form.watch(), no useWatch(), no subscriptions
  const [selectedClassId, setSelectedClassId] = React.useState<
    string | undefined
  >(undefined);
  const [selectedSubjectIds, setSelectedSubjectIds] = React.useState<string[]>(
    [],
  );
  const [activeSubjectId, setActiveSubjectId] = React.useState<string | null>(
    null,
  );

  const { data: subjects } = useAcademicSubjectsForSelection(
    selectedClassId || undefined,
  );

  // Stable ref map — BreakdownTable instances register their row getters here
  const breakdownRegistry = React.useRef<
    Map<string, () => MarkDistributionRow[]>
  >(new Map());

  const handleClassChange = (classId: string) => {
    form.setValue("subjectIds", []);
    setSelectedClassId(classId);
    setSelectedSubjectIds([]);
    setActiveSubjectId(null);
    breakdownRegistry.current.clear();
  };

  const handleSubjectToggle = (subjectId: string) => {
    const isSelected = selectedSubjectIds.includes(subjectId);
    const next = isSelected
      ? selectedSubjectIds.filter((id) => id !== subjectId)
      : [...selectedSubjectIds, subjectId];

    form.setValue("subjectIds", next);
    setSelectedSubjectIds(next);

    if (isSelected) {
      breakdownRegistry.current.delete(subjectId);
      if (activeSubjectId === subjectId) {
        setActiveSubjectId(next[0] ?? null);
      }
    } else {
      if (!activeSubjectId) setActiveSubjectId(subjectId);
    }
  };

  const onSubmit = async (data: QuestionPaperFormValues) => {
    try {
      const payload = {
        ...data,
        subjectBreakdowns: selectedSubjectIds.map((sid) => {
          const getRows = breakdownRegistry.current.get(sid);
          const rows = getRows?.() ?? [];
          return {
            subjectId: sid,
            distributions: rows.map((r) => ({
              type: r.type,
              marksPerQuestion: r.marksPerQuestion,
              questionCount: r.questionCount,
              totalMarks: rowTotal(r),
              questionsToAttempt: r.questionsToAttempt,
              sectionLabel: r.sectionLabel || null,
            })),
          };
        }),
      };
      const result = await createPaper(payload as any);
      if (result.success && result.data?.id) {
        router.push(`/question-papers/${result.data.id}/customize`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-8 animate-in fade-in duration-500 text-foreground">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="w-fit -ml-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex items-center gap-4">
          <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-soft">
            <FileText className="size-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              New Question Paper
            </h1>
            <p className="text-muted-foreground font-medium">
              Enter paper details and configure mark breakdown per subject
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ── Card 1: Paper Details ── */}
          <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Sparkles className="size-24 text-primary" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">Paper Details</CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Information that will appear in the paper header
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Document Title *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Weekly Test – Physics"
                        {...field}
                        disabled={isPending}
                        className="h-12 bg-background/50 border-border/50 rounded-xl px-4 font-semibold"
                      />
                    </FormControl>
                    <FormMessage className="font-bold text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Class */}
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Class / Grade *
                      </FormLabel>
                      <FormControl>
                        <select
                          value={selectedClassId ?? ""}
                          disabled={isPending}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            handleClassChange(e.target.value);
                          }}
                          className="h-12 w-full rounded-xl border border-border/50 bg-background/50 px-4 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                        >
                          <option value="" disabled>
                            Select a class
                          </option>
                          {classes?.map((c: any) => (
                            <option key={c.id} value={c.id}>
                              {c.displayName}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                {/* Exam name */}
                <FormField
                  control={form.control}
                  name="examName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Examination Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Annual Examination 2024"
                          {...field}
                          disabled={isPending}
                          className="h-12 bg-background/50 border-border/50 rounded-xl px-4 font-semibold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                {/* Total marks */}
                <FormField
                  control={form.control}
                  name="total"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Total Marks
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 100"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          disabled={isPending}
                          className="h-12 bg-background/50 border-border/50 rounded-xl px-4 font-semibold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                {/* Duration */}
                <FormField
                  control={form.control}
                  name="timeInMinutes"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Duration (Minutes)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 180"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          disabled={isPending}
                          className="h-12 bg-background/50 border-border/50 rounded-xl px-4 font-semibold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Subjects */}
              <FormField
                control={form.control}
                name="subjectIds"
                render={() => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Target Subjects *
                    </FormLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {subjects?.map((subject: any) => {
                        const isChecked = selectedSubjectIds.includes(
                          subject.id,
                        );
                        return (
                          <label
                            key={subject.id}
                            className={cn(
                              "flex flex-row items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/30 transition-all cursor-pointer hover:bg-primary/5",
                              isChecked &&
                                "border-primary/30 bg-primary/5 shadow-soft",
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleSubjectToggle(subject.id)}
                              className="size-4 rounded border-border accent-primary cursor-pointer"
                            />
                            <span className="text-xs font-bold">
                              {subject.displayName}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    {!subjects?.length && selectedClassId && (
                      <p className="text-xs text-muted-foreground italic">
                        No subjects found for the selected class.
                      </p>
                    )}
                    {!selectedClassId && (
                      <p className="text-xs text-muted-foreground italic">
                        Please select a class first.
                      </p>
                    )}
                    <FormMessage className="font-bold text-xs" />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Description / Instructions
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Internal notes or general instructions for the paper..."
                        {...field}
                        disabled={isPending}
                        className="min-h-[100px] bg-background/50 border-border/50 rounded-xl px-4 py-3 font-medium resize-none"
                      />
                    </FormControl>
                    <FormMessage className="font-bold text-xs" />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ── Card 2: Mark Breakdown ── */}
          {selectedSubjectIds.length > 0 && (
            <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <BookOpen className="size-24 text-primary" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">
                  Mark Breakdown
                </CardTitle>
                <CardDescription className="text-muted-foreground font-medium">
                  Define question types, marks, and section structure per
                  subject
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {/* Subject tabs */}
                <div className="flex flex-wrap gap-2">
                  {selectedSubjectIds.map((sid) => {
                    const subject = subjects?.find((s: any) => s.id === sid);
                    return (
                      <button
                        key={sid}
                        type="button"
                        onClick={() => setActiveSubjectId(sid)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                          activeSubjectId === sid
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-background/50 border-border/40 text-muted-foreground hover:bg-primary/5",
                        )}
                      >
                        {subject?.displayName ?? sid}
                      </button>
                    );
                  })}
                </div>

                <Separator className="opacity-50" />

                {/* Render all tables; show/hide with CSS so instances are preserved */}
                {selectedSubjectIds.map((sid) => {
                  const subject = subjects?.find((s: any) => s.id === sid);
                  return (
                    <div
                      key={sid}
                      className={
                        activeSubjectId === sid ? "block space-y-3" : "hidden"
                      }
                    >
                      <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        {subject?.displayName ?? sid} — Mark Distribution
                      </p>
                      <BreakdownTable
                        subjectId={sid}
                        registryRef={breakdownRegistry}
                        disabled={isPending}
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => router.back()}
              className="h-12 px-6 rounded-xl font-bold border-border/50 hover:bg-muted transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-12 px-8 bg-primary text-primary-foreground rounded-xl shadow-glow font-bold hover:scale-[1.02] active:scale-[0.98] transition-all min-w-[200px]"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin stroke-[3]" />
              ) : (
                <Plus className="mr-2 h-4 w-4 stroke-[3]" />
              )}
              Create &amp; Start Building
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
