"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, useForm, zodResolver } from "@workspace/ui/components/form";
import { useStudentById, useUpdateStudent } from "@workspace/api-client";
import {
  studentFormSchema,
  type StudentFormValues,
} from "@workspace/schema";
import {
  EnrollmentStepper,
  SetupForm,
  PersonalProfileForm,
  AcademicPlacementForm,
  GuardiansContactForm,
  FinancialsForm,
  ReviewStep,
} from "../components/desktop/enrollment";
import { studentFormSteps } from "../components/desktop/form/steps";
import { GraduationCap, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditStudentViewProps {
  studentId: string;
}

export const EditStudentView = ({ studentId }: EditStudentViewProps) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { data: student } = useStudentById(studentId);
  const { mutateAsync: updateStudent, isPending } = useUpdateStudent();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      ...student,
      bloodGroup: student?.bloodGroup || undefined,
      group: student?.group || undefined,
      shift: student?.shift || undefined,
      secondaryPhone: student?.secondaryPhone || undefined,
      institute: student?.institute || undefined,
      email: student?.email || undefined,
    } as any,
    mode: "onChange",
  });

  // Re-sync form if student data arrives later
  React.useEffect(() => {
    if (student) {
      form.reset({
        ...student,
        bloodGroup: student.bloodGroup || undefined,
        group: student.group || undefined,
        shift: student.shift || undefined,
        secondaryPhone: student.secondaryPhone || undefined,
        institute: student.institute || undefined,
        email: student.email || undefined,
      } as any);
    }
  }, [student, form]);

  if (!student) return null;

  const nextStep = async () => {
    let fieldsToValidate: (keyof StudentFormValues)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          "academicYearId",
          "academicClassId",
          "batchId",
          "studentId",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "name",
          "email",
          "dateOfBirth",
          "gender",
          "religion",
          "nationality",
          "bloodGroup",
        ];
        break;
      case 3:
        fieldsToValidate = ["institute", "roll", "group", "shift", "section"];
        break;
      case 4:
        fieldsToValidate = [
          "fatherName",
          "motherName",
          "primaryPhone",
          "secondaryPhone",
          "presentAddress",
          "permanentAddress",
        ];
        break;
      case 5:
        fieldsToValidate = ["admissionFee", "monthlyFee", "isActive"];
        break;
      default:
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid && currentStep < studentFormSteps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (values: StudentFormValues) => {
    try {
      await updateStudent({ id: studentId, ...values });
      router.push(`/students/${studentId}`);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 py-10 px-4 md:px-8 min-h-screen">
      {/* Header */}
      <header className="relative flex flex-col gap-3 w-full animate-fade-in overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-6 -left-6 w-40 h-40 rounded-full bg-emerald-200/25 blur-3xl -z-10"
        />

        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-3">
             <div className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-[0.18em]">
               <Sparkles className="w-3 h-3" />
               Update Profile
             </div>

             <div className="flex items-center gap-4">
               <div className="relative flex-shrink-0">
                 <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105 duration-300">
                   <GraduationCap className="w-7 h-7 text-white" strokeWidth={2} />
                 </div>
               </div>

               <div className="min-w-0">
                 <h1 className="text-2xl md:text-3xl font-extrabold text-on-background tracking-tight leading-tight">
                   Edit {student.name}
                 </h1>
                 <div className="mt-1 mb-1.5 h-0.5 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" />
                 <p className="text-sm text-on-surface-variant font-medium leading-snug max-w-md">
                   Update institutional and personal records for this student
                 </p>
               </div>
             </div>
          </div>

          <Link
            href={`/students/${studentId}`}
            className="hidden md:flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors group mt-2"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Cancel
            </span>
          </Link>
        </div>
      </header>

      {/* Stepper */}
      <EnrollmentStepper steps={studentFormSteps} currentStep={currentStep} />

      {/* Main Content Area */}
      <main className="w-full bg-surface-container-lowest rounded-[24px] p-8 md:p-12 shadow-soft relative overflow-hidden border border-emerald-500/5 animate-fade-in [animation-delay:300ms]">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <Form {...form}>
          <form className="relative z-10">
            {currentStep === 1 && <SetupForm form={form} onNext={nextStep} isEdit={true} />}

            {currentStep === 2 && (
              <PersonalProfileForm
                form={form}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}

            {currentStep === 3 && (
              <AcademicPlacementForm
                form={form}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}

            {currentStep === 4 && (
              <GuardiansContactForm
                form={form}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}

            {currentStep === 5 && (
              <FinancialsForm form={form} onNext={nextStep} onPrev={prevStep} />
            )}

            {currentStep === 6 && (
              <ReviewStep
                form={form}
                onSubmit={onSubmit}
                onPrev={prevStep}
                isLoading={isPending}
                isEdit={true}
              />
            )}
          </form>
        </Form>
      </main>
    </div>
  );
};
