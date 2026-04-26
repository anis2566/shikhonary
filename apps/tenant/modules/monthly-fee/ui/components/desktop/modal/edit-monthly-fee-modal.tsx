"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useUpdateMonthlyFee } from "@workspace/api-client";
import { useEditMonthlyFeeModal } from "@workspace/ui/hooks/use-edit-monthly-fee-modal";
import { MonthlyFeeForm } from "./monthly-fee-form";
import { type MonthlyFeeFormValues } from "@workspace/schema";
import { CircleDollarSign } from "lucide-react";

export const EditMonthlyFeeModal = () => {
  const { isOpen, onClose, monthlyFeeId, initialData } = useEditMonthlyFeeModal();
  const updateMutation = useUpdateMonthlyFee();

  const onSubmit = async (values: MonthlyFeeFormValues) => {
    if (!monthlyFeeId) return;
    try {
      await updateMutation.mutateAsync({
        id: monthlyFeeId,
        ...values,
      });
      onClose();
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
        {/* Branded header strip */}
        <DialogHeader className="relative px-6 pt-6 pb-5 overflow-hidden">
          {/* Subtle background decoration */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-50 to-slate-50"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-6 -right-6 w-32 h-32 rounded-full bg-emerald-100/60 blur-2xl"
          />

          {/* Icon badge */}
          <div className="relative mb-3 w-fit">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/30">
              <CircleDollarSign className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <div className="relative">
            <DialogTitle className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">
              Edit Monthly Fee
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 font-medium mt-1.5 leading-relaxed">
              Updating fee record for the selected class and term
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Divider */}
        <div className="h-px bg-slate-100 mx-0" />

        {/* Form body */}
        <div className="px-6 py-5">
          {initialData && (
            <MonthlyFeeForm
              mode="edit"
              initialData={initialData}
              onSubmit={onSubmit}
              onCancel={onClose}
              isLoading={updateMutation.isPending}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
