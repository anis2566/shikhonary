"use client";

import React from "react";
import { CircleDollarSign } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { MonthlyFeeCard } from "./monthly-fee-card";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface MonthlyFeeWithRelations {
  id: string;
  amount: number;
  className: string;
  academicYearId: string;
  academicClassId: string;
  academicYear: {
    name: string;
  };
}

interface MonthlyFeeGridProps {
  monthlyFees: MonthlyFeeWithRelations[];
  isLoading: boolean;
  onDelete: (id: string, name: string) => void;
}

export function MonthlyFeeGrid({
  monthlyFees,
  isLoading,
  onDelete,
}: MonthlyFeeGridProps) {
  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden bg-white border-slate-100 shadow-sm p-5">
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="w-10 h-10 rounded-xl bg-slate-100/50" />
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded-lg bg-slate-100/50" />
                <Skeleton className="h-8 w-8 rounded-lg bg-slate-100/50" />
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <Skeleton className="h-7 w-1/4 bg-slate-100/50" />
              <Skeleton className="h-3 w-1/2 bg-slate-100/50" />
            </div>
            <div className="space-y-2 mb-4">
              <Skeleton className="h-14 rounded-xl bg-slate-100/50" />
              <Skeleton className="h-14 rounded-xl bg-slate-100/50" />
            </div>
            <div className="pt-3 border-t border-slate-50">
              <Skeleton className="h-3 w-full bg-slate-100/50" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (monthlyFees.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
          <CircleDollarSign size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            No fees found
          </h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
            There are no monthly fees matching your criteria. Try adjusting your
            filters or add a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
      {monthlyFees.map((fee, i) => (
        <MonthlyFeeCard
          key={fee.id}
          fee={fee}
          index={i}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
