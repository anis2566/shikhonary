"use client";

import React from "react";
import { LayoutGrid } from "lucide-react";
import { CounterCard } from "./counter-card";
import { MobilePagination } from "./mobile-pagination";
import { Header } from "./header";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface CounterWithRelations {
  id: string;
  value: number;
  academicYearId: string;
  academicClassId: string;
  className: string;
  academicYear: {
    name: string;
  };
}

interface MobileListProps {
  counters: CounterWithRelations[];
  isLoading: boolean;
  total: number;
  onDelete: (id: string, name: string) => void;
}

export const MobileList = ({
  counters,
  isLoading,
  total,
  onDelete,
}: MobileListProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Header />
        <div className="flex flex-col gap-6 p-6">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-24">
      <Header />

      <main className="px-6 py-8">
        {/* Counter Cards */}
        {counters.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-12 border-2 border-dashed border-surface-container flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
              <LayoutGrid size={32} />
            </div>
            <p className="text-on-surface-variant font-bold">
              No records found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {counters.map((counter, index) => (
              <div
                key={counter.id}
                className="animate-in fade-in zoom-in-95 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CounterCard counter={counter} onDelete={onDelete} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <MobilePagination total={total} />
      </main>
    </div>
  );
};
