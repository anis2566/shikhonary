"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Loader2,
  Plus,
  Sparkles,
  FileText,
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
import { MultiSelect } from "@workspace/ui/components/multi-select";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
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

import {
  BreakdownTable,
  MarkDistributionRow,
  rowTotal,
} from "./breakdown-table";

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

  const handleSubjectChange = (newIds: string[]) => {
    setSelectedSubjectIds(newIds);
    form.setValue("subjectIds", newIds);

    // If active subject was removed, or none set, pick a new one
    if (newIds.length === 0) {
      setActiveSubjectId(null);
    } else if (!activeSubjectId || !newIds.includes(activeSubjectId)) {
      setActiveSubjectId(newIds[0] || null);
    }
  };

  const onSubmit = React.useCallback(
    async (data: QuestionPaperFormValues) => {
      try {
        const payload = {
          ...data,
          subjectBreakdowns: selectedSubjectIds.map((sid) => {
            const getRows = breakdownRegistry.current.get(sid);
            const rows = getRows?.() ?? [];
            return {
              subjectId: sid,
              distributions: rows.map((r) => ({
                questionTypeId: r.questionTypeId,
                marksPerQuestion: r.marksPerQuestion,
                questionCount: r.questionCount,
                totalMarks: rowTotal(r),
                questionsToAttempt: r.questionsToAttempt,
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
    },
    [selectedSubjectIds, createPaper, router],
  );

  // Wrapper to satisfy lint vs "accessing refs during render"
  const handleSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(onSubmit)(e);
  };

  const subjectsData = (subjects as { id: string; displayName: string }[]) || [];

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
        <form onSubmit={handleSubmission} className="space-y-6">
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
                        <Select
                          value={selectedClassId ?? ""}
                          onValueChange={(val) => {
                            field.onChange(val);
                            handleClassChange(val);
                          }}
                          disabled={isPending}
                        >
                          <SelectTrigger className="h-12 w-full rounded-xl border border-border/50 bg-background/50 px-4 text-sm font-semibold text-foreground focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes?.map(
                              (c: { id: string; displayName: string }) => (
                                <SelectItem
                                  key={c.id}
                                  value={c.id}
                                  className="font-semibold"
                                >
                                  {c.displayName}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
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
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Target Subjects *
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        {...field}
                        options={subjectsData.map((s) => ({
                          label: s.displayName,
                          value: s.id,
                        }))}
                        selected={selectedSubjectIds}
                        onChange={(vals) => {
                          field.onChange(vals);
                          handleSubjectChange(vals);
                        }}
                        placeholder={
                          selectedClassId
                            ? "Select subjects..."
                            : "Please select a class first"
                        }
                        disabled={isPending || !selectedClassId}
                        className="bg-background/50 border-border/50 rounded-xl"
                      />
                    </FormControl>
                    {!subjectsData.length && selectedClassId && (
                      <p className="text-xs text-muted-foreground italic">
                        No subjects found for the selected class.
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
                    const subject = subjectsData.find((s) => s.id === sid);
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
                  const subject = subjectsData.find((s) => s.id === sid);
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
