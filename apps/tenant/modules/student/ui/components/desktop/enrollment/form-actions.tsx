"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface FormActionsProps {
  onPrev?: () => void;
  onNext: () => void;
  isLoading?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  nextIcon?: React.ElementType;
  prevIcon?: React.ElementType;
  loadingLabel?: string;
  disabled?: boolean;
  showPrev?: boolean;
  className?: string;
}

export const FormActions = ({
  onPrev,
  onNext,
  isLoading,
  prevLabel = "Back",
  nextLabel = "Continue",
  nextIcon: NextIcon = ArrowRight,
  prevIcon: PrevIcon = ArrowLeft,
  loadingLabel = "Processing...",
  disabled,
  showPrev = true,
  className,
}: FormActionsProps) => {
  return (
    <div className={`flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 ${className}`}>
      {showPrev && onPrev ? (
        <Button
          type="button"
          variant="ghost"
          onClick={onPrev}
          className="flex items-center justify-center gap-1.5 h-11 px-5 rounded-2xl text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 bg-slate-50 border-none transition-all"
        >
          <PrevIcon className="w-4 h-4" />
          {prevLabel}
        </Button>
      ) : (
        <div className="flex-1 hidden sm:block" />
      )}

      <Button
        type="button"
        onClick={onNext}
        disabled={isLoading || disabled}
        className="group flex items-center justify-center gap-2 h-11 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm border-none shadow-md shadow-emerald-500/25 active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{loadingLabel}</span>
          </>
        ) : (
          <>
            <span>{nextLabel}</span>
            <NextIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </Button>
    </div>
  );
};
