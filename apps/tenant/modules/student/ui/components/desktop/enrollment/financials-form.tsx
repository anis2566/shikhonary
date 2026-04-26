"use client";

import React from "react";
import { StudentFormValues } from "@workspace/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  UseFormReturn,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import {
  Wallet,
  CircleDollarSign,
  CalendarCheck,
  CheckCircle2,
  Loader2,
  Save,
  Edit3,
  Lock,
} from "lucide-react";
import { useAdmissionFeeByYearClassId } from "@workspace/api-client";
import { useMonthlyFeeByYearClassId } from "@workspace/api-client";
import { FormActions } from "./form-actions";

interface FinancialsFormProps {
  form: UseFormReturn<StudentFormValues>;
  onNext: () => void;
  onPrev: () => void;
  isLoading?: boolean;
}

const FieldLabel = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <FormLabel className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
    <Icon className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
    {label}
  </FormLabel>
);

const inputClass =
  "h-11 px-4 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all placeholder:text-slate-400 placeholder:font-normal";

export const FinancialsForm = ({
  form,
  onNext,
  onPrev,
  isLoading,
}: FinancialsFormProps) => {
  const [isEditable, setIsEditable] = React.useState(false);
  const academicYearId = form.watch("academicYearId");
  const academicClassId = form.watch("academicClassId");

  const { data: admissionFee, isLoading: isAdmissionLoading } =
    useAdmissionFeeByYearClassId(academicYearId, academicClassId);
  const { data: monthlyFee, isLoading: isMonthlyLoading } =
    useMonthlyFeeByYearClassId(academicYearId, academicClassId);

  React.useEffect(() => {
    if (admissionFee !== undefined && !form.getValues("admissionFee")) {
      form.setValue("admissionFee", admissionFee);
    }
  }, [admissionFee, form]);

  React.useEffect(() => {
    if (monthlyFee !== undefined && !form.getValues("monthlyFee")) {
      form.setValue("monthlyFee", monthlyFee);
    }
  }, [monthlyFee, form]);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Financials Section */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 px-2">
            Fee Structure
          </span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsEditable(!isEditable)}
          className="h-9 px-4 rounded-2xl bg-emerald-50 text-[10px] font-black uppercase tracking-wider text-emerald-600 hover:bg-emerald-100 transition-all border border-emerald-100/50"
        >
          {isEditable ? (
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Fees</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Fees</span>
            </div>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Admission Fee */}
        <FormField
          control={form.control}
          name="admissionFee"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={CircleDollarSign} label="Admission Fee" />
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="0"
                    className={`${inputClass} ${
                      !isEditable
                        ? "opacity-75 cursor-not-allowed bg-slate-50"
                        : ""
                    }`}
                    disabled={!isEditable}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isAdmissionLoading && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                    )}
                    <span className="text-xs font-bold text-slate-400">
                      BDT
                    </span>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Monthly Fee */}
        <FormField
          control={form.control}
          name="monthlyFee"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={CalendarCheck} label="Monthly Tuition Fee" />
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="0"
                    className={`${inputClass} ${
                      !isEditable
                        ? "opacity-75 cursor-not-allowed bg-slate-50"
                        : ""
                    }`}
                    disabled={!isEditable}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isMonthlyLoading && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                    )}
                    <span className="text-xs font-bold text-slate-400">
                      BDT
                    </span>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />
      </div>

      {/* Account Status Section */}
      <div className="flex items-center gap-2 mt-4">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 px-2">
          Account Status
        </span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Active Enrollment
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Student will be able to access the portal and participate in
            classes.
          </p>
        </div>
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Final Summary Alert */}
      <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-3xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <Wallet className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-black text-emerald-900 uppercase tracking-wider">
            Ready to Finish
          </h4>
          <p className="text-xs text-emerald-700/70 font-medium leading-relaxed">
            Please review all information before submitting. Once enrolled, the
            student will be assigned to the selected batch and academic year.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 mt-2" />

      {/* Actions */}
      <FormActions
        onPrev={onPrev}
        onNext={onNext}
        isLoading={isLoading}
        prevLabel="Back to Contact"
        nextLabel="Complete Enrollment"
        nextIcon={Save}
        loadingLabel="Registering..."
      />
    </div>
  );
};
