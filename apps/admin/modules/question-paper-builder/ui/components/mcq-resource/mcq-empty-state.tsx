"use client";

import React from "react";
import { LayoutGrid } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface MCQEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export const MCQEmptyState = ({
  hasFilters,
  onClearFilters,
}: MCQEmptyStateProps) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4">
      <div className="size-20 bg-muted/30 rounded-[2rem] flex items-center justify-center mb-6 border border-dashed border-border">
        <LayoutGrid className="size-10 text-muted-foreground/40" />
      </div>
      <h3 className="text-2xl font-black text-foreground">No Questions Found</h3>
      <p className="text-muted-foreground max-w-xs mt-2 font-medium">
        Try adjusting your search or filters to find what you&apos;re looking
        for.
      </p>
      {hasFilters && (
        <Button variant="link" onClick={onClearFilters} className="mt-4 font-bold">
          Clear all filters
        </Button>
      )}
    </div>
  );
};
