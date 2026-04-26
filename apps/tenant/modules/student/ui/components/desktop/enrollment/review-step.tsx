"use client";

import React from "react";
import { StudentFormValues } from "@workspace/schema";
import { UseFormReturn } from "@workspace/ui/components/form";
import {
  User,
  School,
  Phone,
  Wallet,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { FormActions } from "./form-actions";
import {
  useAcademicClassesForSelection,
  useAcademicYearsForSelection,
  useBatchByYearClassId,
} from "@workspace/api-client";
import { format } from "date-fns";

interface ReviewStepProps {
  form: UseFormReturn<StudentFormValues>;
  onSubmit: (values: StudentFormValues) => void;
  onPrev: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

const ReviewSection = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-4 p-6 bg-slate-50/50 rounded-[24px] border border-slate-100 hover:border-emerald-100 transition-colors group">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
        <Icon className="w-4 h-4 text-emerald-600" />
      </div>
      <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
        {title}
      </h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
      {children}
    </div>
  </div>
);

const ReviewItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
      {label}
    </span>
    <span className="text-sm font-semibold text-slate-700">
      {typeof value === "boolean"
        ? value
          ? "Active"
          : "Inactive"
        : value || "—"}
    </span>
  </div>
);

export const ReviewStep = ({
  form,
  onSubmit,
  onPrev,
  isLoading,
  isEdit,
}: ReviewStepProps) => {
  const values = form.getValues();

  const { data: years } = useAcademicYearsForSelection();
  const { data: classes } = useAcademicClassesForSelection();
  const { data: batches } = useBatchByYearClassId(
    values.academicYearId,
    values.academicClassId,
  );

  const yearName =
    years?.find((y) => y.id === values.academicYearId)?.name ||
    values.academicYearId;
  const className =
    classes?.find((c) => c.id === values.academicClassId)?.displayName ||
    values.academicClassId;
  const batchName =
    batches?.find((b) => b.id === values.batchId)?.name ||
    (values.batchId ? "No Batch" : "—");

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Introduction */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-emerald-600">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="text-lg font-bold">
            {isEdit ? "Review Changes" : "Review Enrollment Details"}
          </h2>
        </div>
        <p className="text-sm text-slate-500 font-medium">
          {isEdit
            ? "Please verify the updated information before saving the changes."
            : "Please verify the information below before finalizing the student's registration."}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Identity & Placement */}
        <ReviewSection icon={School} title="Academic Identity">
          <ReviewItem label="Student ID" value={values.studentId} />
          <ReviewItem label="Full Name" value={values.name} />
          <ReviewItem label="Academic Year" value={yearName} />
          <ReviewItem label="Class" value={className} />
          <ReviewItem label="Batch" value={batchName} />
          <ReviewItem label="Roll Number" value={values.roll} />
        </ReviewSection>

        {/* Personal Details */}
        <ReviewSection icon={User} title="Personal Details">
          <ReviewItem label="Email" value={values.email} />
          <ReviewItem
            label="Date of Birth"
            value={values.dateOfBirth ? format(new Date(values.dateOfBirth), "PPP") : "—"}
          />
          <ReviewItem label="Gender" value={values.gender} />
          <ReviewItem label="Religion" value={values.religion} />
          <ReviewItem label="Nationality" value={values.nationality} />
          <ReviewItem label="Blood Group" value={values.bloodGroup} />
        </ReviewSection>

        {/* Academic Placement */}
        <ReviewSection icon={CheckCircle2} title="Academic Placement">
          <ReviewItem label="Previous Institute" value={values.institute} />
          <ReviewItem label="Academic Group" value={values.group} />
          <ReviewItem label="Shift" value={values.shift} />
          <ReviewItem label="Section" value={values.section} />
        </ReviewSection>

        {/* Contact & Guardians */}
        <ReviewSection icon={Phone} title="Guardians & Contact">
          <ReviewItem label="Father's Name" value={values.fatherName} />
          <ReviewItem label="Mother's Name" value={values.motherName} />
          <ReviewItem label="Primary Phone" value={values.primaryPhone} />
          <ReviewItem label="Secondary Phone" value={values.secondaryPhone} />
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReviewItem label="Present Address" value={values.presentAddress} />
            <ReviewItem
              label="Permanent Address"
              value={values.permanentAddress}
            />
          </div>
        </ReviewSection>

        {/* Financials */}
        <ReviewSection icon={Wallet} title="Financials & Status">
          <ReviewItem
            label="Admission Fee"
            value={`${values.admissionFee} BDT`}
          />
          <ReviewItem label="Monthly Fee" value={`${values.monthlyFee} BDT`} />
          <ReviewItem label="Status" value={values.isActive} />
        </ReviewSection>
      </div>

      {/* Actions */}
      <FormActions
        onPrev={onPrev}
        onNext={form.handleSubmit(onSubmit)}
        isLoading={isLoading}
        prevLabel="Edit Information"
        nextLabel={isEdit ? "Save All Changes" : "Confirm & Enroll Student"}
        nextIcon={CheckCircle2}
        loadingLabel={isEdit ? "Saving..." : "Registering..."}
        className="mt-4"
      />
    </div>
  );
};
