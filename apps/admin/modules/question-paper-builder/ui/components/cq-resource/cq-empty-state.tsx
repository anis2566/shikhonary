"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface CQEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export const CQEmptyState = ({
  hasFilters,
  onClearFilters,
}: CQEmptyStateProps) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center animate-in fade-in slide-in-from-bottom-4">
      <div className="size-24 bg-muted/30 rounded-[2.5rem] flex items-center justify-center mb-6 border border-dashed border-border">
        <HelpCircle className="size-12 text-muted-foreground/40" />
      </div>
      <h3 className="text-3xl font-black text-foreground">No Creative Questions</h3>
      <p className="text-muted-foreground max-w-sm mt-3 font-medium text-lg leading-relaxed">
        We couldn&apos;t find any creative questions matching your current filters or search term.
      </p>
      {hasFilters && (
        <Button 
          variant="outline" 
          onClick={onClearFilters} 
          className="mt-8 rounded-2xl px-8 h-12 font-black text-xs uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5 transition-all"
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
};
