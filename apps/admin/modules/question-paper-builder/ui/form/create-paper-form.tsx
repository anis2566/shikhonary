"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Plus, Sparkles, FileText } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import {
  questionPaperFormSchema,
  QuestionPaperFormValues,
  defaultQuestionPaperValues,
} from "@workspace/schema";
import {
  useCreateQuestionPaper,
  useAcademicSubjectsForSelection,
} from "@workspace/api-client";

export const CreatePaperForm = () => {
  const router = useRouter();
  const { mutateAsync: createPaper, isPending } = useCreateQuestionPaper();
  const { data: subjects } = useAcademicSubjectsForSelection();

  const form = useForm<QuestionPaperFormValues>({
    resolver: zodResolver(questionPaperFormSchema),
    defaultValues: defaultQuestionPaperValues,
  });

  const onSubmit = async (data: QuestionPaperFormValues) => {
    try {
      const result = await createPaper(data);
      if (result.success && result.data?.id) {
        router.push(`/question-papers/${result.data.id}/build`);
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
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              New Question Paper
            </h1>
            <p className="text-muted-foreground font-medium">
              Enter the basic information to start building your paper
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
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
                        placeholder="e.g., Weekly Test - Physics"
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
                  name="examName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Examination Name
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

                <FormField
                  control={form.control}
                  name="className"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Class / Grade
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Class 10"
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
                  name="subjectName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Subject
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Physics"
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
                  name="chapterName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Chapter / Topic
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Chapter 1: Mechanics"
                          {...field}
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
              Create & Start Building
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
