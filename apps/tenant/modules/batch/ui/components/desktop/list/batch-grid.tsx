"use client";

import React from "react";
import { LayoutGrid } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { TenantTypes } from "@workspace/db";
import { BatchCard } from "./batch-card";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface BatchWithRelations extends TenantTypes.Batch {
  academicYear: {
    name: string;
  };
  _count: {
    students: number;
  };
}

interface BatchGridProps {
  batches: BatchWithRelations[];
  isLoading: boolean;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export function BatchGrid({
  batches,
  isLoading,
  onToggleActive,
  onDelete,
}: BatchGridProps) {
  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden bg-white border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <Skeleton className="w-12 h-12 rounded-lg bg-slate-100/50" />
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded-lg bg-slate-100/50" />
                <Skeleton className="h-8 w-8 rounded-lg bg-slate-100/50" />
                <Skeleton className="h-8 w-8 rounded-lg bg-slate-100/50" />
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <Skeleton className="h-6 w-3/4 bg-slate-100/50" />
              <Skeleton className="h-4 w-1/2 bg-slate-100/50" />
            </div>
            <div className="flex gap-2 mb-6">
              <Skeleton className="h-6 w-20 rounded-full bg-slate-100/50" />
              <Skeleton className="h-6 w-24 rounded-full bg-slate-100/50" />
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-12 bg-slate-100/50" />
                <Skeleton className="h-3 w-10 bg-slate-100/50" />
              </div>
              <Skeleton className="h-2 w-full rounded-full bg-slate-100/50" />
            </div>
            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100/50" />
                ))}
              </div>
              <Skeleton className="h-6 w-16 rounded-md bg-slate-100/50" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
          <LayoutGrid size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            No batches found
          </h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
            There are no batches matching your criteria. Try adjusting your
            filters or add a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
      {batches.map((batch, i) => (
        <BatchCard
          key={batch.id}
          batch={batch}
          index={i}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
}
