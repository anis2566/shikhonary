"use client";

import React from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface CQBulkActionsProps {
  selectedCount: number;
  isBulkLoading: boolean;
  onBulkAction: (action: "add" | "remove") => void;
  onClearSelection: () => void;
}

export const CQBulkActions = ({
  selectedCount,
  isBulkLoading,
  onBulkAction,
  onClearSelection,
}: CQBulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky bottom-0 z-50 mt-auto -mx-4 lg:-mx-8 px-4 lg:px-8 py-5 bg-background/90 backdrop-blur-xl border-t border-border/10 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="bg-card/40 border border-primary/20 px-8 py-4 rounded-[2rem] shadow-glow shadow-primary/5 flex-1 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">
              Currently Selected
            </span>
            <span className="text-2xl font-black text-primary tabular-nums">
              {selectedCount.toString().padStart(2, "0")}{" "}
              <span className="text-xs font-bold text-muted-foreground ml-1">
                Items
              </span>
            </span>
          </div>

          <div className="h-10 w-[1px] bg-border/50" />

          <div className="flex items-center gap-3">
            <Button
              variant="default"
              size="lg"
              disabled={isBulkLoading}
              onClick={() => onBulkAction("add")}
              className="h-12 rounded-2xl px-8 font-black text-xs uppercase tracking-widest shadow-glow active:scale-[0.98] transition-transform"
            >
              {isBulkLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Plus className="size-4 mr-2 stroke-[3]" /> Add to Paper
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              disabled={isBulkLoading}
              onClick={() => onBulkAction("remove")}
              className="h-12 rounded-2xl px-8 font-black text-xs uppercase tracking-widest border-destructive/20 text-destructive hover:bg-destructive/5 hover:border-destructive/30 active:scale-[0.98] transition-transform"
            >
              {isBulkLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <X className="size-4 mr-2 stroke-[3]" /> Remove All
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onClearSelection}
            className="h-12 px-6 rounded-2xl font-bold text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            Clear Selection
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onClearSelection}
            className="size-12 rounded-2xl hover:bg-muted/50 border-border/50"
          >
            <X className="size-5" />
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};
