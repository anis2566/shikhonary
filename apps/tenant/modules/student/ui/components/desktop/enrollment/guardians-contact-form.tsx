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
import { Textarea } from "@workspace/ui/components/textarea";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { User, Phone, PhoneCall, MapPin, Home, Heart } from "lucide-react";
import { FormActions } from "./form-actions";

interface GuardiansContactFormProps {
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

const textareaClass =
  "min-h-[100px] px-4 py-3 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all placeholder:text-slate-400 placeholder:font-normal resize-none";

export const GuardiansContactForm = ({
  form,
  onNext,
  onPrev,
  isLoading,
}: GuardiansContactFormProps) => {
  const presentAddress = form.watch("presentAddress");

  const handleSameAsPresent = (checked: boolean) => {
    if (checked) {
      form.setValue("permanentAddress", presentAddress);
    } else {
      form.setValue("permanentAddress", "");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Guardians Section */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 px-2">
          Guardian Details
        </span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Father's Name */}
        <FormField
          control={form.control}
          name="fatherName"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={User} label="Father's Name" />
              <FormControl>
                <Input
                  {...field}
                  placeholder="Full name of father"
                  className={inputClass}
                />
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Mother's Name */}
        <FormField
          control={form.control}
          name="motherName"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={Heart} label="Mother's Name" />
              <FormControl>
                <Input
                  {...field}
                  placeholder="Full name of mother"
                  className={inputClass}
                />
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Primary Phone */}
        <FormField
          control={form.control}
          name="primaryPhone"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={Phone} label="Primary Phone" />
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    maxLength={11}
                    placeholder="017XXXXXXXX"
                    className={inputClass}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">
                    Required
                  </span>
                </div>
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Secondary Phone */}
        <FormField
          control={form.control}
          name="secondaryPhone"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={PhoneCall} label="Secondary Phone" />
              <FormControl>
                <Input
                  {...field}
                  maxLength={11}
                  value={field.value || ""}
                  placeholder="Emergency contact (optional)"
                  className={inputClass}
                />
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />
      </div>

      {/* Address Section */}
      <div className="flex items-center gap-2 mt-2">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 px-2">
          Contact Addresses
        </span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Present Address */}
        <FormField
          control={form.control}
          name="presentAddress"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={MapPin} label="Present Address" />
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="House, Road, Area, City..."
                  className={textareaClass}
                />
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Permanent Address */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <FieldLabel icon={Home} label="Permanent Address" />
            <div className="flex items-center gap-2 px-1">
              <Checkbox
                id="same-as-present"
                onCheckedChange={(checked) => handleSameAsPresent(!!checked)}
                className="w-3.5 h-3.5 border-slate-200 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              />
              <label
                htmlFor="same-as-present"
                className="text-[10px] font-bold text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
              >
                Same as present
              </label>
            </div>
          </div>
          <FormField
            control={form.control}
            name="permanentAddress"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Full permanent village/city address..."
                    className={textareaClass}
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 mt-4" />

      {/* Actions */}
      <FormActions
        onPrev={onPrev}
        onNext={onNext}
        isLoading={isLoading}
        prevLabel="Back to Academic"
        loadingLabel="Validating..."
      />
    </div>
  );
};
