"use client";

import React from "react";
import { Check, MessageSquare } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Badge } from "@workspace/ui/components/badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import type { MCQ } from "./types";

interface MCQCardProps {
  mcq: MCQ;
  isAssigned: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export const MCQCard = ({
  mcq,
  isAssigned,
  isSelected,
  onToggleSelect,
}: MCQCardProps) => {
  return (
    <div
      className={cn(
        "group relative flex flex-col transition-all duration-500 rounded-[2rem] overflow-hidden p-6 gap-4 border",
        isSelected
          ? "border-primary bg-primary/[0.03] shadow-glow shadow-primary/10 ring-1 ring-primary/20"
          : isAssigned
            ? "border-emerald-500/30 bg-emerald-500/[0.02] shadow-sm"
            : "border-border/50 bg-card/40 hover:bg-card hover:border-primary/30 hover:shadow-medium",
      )}
    >
      {/* Status Indicator & Checkbox */}
      <div
        className="absolute top-4 right-4 flex items-center gap-2 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center mr-1">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(mcq.id)}
            className="size-6 shadow-sm rounded-md border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary hover:border-primary/50 transition-colors cursor-pointer"
          />
        </div>
        {isAssigned && (
          <div className="animate-in zoom-in duration-500">
            <div className="bg-emerald-500 text-white rounded-full p-1 shadow-glow shadow-emerald-500/20">
              <Check className="size-4 stroke-[3]" />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-lg px-2 py-0.5 text-[10px] font-black uppercase text-muted-foreground bg-muted/20 border-border/50"
          >
            {mcq.chapter?.displayName || "General"}
          </Badge>
          <Badge
            variant="outline"
            className="rounded-lg px-2 py-0.5 text-[10px] font-black uppercase text-primary bg-primary/5 border-primary/20"
          >
            {mcq.type}
          </Badge>
        </div>

        {mcq.context && (
          <p className="text-xs font-medium text-muted-foreground/70 italic line-clamp-2 bg-muted/30 p-2 rounded-xl">
            {mcq.context}
          </p>
        )}

        <p className="font-bold text-sm leading-relaxed text-foreground group-hover:text-primary transition-colors">
          {mcq.question}
        </p>

        {/* Statements */}
        {mcq.statements && mcq.statements.length > 0 && (
          <div className="space-y-1.5 mt-2">
            <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest pl-1">
              <MessageSquare className="size-3" />
              Statements
            </div>
            <div className="space-y-1">
              {mcq.statements.map((statement, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-[11px] p-2 bg-muted/20 backdrop-blur-sm rounded-xl border border-border/30"
                >
                  <span className="font-black text-primary/70 text-[10px] mt-0.5 min-w-[1.25rem]">
                    {['i', 'ii', 'iii', 'iv', 'v'][idx]}.
                  </span>
                  <span className="leading-relaxed text-muted-foreground/80 font-medium">
                    {statement}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2">
          {mcq.options.slice(0, 5).map((opt, i) => {
            const isCorrect = opt === mcq.answer || String.fromCharCode(65 + i) === mcq.answer;
            const bengaliLabels = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];
            
            return (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-300",
                  isCorrect 
                    ? "bg-primary/10 border-primary/30 ring-1 ring-primary/20 shadow-sm" 
                    : "bg-muted/20 border-border/30"
                )}
              >
                <span className={cn(
                  "size-6 flex-shrink-0 rounded-full flex items-center justify-center text-[10px] font-black transition-colors",
                  isCorrect ? "bg-primary text-white" : "bg-primary/10 text-primary"
                )}>
                  {bengaliLabels[i]}
                </span>
                <span className={cn(
                  "text-[11px] font-bold truncate flex-1",
                  isCorrect ? "text-primary" : "text-muted-foreground"
                )}>
                  {opt}
                </span>
                {isCorrect && <Check className="size-3 text-primary stroke-[4]" />}
              </div>
            );
          })}
        </div>
      </div>

      {mcq.reference && mcq.reference.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-1 line-clamp-2 overflow-hidden max-h-[48px]">
          {mcq.reference.map((ref, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="rounded-lg px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-700 border-amber-500/20 whitespace-nowrap"
            >
              {ref}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
