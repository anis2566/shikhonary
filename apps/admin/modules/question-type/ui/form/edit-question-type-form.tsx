"use client";

import { ChevronLeft, HelpCircle, Loader2, Save, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Switch } from "@workspace/ui/components/switch";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  questionTypeFormSchema,
  QuestionTypeFormValues,
  defaultQuestionTypeValues,
} from "@workspace/schema";

import {
  useUpdateQuestionType,
  useAcademicSubjectsForSelection,
  useAcademicChaptersForSelection,
  useQuestionTypeById,
} from "@workspace/api-client";

interface EditQuestionTypeFormProps {
  id: string;
}

export function EditQuestionTypeForm({ id }: EditQuestionTypeFormProps) {
  const router = useRouter();
  const { data: type, isLoading } = useQuestionTypeById(id);
  const { mutateAsync: updateType, isPending: isUpdating } =
    useUpdateQuestionType();

  const form = useForm<QuestionTypeFormValues>({
    resolver: zodResolver(questionTypeFormSchema),
    defaultValues: defaultQuestionTypeValues,
  });

  const subjectId = form.watch("subjectId");

  const { data: subjects } = useAcademicSubjectsForSelection();
  const { data: chapters } = useAcademicChaptersForSelection(subjectId);

  useEffect(() => {
    if (type) {
      form.reset({
        name: type.name,
        displayName: type.displayName,
        subjectId: type.subjectId,
        chapterId: type.chapterId,
        isActive: type.isActive,
      });
    }
  }, [type, form]);

  const onSubmit = async (data: QuestionTypeFormValues) => {
    try {
      await updateType({ id, data });
      router.push("/question-types");
    } catch (error: unknown) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <HelpCircle className="size-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Edit Question Type
            </h1>
            <p className="text-muted-foreground font-medium">
              Modify existing question type
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
            Update the details below.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Form {...form} key={type?.id}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Subject Selection */}
                <FormField
                  control={form.control}
                  name="subjectId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Subject
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={isUpdating}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold w-full text-foreground">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border/50 shadow-medium backdrop-blur-xl bg-background/95 max-h-[300px]">
                          {subjects?.map((subject) => (
                            <SelectItem
                              key={subject.id}
                              value={subject.id}
                              className="rounded-lg font-medium"
                            >
                              {subject.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                {/* Chapter Selection (Optional) */}
                <FormField
                  control={form.control}
                  name="chapterId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Chapter (Optional)
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || "none"}
                        disabled={isUpdating || !subjectId}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold w-full text-foreground">
                            <SelectValue
                              placeholder={
                                subjectId
                                  ? "Select chapter"
                                  : "Select subject first"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border/50 shadow-medium backdrop-blur-xl bg-background/95 max-h-[300px]">
                          <SelectItem
                            value="none"
                            className="rounded-lg font-medium text-muted-foreground"
                          >
                            Generic (No Chapter)
                          </SelectItem>
                          {chapters?.map((chapter) => (
                            <SelectItem
                              key={chapter.id}
                              value={chapter.id}
                              className="rounded-lg font-medium"
                            >
                              {chapter.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                          disabled={isUpdating}
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
                          disabled={isUpdating}
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
                        disabled={isUpdating}
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
                  disabled={isUpdating}
                  onClick={() => router.push("/question-types")}
                  className="h-12 px-6 rounded-xl font-bold border-border/50 hover:bg-muted transition-all text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="h-12 px-8 bg-primary text-primary-foreground rounded-xl shadow-glow font-bold hover:scale-[1.02] active:scale-[0.98] transition-all min-w-[170px]"
                >
                  {isUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin stroke-[3]" />
                  ) : (
                    <Save className="mr-2 h-4 w-4 stroke-[3]" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
