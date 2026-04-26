"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "./header";
import { Stats } from "./stats";
import { StudentCard } from "./card";
import { Pagination } from "./pagination";
import { TenantTypes } from "@workspace/db";
import { Card } from "@workspace/ui/components/card";
import { User } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface StudentWithRelations extends TenantTypes.Student {
  name: string;
  batch: { name: string } | null;
  academicYear: { name: string };
}

interface MobileListProps {
  isLoading: boolean;
  students: StudentWithRelations[];
  total: number;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export const MobileList = ({
  isLoading,
  students,
  total,
  onToggleActive,
  onDelete,
}: MobileListProps) => {
  return (
    <div className="bg-slate-50/30 text-slate-900 min-h-screen flex flex-col font-sans pb-24">
      <Header />

      <main className="flex-grow py-6 flex flex-col">
        <Stats />

        <div className="px-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 space-y-5"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center flex-1">
                      <Skeleton className="w-12 h-12 rounded-2xl bg-slate-100/50" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-3/4 bg-slate-100/50" />
                        <Skeleton className="h-3 w-1/2 bg-slate-100/50" />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Skeleton className="h-8 w-8 rounded-xl bg-slate-100/50" />
                      <Skeleton className="h-8 w-8 rounded-xl bg-slate-100/50" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2 border-y border-slate-50 py-3">
                    <div className="flex gap-2 items-center">
                      <Skeleton className="w-8 h-8 rounded-lg bg-slate-100/50" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-12 bg-slate-100/50" />
                        <Skeleton className="h-2 w-8 bg-slate-100/50" />
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Skeleton className="w-8 h-8 rounded-lg bg-slate-100/50" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-12 bg-slate-100/50" />
                        <Skeleton className="h-2 w-8 bg-slate-100/50" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20 rounded-full bg-slate-100/50" />
                    <Skeleton className="h-4 w-24 rounded-full bg-slate-100/50" />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Skeleton className="h-10 flex-1 rounded-xl bg-slate-100/50" />
                    <Skeleton className="h-10 w-10 rounded-xl bg-slate-100/50" />
                  </div>
                </div>
              ))
            ) : students.length > 0 ? (
              students.map((student, i) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  index={i}
                  onToggleActive={onToggleActive}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <Card className="text-center py-20 text-slate-300 font-medium rounded-[32px] border-slate-100 bg-white shadow-sm">
                <div className="flex flex-col items-center justify-center gap-4 px-6">
                  <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                    <User className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg text-slate-900 font-bold tracking-tight">
                      No students found
                    </p>
                    <p className="text-sm text-slate-400">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </AnimatePresence>
        </div>

        <Pagination total={total} />
      </main>
    </div>
  );
};
