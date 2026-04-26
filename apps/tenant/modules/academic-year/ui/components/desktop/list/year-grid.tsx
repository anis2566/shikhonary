"use client";

import React from "react";
import { LayoutGrid } from "lucide-react";
import { Card } from "@workspace/ui/components/card";

import { TenantTypes } from "@workspace/db";
import { AcademicYearCard } from "./card";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface AcademicYearWithRelations extends TenantTypes.AcademicYear {
  _count: {
    students: number;
    batches: number;
  };
}

interface YearGridProps {
  academicYears: AcademicYearWithRelations[];
  isLoading: boolean;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export function YearGrid({
  academicYears,
  isLoading,
  onToggleActive,
  onDelete,
}: YearGridProps) {
  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden bg-white border-slate-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-11 h-11 rounded-xl bg-slate-100/50" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24 bg-slate-100/50" />
                  <Skeleton className="h-4 w-32 bg-slate-100/50" />
                </div>
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded-lg bg-slate-100/50" />
                <Skeleton className="h-8 w-8 rounded-lg bg-slate-100/50" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Skeleton className="h-16 rounded-lg bg-slate-100/50" />
              <Skeleton className="h-16 rounded-lg bg-slate-100/50" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full bg-slate-100/50" />
              <Skeleton className="h-3 w-20 bg-slate-100/50" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (academicYears.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
          <LayoutGrid size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            No academic years found
          </h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
            There are no academic years matching your criteria. Try adjusting
            your filters or add a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {academicYears.map((ay, i) => (
        <AcademicYearCard
          key={ay.id}
          year={ay}
          index={i}
          onDelete={(id, name) => onDelete(id, name)}
          onToggleActive={(id) => onToggleActive(id)}
        />
      ))}
    </div>
  );
}
