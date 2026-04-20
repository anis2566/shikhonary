"use client";

import React from "react";
import { LayoutGrid, Loader2 } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { TenantTypes } from "@workspace/db";
import { BatchCard } from "./batch-card";

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
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="h-[280px] bg-white border-slate-100 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600/20" />
          </Card>
        ))}
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <Card className="col-span-full text-center py-20 text-slate-500 font-medium rounded-xl border-slate-100 border-dashed mt-4 bg-white">
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <LayoutGrid className="w-10 h-10 text-slate-200" />
          </div>
          <p className="text-lg text-slate-900 font-bold">
            No batches found
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Adjust your filters or add a new batch
          </p>
        </div>
      </Card>
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
