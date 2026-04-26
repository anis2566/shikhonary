import React from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "./header";
import { TenantTypes } from "@workspace/db";
import { YearCard } from "./card";
import { Card } from "@workspace/ui/components/card";
import { Calendar } from "lucide-react";
import { Pagination } from "../../desktop/list/pagination";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface AcademicYearWithRelations extends TenantTypes.AcademicYear {
  _count: {
    students: number;
    batches: number;
  };
}

interface MobileListProps {
  isLoading: boolean;
  academicYears: AcademicYearWithRelations[];
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export const MobileList = ({
  isLoading,
  academicYears,
  onToggleActive,
  onDelete,
}: MobileListProps) => {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-grow px-6 py-4 flex flex-col gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="bg-surface-container-lowest rounded-2xl p-5 shadow-ambient relative overflow-hidden border border-outline-variant/10 space-y-4"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100/50"></div>
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex gap-2">
                      <Skeleton className="h-7 w-24 bg-slate-100/50" />
                      <Skeleton className="h-5 w-16 rounded-full bg-slate-100/50" />
                    </div>
                    <Skeleton className="h-4 w-1/2 bg-slate-100/50" />
                  </div>
                  <div className="text-right space-y-1">
                    <Skeleton className="h-3 w-12 bg-slate-100/50 ml-auto" />
                    <Skeleton className="h-6 w-10 bg-slate-100/50 ml-auto" />
                  </div>
                </div>

                <Skeleton className="h-1.5 w-full rounded-full bg-slate-100/50" />

                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-14 rounded-xl bg-slate-100/50" />
                  <Skeleton className="h-14 rounded-xl bg-slate-100/50" />
                </div>

                <div className="flex gap-2 bg-slate-50/50 rounded-xl p-1">
                  <Skeleton className="h-9 flex-1 rounded-lg bg-slate-100/50" />
                  <div className="flex gap-1">
                    <Skeleton className="h-9 w-9 rounded-lg bg-slate-100/50" />
                    <Skeleton className="h-9 w-9 rounded-lg bg-slate-100/50" />
                    <Skeleton className="h-9 w-9 rounded-lg bg-slate-100/50" />
                  </div>
                </div>
              </div>
            ))
          ) : academicYears.length > 0 ? (
            academicYears.map((ay, i) => (
              <YearCard
                key={ay.id}
                ay={ay}
                index={i}
                onToggleActive={onToggleActive}
                onDelete={onDelete}
              />
            ))
          ) : (
            <Card className="text-center py-20 text-on-surface-variant/40 font-medium rounded-3xl border-outline-variant/10 bg-surface-container-lowest shadow-ambient">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center text-outline-variant/40">
                  <Calendar className="w-10 h-10" />
                </div>
                <p className="text-lg text-on-surface font-bold tracking-tight">
                  No results found
                </p>
              </div>
            </Card>
          )}
        </AnimatePresence>
      </main>

      <Pagination total={academicYears.length} />
    </div>
  );
};
