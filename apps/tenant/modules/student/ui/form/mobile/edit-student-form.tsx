"use client";

import { useRouter } from "next/navigation";
import { 
  useForm, 
  zodResolver, 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@workspace/ui/components/form";
import { 
  studentFormSchema, 
  type StudentFormValues 
} from "@workspace/schema";
import { 
  useUpdateStudent,
  useAcademicClassesForSelection,
  useAcademicYearsForSelection,
  useBatchByYearClassId
} from "@workspace/api-client";
import { 
  ArrowLeft,
  CheckCircle2,
  School,
  User,
  Phone,
  CreditCard,
  Rocket
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@workspace/ui/components/select";
import { TenantTypes } from "@workspace/db";

interface MobileEditStudentFormProps {
  student: TenantTypes.Student;
}

export const MobileEditStudentForm = ({ student }: MobileEditStudentFormProps) => {
  const router = useRouter();
  const { mutateAsync: updateStudent, isPending } = useUpdateStudent();
  
  const { data: years } = useAcademicYearsForSelection();
  const { data: classes } = useAcademicClassesForSelection();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      ...student,
      bloodGroup: student.bloodGroup || undefined,
      group: student.group || undefined,
      shift: student.shift || undefined,
      secondaryPhone: student.secondaryPhone || undefined,
      institute: student.institute || undefined,
      email: student.email || undefined,
    } as any,
  });

  const academicClass = form.watch("academicClassId");
  const academicYear = form.watch("academicYearId");
  const { data: batches } = useBatchByYearClassId(academicYear, academicClass);

  const onSubmit = async (values: StudentFormValues) => {
    try {
      await updateStudent({ id: student.id, ...values });
      router.push(`/students/${student.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-32 pt-16 flex flex-col">
      <header className="fixed top-0 w-full z-50 flex items-center px-4 h-16 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 text-emerald-700 active:scale-90 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="ml-3 font-bold text-slate-900 tracking-tight">Edit Profile</h1>
      </header>

      <main className="px-4 mt-6 space-y-8 flex-grow max-w-md mx-auto">
        <Form {...form}>
          <form className="space-y-8">
            {/* Academic Section */}
            <MobileSection title="Academic Details" icon={School}>
               <FormField
                  control={form.control}
                  name="academicYearId"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Year</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-white border-slate-100 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          {years?.map((y) => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="academicClassId"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Class</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-white border-slate-100 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          {classes?.map((c) => <SelectItem key={c.id} value={c.id}>{c.displayName}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
            </MobileSection>

            {/* Personal Section */}
            <MobileSection title="Personal Info" icon={User}>
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</FormLabel>
                      <FormControl><Input {...field} className="h-12 bg-white border-slate-100 rounded-xl font-bold" /></FormControl>
                    </FormItem>
                  )}
                />
            </MobileSection>

            {/* Financial Section */}
            <MobileSection title="Financials" icon={CreditCard}>
               <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="admissionFee"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admission</FormLabel>
                        <Input type="number" {...field} className="h-12 bg-white border-slate-100 rounded-xl font-bold text-emerald-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="monthlyFee"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly</FormLabel>
                        <Input type="number" {...field} className="h-12 bg-white border-slate-100 rounded-xl font-bold text-blue-600" />
                      </FormItem>
                    )}
                  />
               </div>
            </MobileSection>
          </form>
        </Form>
      </main>

      <footer className="fixed bottom-0 w-full p-4 pb-8 bg-white/80 backdrop-blur-lg border-t border-slate-100 flex gap-3 max-w-md mx-auto left-0 right-0">
         <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="flex-1 h-12 font-bold text-slate-500 rounded-xl"
          >
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isPending}
            className="flex-[2] h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 border-none flex items-center justify-center gap-2"
          >
            {isPending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Save <Rocket size={16} /></>}
          </Button>
      </footer>
    </div>
  );
};

const MobileSection = ({ title, icon: Icon, children }: any) => (
  <section className="space-y-3">
    <div className="flex items-center gap-2">
       <div className="w-1 h-5 bg-emerald-500 rounded-full" />
       <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          {title}
       </h2>
    </div>
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-5">
       {children}
    </div>
  </section>
);
