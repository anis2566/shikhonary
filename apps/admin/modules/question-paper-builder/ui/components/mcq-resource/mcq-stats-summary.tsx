"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface MCQStatsSummaryProps {
  targetCount: number;
  selectedCount: number;
  leftCount: number;
}

export const MCQStatsSummary = ({
  targetCount,
  selectedCount,
  leftCount,
}: MCQStatsSummaryProps) => {
  return (
    <div className="px-2 sticky top-0 z-30 bg-background/95 backdrop-blur-md">
      <div className="bg-card/40 border border-border/50 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">
              Required Questions
            </span>
            <span className="text-xl font-black text-foreground">
              {targetCount}
            </span>
          </div>

          <div className="h-8 w-[1px] bg-border/50" />

          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-emerald-600/70 tracking-wider">
              Currently Selected
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-emerald-600">
                {selectedCount}
              </span>
              {selectedCount >= targetCount && (
                <div className="bg-emerald-500/10 text-emerald-600 p-0.5 rounded-full">
                  <Check className="size-3 stroke-[4]" />
                </div>
              )}
            </div>
          </div>

          <div className="h-8 w-[1px] bg-border/50" />

          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-amber-600/70 tracking-wider">
              Remaining to Pick
            </span>
            <span
              className={cn(
                "text-xl font-black",
                leftCount === 0 ? "text-muted-foreground/40" : "text-amber-600",
              )}
            >
              {leftCount}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full animate-pulse bg-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Live Breakdown
          </span>
        </div>
      </div>
    </div>
  );
};
