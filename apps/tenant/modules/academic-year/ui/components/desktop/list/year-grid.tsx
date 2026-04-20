"use client";

import React from "react";
import { LayoutGrid } from "lucide-react";
import { Card } from "@workspace/ui/components/card";

import { TenantTypes } from "@workspace/db";
import { AcademicYearCard } from "./card";

interface AcademicYearWithRelations extends TenantTypes.AcademicYear {
  _count: {
    students: number;
    batches: number;
  };
}

interface YearGridProps {
  academicYears: AcademicYearWithRelations[];
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export function YearGrid({
  academicYears,
  onToggleActive,
  onDelete,
}: YearGridProps) {
  if (academicYears.length === 0) {
    return (
      <Card className="col-span-full text-center py-16 text-slate-500 font-medium rounded-xl border-slate-100 mt-4">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <LayoutGrid className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-base text-slate-900 font-bold">
            No academic years found
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Adjust your filters or add a new year
          </p>
        </div>
      </Card>
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
