"use client";

import React from "react";
import { User } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { TenantTypes } from "@workspace/db";
import { StudentCard } from "./student-card";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface StudentWithRelations extends TenantTypes.Student {
  name: string;
  batch: {
    name: string;
  } | null;
  academicYear: {
    name: string;
  };
}

interface StudentGridProps {
  students: StudentWithRelations[];
  isLoading: boolean;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export function StudentGrid({
  students,
  isLoading,
  onToggleActive,
  onDelete,
}: StudentGridProps) {
  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4 p-1">
        {[...Array(8)].map((_, i) => (
          <Card
            key={i}
            className="overflow-hidden bg-white border-slate-100 shadow-sm p-6"
          >
            <div className="flex justify-between items-start mb-6">
              <Skeleton className="w-12 h-12 rounded-full bg-slate-100/50" />
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded-lg bg-slate-100/50" />
                <Skeleton className="h-8 w-8 rounded-lg bg-slate-100/50" />
                <Skeleton className="h-8 w-8 rounded-lg bg-slate-100/50" />
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <Skeleton className="h-6 w-3/4 bg-slate-100/50" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-20 bg-slate-100/50" />
                <Skeleton className="h-4 w-16 bg-slate-100/50" />
              </div>
            </div>
            <div className="flex gap-2 mb-6">
              <Skeleton className="h-6 w-20 rounded-full bg-slate-100/50" />
              <Skeleton className="h-6 w-24 rounded-full bg-slate-100/50" />
            </div>
            <div className="space-y-2 mb-6 pt-4 border-t border-slate-50">
              <Skeleton className="h-4 w-full bg-slate-100/50" />
            </div>
            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
              <Skeleton className="h-6 w-20 rounded-full bg-slate-100/50" />
              <Skeleton className="h-8 w-24 rounded-md bg-slate-100/50" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
          <User size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            No students found
          </h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
            There are no students matching your criteria. Try adjusting your
            filters or enroll a new student.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4 p-1">
      {students.map((student, i) => (
        <StudentCard
          key={student.id}
          student={student}
          index={i}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
}
