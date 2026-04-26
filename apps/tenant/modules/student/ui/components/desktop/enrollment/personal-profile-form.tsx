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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  User,
  Mail,
  Calendar,
  Baby,
  Droplets,
  Flag,
  Globe,
  Camera,
  CalendarIcon,
} from "lucide-react";
import { FormActions } from "./form-actions";
import { format } from "date-fns";
import { cn } from "@workspace/ui/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Calendar as CalendarComponent } from "@workspace/ui/components/calendar";
import {
  genderOptions,
  bloodGroupOptions,
  religionOptions,
  nationalityOptions,
} from "@workspace/utils/constants";

interface PersonalProfileFormProps {
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

const triggerClass =
  "w-full h-11 px-4 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all shadow-none";

const contentClass = "rounded-2xl border-slate-100 shadow-xl";

export const PersonalProfileForm = ({
  form,
  onNext,
  onPrev,
  isLoading,
}: PersonalProfileFormProps) => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Section label */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 px-2">
          Personal Information
        </span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={User} label="Full Name" />
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter student's full name"
                  className="h-11 px-4 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all placeholder:text-slate-400 placeholder:font-normal"
                />
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={Mail} label="Email Address" />
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  value={field.value || ""}
                  placeholder="email@example.com (optional)"
                  className="h-11 px-4 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all placeholder:text-slate-400 placeholder:font-normal"
                />
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Date of Birth */}
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={Calendar} label="Date of Birth" />
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        triggerClass,
                        "justify-start text-left font-normal",
                        !field.value && "text-slate-400",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={Baby} label="Gender" />
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    <SelectValue placeholder="Select gender…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={contentClass}>
                  {genderOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-sm font-medium rounded-xl"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Blood Group */}
        <FormField
          control={form.control}
          name="bloodGroup"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={Droplets} label="Blood Group" />
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    <SelectValue placeholder="Select blood group…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={contentClass}>
                  {bloodGroupOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-sm font-medium rounded-xl"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Religion */}
        <FormField
          control={form.control}
          name="religion"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={Globe} label="Religion" />
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    <SelectValue placeholder="Select religion…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={contentClass}>
                  {religionOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-sm font-medium rounded-xl"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Nationality */}
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={Flag} label="Nationality" />
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    <SelectValue placeholder="Select nationality…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={contentClass}>
                  {nationalityOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-sm font-medium rounded-xl"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />

        {/* Image URL / Photo Upload (Simplified) */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FieldLabel icon={Camera} label="Profile Photo" />
              <FormControl>
                <div className="flex items-center gap-4 h-11">
                  <div className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-400 italic flex items-center">
                    Upload system coming soon...
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 px-4 rounded-2xl border-slate-100 text-slate-400 hover:bg-slate-50"
                  >
                    Browse
                  </Button>
                </div>
              </FormControl>
              <FormMessage className="text-[11px] font-bold text-rose-500" />
            </FormItem>
          )}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 mt-4" />

      {/* Actions */}
      <FormActions
        onPrev={onPrev}
        onNext={onNext}
        isLoading={isLoading}
        prevLabel="Back to Setup"
        loadingLabel="Validating..."
      />
    </div>
  );
};
