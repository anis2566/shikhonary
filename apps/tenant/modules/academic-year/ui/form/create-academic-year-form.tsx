"use client";

import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  Loader2,
  Plus,
  Sparkles,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import { Badge } from "@workspace/ui/components/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Calendar } from "@workspace/ui/components/calendar";
import { format } from "date-fns";
import { cn } from "@workspace/ui/lib/utils";
import { academicYearSchema, AcademicYear } from "@workspace/schema";
import { useCreateAcademicYear } from "@workspace/api-client";

export function CreateAcademicYearForm() {
  const router = useRouter();
  const { mutateAsync: createYear, isPending } = useCreateAcademicYear();

  const form = useForm<AcademicYear>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      name: "",
      startDate: undefined,
      endDate: undefined,
      isCurrent: false,
      isActive: true,
    },
  });

  const onSubmit = async (data: AcademicYear) => {
    try {
      await createYear(data);
      router.push("/academic-years");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 lg:p-6 space-y-8 animate-in fade-in duration-500 text-foreground">
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
          <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <CalendarIcon className="size-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Create Academic Year
            </h1>
            <p className="text-muted-foreground font-medium">
              Define a new academic year for your institution
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-md relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Sparkles className="size-24 text-primary" />
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">Year Details</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Fill in the details below to create a new academic year.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Year Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Year Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 2025-2026"
                        {...field}
                        disabled={isPending}
                        className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all font-semibold"
                      />
                    </FormControl>
                    <FormMessage className="font-bold text-xs" />
                  </FormItem>
                )}
              />

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="space-y-2 flex flex-col">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Start Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all font-semibold text-left",
                                !field.value && "text-muted-foreground",
                              )}
                              disabled={isPending}
                            >
                              {field.value instanceof Date ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown-years"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="space-y-2 flex flex-col">
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        End Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all font-semibold text-left",
                                !field.value && "text-muted-foreground",
                              )}
                              disabled={isPending}
                            >
                              {field.value instanceof Date ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown-years"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date("1900-01-01") ||
                              (!!form.watch("startDate") &&
                                date < form.watch("startDate"))
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Set as Current */}
              <FormField
                control={form.control}
                name="isCurrent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-[1.5rem] border border-border/50 bg-amber-500/5 p-6 transition-all hover:bg-amber-500/[0.07]">
                    <div className="space-y-1">
                      <FormLabel className="text-lg font-bold text-foreground flex items-center gap-2">
                        Set as Current Year
                        {field.value && (
                          <Badge className="bg-amber-500 text-white font-black text-[10px] uppercase">
                            Current
                          </Badge>
                        )}
                      </FormLabel>
                      <FormDescription className="text-muted-foreground font-medium">
                        Mark this as the currently active academic year.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                        className="data-[state=checked]:bg-amber-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Active Status */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-[1.5rem] border border-border/50 bg-primary/5 p-6 transition-all hover:bg-primary/[0.07]">
                    <div className="space-y-1">
                      <FormLabel className="text-lg font-bold text-foreground flex items-center gap-2">
                        Active Status
                        {field.value && (
                          <Badge className="bg-primary text-primary-foreground font-black text-[10px] uppercase">
                            Live
                          </Badge>
                        )}
                      </FormLabel>
                      <FormDescription className="text-muted-foreground font-medium">
                        Enable this academic year to make it visible.
                      </FormDescription>
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

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/30">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => form.reset()}
                  className="h-12 px-6 rounded-xl font-bold border-border/50 hover:bg-muted transition-all"
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-12 px-8 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all min-w-[180px]"
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin stroke-[3]" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4 stroke-[3]" />
                  )}
                  Create Year
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
