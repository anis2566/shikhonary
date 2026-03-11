"use client";

import { ChevronLeft, HelpCircle, Loader2, Plus, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import { Form, useForm, zodResolver } from "@workspace/ui/components/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  questionTypeFormSchema,
  QuestionTypeFormValues,
  defaultQuestionTypeValues,
} from "@workspace/schema";
import { MultiSelect } from "@workspace/ui/components/multi-select";

import {
  useCreateQuestionType,
  useAcademicSubjectsForSelection,
  useAcademicClassesForSelection,
} from "@workspace/api-client";

export function QuestionTypeForm() {
  const [classId, setClassId] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSubjectId = searchParams.get("subjectId");
  const { mutateAsync: createType, isPending } = useCreateQuestionType();

  const { data: classes } =
    useAcademicClassesForSelection();

  const form = useForm<QuestionTypeFormValues>({
    resolver: zodResolver(questionTypeFormSchema),
    defaultValues: {
      ...defaultQuestionTypeValues,
      subjectIds: urlSubjectId ? [urlSubjectId] : [],
    },
  });

  const { data: subjects } = useAcademicSubjectsForSelection(classId);

  // Clear subject selection when class changes to avoid orphaned subjects
  const handleClassChange = (newClassId: string) => {
    setClassId(newClassId);
    form.setValue("subjectIds", []);
  };

  const onSubmit = async (data: QuestionTypeFormValues) => {
    try {
      await createType(data);
      router.push("/question-types");
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 lg:p-6 space-y-8 animate-in fade-in duration-500 text-foreground">
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
            <HelpCircle className="size-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Create Question Type
            </h1>
            <p className="text-muted-foreground font-medium">
              Define a new question categories
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Sparkles className="size-24 text-primary" />
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">Type Details</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Fill in the details below.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Class Filter (Optional but recommended) */}
              <div className="space-y-2">
                <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Filter by Class
                </FormLabel>
                <Select onValueChange={handleClassChange} value={classId}>
                  <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold w-full text-foreground">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50 shadow-medium backdrop-blur-xl bg-background/95 max-h-[300px]">
                    <SelectItem value="all" className="rounded-lg font-medium">
                      All Classes
                    </SelectItem>
                    {classes?.map((cls) => (
                      <SelectItem
                        key={cls.id}
                        value={cls.id}
                        className="rounded-lg font-medium"
                      >
                        {cls.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 col-span-2">
                {/* Associated Subjects - Multi Select */}
                <FormField
                  control={form.control}
                  name="subjectIds"
                  render={({ field }) => (
                    <FormItem className="space-y-2 col-span-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Associated Subjects
                      </FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={
                            subjects?.map((s) => ({
                              label: s.displayName,
                              value: s.id,
                            })) || []
                          }
                          selected={field.value}
                          onChange={field.onChange}
                          placeholder="Select subjects"
                          className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold w-full text-foreground"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Internal Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., knowledge-based"
                          {...field}
                          disabled={isPending}
                          className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                {/* Display Name */}
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Display Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Knowledge Based (ক)"
                          {...field}
                          disabled={isPending}
                          className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                {/* Label */}
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Short Label
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., ক, খ, MCQ"
                          {...field}
                          disabled={isPending}
                          className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Status Toggle */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-[1.5rem] border border-border/50 bg-primary/5 p-6 shadow-soft transition-all hover:bg-primary/[0.07]">
                    <div className="space-y-1">
                      <FormLabel className="text-lg font-bold text-foreground flex items-center gap-2">
                        Active Status
                        {field.value && (
                          <Badge className="bg-primary text-primary-foreground font-black text-[10px] uppercase">
                            Live
                          </Badge>
                        )}
                      </FormLabel>
                      <CardDescription className="text-muted-foreground font-medium">
                        Enable this type to make it available for questions.
                      </CardDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                        className="data-[state=checked]:bg-primary"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/30">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => router.push("/question-types")}
                  className="h-12 px-6 rounded-xl font-bold border-border/50 hover:bg-muted transition-all text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-12 px-8 bg-primary text-primary-foreground rounded-xl shadow-glow font-bold hover:scale-[1.02] active:scale-[0.98] transition-all min-w-[170px]"
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin stroke-[3]" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4 stroke-[3]" />
                  )}
                  Create Type
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
