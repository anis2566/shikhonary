"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Loader2,
  Sparkles,
  FileText,
  BookOpen,
  Save,
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
  useUpdateQuestionPaper,
  useQuestionPaperById,
  useAcademicClassesForSelection,
  useAcademicSubjectsForSelection,
} from "@workspace/api-client";

import {
  BreakdownTable,
  MarkDistributionRow,
  rowTotal,
} from "./breakdown-table";

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface PaperDistribution {
  id: string;
  questionTypeId: string;
  marksPerQuestion: number;
  questionCount: number;
  questionsToAttempt: number | null;
}

interface PaperSubject {
  id: string;
  subjectId: string;
  distributions: PaperDistribution[];
}

interface QuestionPaperData {
  title: string;
  classId: string;
  examName: string;
  total: number;
  timeInMinutes: number;
  description?: string;
  status: string;
  subjects: PaperSubject[];
}

// ─── EditPaperForm ────────────────────────────────────────────────────────────

interface EditPaperFormProps {
  paperId: string;
}

export const EditPaperForm = ({ paperId }: EditPaperFormProps) => {
  const router = useRouter();
  const { data: paper, isLoading: isFetching } = useQuestionPaperById(paperId);
  const { mutateAsync: updatePaper, isPending } = useUpdateQuestionPaper();
  const { data: classes } = useAcademicClassesForSelection();

  const form = useForm<QuestionPaperFormValues>({
    resolver: zodResolver(questionPaperFormSchema),
    defaultValues: defaultQuestionPaperValues,
  });

  const [selectedClassId, setSelectedClassId] = React.useState<
    string | undefined
  >(undefined);
  const [selectedSubjectIds, setSelectedSubjectIds] = React.useState<string[]>(
    [],
  );
  const [activeSubjectId, setActiveSubjectId] = React.useState<string | null>(
    null,
  );

  const { data: subjects } = useAcademicSubjectsForSelection(selectedClassId);

  const breakdownRegistry = React.useRef<
    Map<string, () => MarkDistributionRow[]>
  >(new Map());

  // Initialize form with existing paper data
  React.useEffect(() => {
    if (paper) {
      const p = paper as QuestionPaperData;
      const subjectIds = p.subjects?.map((s) => s.subjectId) || [];
      form.reset({
        title: p.title || "",
        classId: p.classId || "",
        examName: p.examName || "",
        total: p.total || 0,
        timeInMinutes: p.timeInMinutes || 0,
        description: p.description || "",
        status: (p.status as "Draft" | "Published") ?? "Draft",
        subjectIds: subjectIds,
      });

      setSelectedClassId(p.classId);
      setSelectedSubjectIds(subjectIds);
      if (subjectIds.length > 0) {
        setActiveSubjectId(subjectIds[0] || null);
      }
    }
  }, [paper, form]);

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

    if (newIds.length === 0) {
      setActiveSubjectId(null);
    } else if (!activeSubjectId || !newIds.includes(activeSubjectId)) {
      setActiveSubjectId(newIds[0] || null);
    }
  };

  const distributionsBySubject = React.useMemo(() => {
    if (!paper?.subjects) return new Map<string, MarkDistributionRow[]>();
    const map = new Map<string, MarkDistributionRow[]>();
    const p = paper as QuestionPaperData;
    p.subjects.forEach((ps) => {
      map.set(
        ps.subjectId,
        ps.distributions.map((d) => ({
          id: d.id,
          questionTypeId: d.questionTypeId,
          marksPerQuestion: d.marksPerQuestion,
          questionCount: d.questionCount,
          questionsToAttempt: d.questionsToAttempt,
        })),
      );
    });
    return map;
  }, [paper]);

  const onSubmit = React.useCallback(
    async (data: QuestionPaperFormValues) => {
      try {
        const subjectBreakdowns = selectedSubjectIds.map((sid) => {
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
        });

        await updatePaper({
          id: paperId,
          data: {
            ...data,
            subjectBreakdowns,
          },
        });
        router.push(`/question-papers/${paperId}/customize`);
      } catch (error) {
        console.error(error);
      }
    },
    [paperId, selectedSubjectIds, updatePaper, router],
  );

  // Wrapper to satisfy lint vs "accessing refs during render"
  // Even though it's inside handleSubmit, the linter sometimes flags
  // the ref capture in the callback.
  const handleSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(onSubmit)(e);
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium">
          Loading paper data...
        </p>
      </div>
    );
  }

  const subjectsData =
    (subjects as { id: string; displayName: string }[]) || [];

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
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Update Question Paper
            </h1>
            <p className="text-muted-foreground font-medium">
              Refine details and configuration for your question paper
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmission} className="space-y-6">
          {/* Card 1: Paper Details */}
          <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Sparkles className="size-24 text-primary" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">Paper Details</CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Core information for the paper header
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
                        placeholder="e.g., Annual Exam – Grade 10"
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
                          placeholder="e.g., Annual Exam 2024"
                          {...field}
                          disabled={isPending}
                          className="h-12 bg-background/50 border-border/50 rounded-xl px-4 font-semibold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

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
                          placeholder="100"
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

                <FormField
                  control={form.control}
                  name="timeInMinutes"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Duration (Min)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="180"
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
                            : "Select a class first"
                        }
                        disabled={isPending || !selectedClassId}
                        className="bg-background/50 border-border/50 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage className="font-bold text-xs" />
                  </FormItem>
                )}
              />

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
                        placeholder="Internal notes or header instructions..."
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

          {/* Card 2: Mark Breakdown */}
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
                  Define types and structure per subject
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
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
                        initialRows={distributionsBySubject.get(sid)}
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
                <Save className="mr-2 h-4 w-4 stroke-[3]" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
