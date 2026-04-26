"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, useForm, zodResolver } from "@workspace/ui/components/form";
import { useCreateStudent } from "@workspace/api-client";
import {
  studentFormSchema,
  type StudentFormValues,
  defaultStudentValues,
} from "@workspace/schema";
import {
  EnrollmentHeader,
  EnrollmentStepper,
  SetupForm,
  PersonalProfileForm,
  AcademicPlacementForm,
  GuardiansContactForm,
  FinancialsForm,
  ReviewStep,
} from "../components/desktop/enrollment";
import { studentFormSteps } from "../components/desktop/form/steps";

export const EnrollmentView = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { mutate: createStudent, isPending } = useCreateStudent();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: defaultStudentValues as StudentFormValues,
    mode: "onChange",
  });

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
      await createStudent(values);
      router.push("/students");
    } catch (error: unknown) {
      // Error is handled in the hook's onError
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 py-10 px-4 md:px-8 min-h-screen">
      {/* Header */}
      <EnrollmentHeader />

      {/* Stepper */}
      <EnrollmentStepper steps={studentFormSteps} currentStep={currentStep} />

      {/* Main Content Area */}
      <main className="w-full bg-surface-container-lowest rounded-[24px] p-8 md:p-12 shadow-soft relative overflow-hidden border border-emerald-500/5 animate-fade-in [animation-delay:300ms]">
        {/* Decorative Element */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <Form {...form}>
          <form className="relative z-10">
            {currentStep === 1 && <SetupForm form={form} onNext={nextStep} />}

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
              />
            )}
          </form>
        </Form>
      </main>
    </div>
  );
};
