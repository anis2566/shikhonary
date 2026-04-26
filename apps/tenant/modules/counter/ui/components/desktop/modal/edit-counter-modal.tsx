"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useUpdateCounter } from "@workspace/api-client";
import { useEditCounterModal } from "@workspace/ui/hooks/use-edit-counter-modal";
import { CounterForm } from "./counter-form";
import { type CounterFormValues } from "@workspace/schema";

export const EditCounterModal = () => {
  const { isOpen, onClose, counterId, initialData } = useEditCounterModal();
  const updateMutation = useUpdateCounter();

  const onSubmit = async (values: CounterFormValues) => {
    if (!counterId) return;
    try {
      await updateMutation.mutateAsync({
        id: counterId,
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
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden
              >
                <rect x="2" y="4" width="2" height="10" rx="1" fill="white" />
                <rect x="6" y="4" width="2" height="10" rx="1" fill="white" />
                <rect x="10" y="4" width="2" height="10" rx="1" fill="white" />
                <rect
                  x="14"
                  y="4"
                  width="2"
                  height="10"
                  rx="1"
                  fill="white"
                  opacity="0.4"
                />
                <line
                  x1="1"
                  y1="13"
                  x2="16"
                  y2="5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <DialogTitle className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">
              Edit Counter
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 font-medium mt-1.5 leading-relaxed">
              Updating record for{" "}
              <span className="text-emerald-600 font-bold">
                {initialData?.name || "Academic Term"}
              </span>
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Divider */}
        <div className="h-px bg-slate-100 mx-0" />

        {/* Form body */}
        <div className="px-6 py-5">
          {initialData && (
            <CounterForm
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
