"use client";

import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface EnrollmentStepperProps {
  steps: Step[];
  currentStep: number;
}

export const EnrollmentStepper = ({
  steps,
  currentStep,
}: EnrollmentStepperProps) => {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <>
      {/* ── MOBILE: vertical pill list ─────────────────────────────────── */}
      <div className="flex md:hidden flex-col gap-0 animate-fade-in [animation-delay:100ms]">
        {steps.map((step, i) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isLast = i === steps.length - 1;

          return (
            <div key={step.id} className="flex gap-3">
              {/* Left: circle + connector */}
              <div className="flex flex-col items-center">
                {/* Step circle */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs ring-2 ring-background transition-all duration-300 z-10",
                    isActive
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-110"
                      : isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-400",
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  ) : (
                    step.id
                  )}
                </div>
                {/* Vertical connector */}
                {!isLast && (
                  <div className="w-0.5 flex-1 my-1 rounded-full overflow-hidden bg-slate-100">
                    <div
                      className={cn(
                        "w-full transition-all duration-500",
                        isCompleted ? "h-full bg-emerald-400" : "h-0",
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Right: text */}
              <div className={cn("pb-5 min-w-0", isLast && "pb-0")}>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-bold leading-none transition-colors duration-200",
                      isActive
                        ? "text-emerald-600"
                        : isCompleted
                          ? "text-slate-700"
                          : "text-slate-400",
                    )}
                  >
                    {step.title}
                  </span>
                  {isActive && (
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-wider">
                      Now
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                      Done
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-snug">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DESKTOP: horizontal stepper ────────────────────────────────── */}
      <div className="hidden md:block w-full animate-fade-in [animation-delay:100ms]">
        {/* Progress track */}
        <div className="relative flex items-center justify-between mb-8">
          {/* Base track */}
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-slate-100 rounded-full" />
          {/* Active track */}
          <div
            className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-emerald-500 rounded-full transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(16,185,129,0.4)]"
            style={{ width: `${progressPercentage}%` }}
          />

          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center gap-2.5"
              >
                {/* Circle */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-background transition-all duration-300",
                    isActive
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110"
                      : isCompleted
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-200",
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4.5 h-4.5" strokeWidth={3} />
                  ) : (
                    step.id
                  )}
                </div>

                {/* Label below */}
                <div className="flex flex-col items-center gap-0.5 absolute -bottom-9 whitespace-nowrap">
                  <span
                    className={cn(
                      "text-xs font-bold transition-colors duration-200",
                      isActive
                        ? "text-emerald-600"
                        : isCompleted
                          ? "text-slate-600"
                          : "text-slate-400",
                    )}
                  >
                    {step.title}
                  </span>
                  {isActive && (
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider animate-in fade-in slide-in-from-top-1 duration-200">
                      Current
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Spacer for the labels below */}
        <div className="h-8" />
      </div>
    </>
  );
};
