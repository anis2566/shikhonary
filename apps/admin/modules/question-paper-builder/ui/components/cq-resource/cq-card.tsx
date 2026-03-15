"use client";

import React from "react";
import { Check, HelpCircle, Image as ImageIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Badge } from "@workspace/ui/components/badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import type { CQResource } from "./types";

interface CQCardProps {
  cq: CQResource;
  isAssigned: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export const CQCard = ({
  cq,
  isAssigned,
  isSelected,
  onToggleSelect,
}: CQCardProps) => {
  const parts = [
    { label: "ক", question: cq.questionA, marks: 1 },
    { label: "খ", question: cq.questionB, marks: 2 },
    { label: "গ", question: cq.questionC, marks: 3 },
    { label: "ঘ", question: cq.questionD, marks: 4 },
  ];

  return (
    <div
      className={cn(
        "group relative flex flex-col transition-all duration-500 rounded-[2.5rem] overflow-hidden p-8 gap-6 border",
        isSelected
          ? "border-primary bg-primary/[0.03] shadow-glow shadow-primary/10 ring-1 ring-primary/20"
          : isAssigned
            ? "border-emerald-500/30 bg-emerald-500/[0.02] shadow-sm"
            : "border-border/50 bg-card/40 hover:bg-card hover:border-primary/30 hover:shadow-medium",
      )}
    >
      {/* Selection & Status */}
      <div
        className="absolute top-6 right-6 flex items-center gap-3 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(cq.id)}
          className="size-7 shadow-sm rounded-xl border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary hover:border-primary/50 transition-all cursor-pointer"
        />
        {isAssigned && (
          <div className="animate-in zoom-in duration-500">
            <div className="bg-emerald-500 text-white rounded-full p-1.5 shadow-glow shadow-emerald-500/20">
              <Check className="size-4 stroke-[3]" />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 space-y-6">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge
            variant="outline"
            className="rounded-xl px-3 py-1 text-[10px] font-black uppercase text-muted-foreground bg-muted/20 border-border/50"
          >
            {cq.chapter?.displayName || "General"}
          </Badge>
          <Badge
            variant="outline"
            className="rounded-xl px-3 py-1 text-[10px] font-black uppercase text-primary bg-primary/5 border-primary/20"
          >
            সৃজনশীল
          </Badge>
          {cq.attachments && cq.attachments.length > 0 && (
            <Badge
              variant="outline"
              className="rounded-xl px-3 py-1 text-[10px] font-black uppercase text-blue-500 bg-blue-500/5 border-blue-500/20 gap-1.5"
            >
              <ImageIcon className="size-3" />
              {cq.attachments.length} Attachment
            </Badge>
          )}
        </div>

        {/* Stem/Context */}
        <div className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
          <p className="text-sm font-medium leading-relaxed text-muted-foreground bg-primary/5 p-5 rounded-3xl border border-primary/10">
            {cq.context}
          </p>
        </div>

        {/* Sub-questions List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] pl-1">
            <HelpCircle className="size-4" />
            Questions
          </div>
          <div className="grid gap-2.5">
            {parts.map((part, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 bg-muted/20 backdrop-blur-sm rounded-2xl border border-border/30 group/part hover:bg-white hover:border-primary/20 transition-all duration-300"
              >
                <span className="size-8 flex-shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-black group-hover/part:bg-primary group-hover/part:text-white transition-all">
                  {part.label}
                </span>
                <div className="flex-1 space-y-1">
                  <p className="text-[13px] font-bold text-foreground leading-relaxed">
                    {part.question}
                  </p>
                  <div className="text-[10px] font-black text-muted-foreground/60 uppercase">
                    Marks: {part.marks}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer References */}
      {cq.reference && cq.reference.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-border/30">
          {cq.reference.map((ref, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="rounded-lg px-2.5 py-1 text-[10px] font-bold bg-amber-500/10 text-amber-700 border-amber-500/20"
            >
              {ref}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
