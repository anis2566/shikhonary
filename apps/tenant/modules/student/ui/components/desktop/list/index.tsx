"use client";

import { useState } from "react";
import { Header } from "./header";
import { Stats } from "./stats";
import { Filters } from "./filters";
import { StudentTable } from "./student-table";
import { StudentGrid } from "./student-grid";
import { TenantTypes } from "@workspace/db";
import { Pagination } from "./pagination";

export type ViewMode = "table" | "grid";

interface StudentWithRelations extends TenantTypes.Student {
  name: string;
  batch: {
    name: string;
  } | null;
  academicYear: {
    name: string;
  };
}

interface StudentListProps {
  students: StudentWithRelations[];
  isLoading: boolean;
  total: number;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export const List = ({
  students,
  isLoading,
  total,
  onToggleActive,
  onDelete,
}: StudentListProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  return (
    <div className="hidden md:block min-h-screen bg-surface relative isolate">
      {/* Background blobs for depth */}
      <div
        aria-hidden
        className="absolute top-[20%] -left-16 w-64 h-64 rounded-full bg-emerald-200/20 blur-3xl -z-10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-[10%] -right-16 w-80 h-80 rounded-full bg-emerald-300/10 blur-3xl -z-10 pointer-events-none"
      />

      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        <Header
          title="Student Directory"
          description="Manage student records, track academic progress, and organize batch enrollments."
        />

        <div className="mt-8">
          <Stats />
        </div>

        <div className="mt-12 bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col">
          <Filters viewMode={viewMode} onViewModeChange={setViewMode} />

          <div className="relative flex-grow">
            {viewMode === "table" ? (
              <StudentTable
                students={students}
                isLoading={isLoading}
                onToggleActive={onToggleActive}
                onDelete={onDelete}
              />
            ) : (
              <StudentGrid
                students={students}
                isLoading={isLoading}
                onToggleActive={onToggleActive}
                onDelete={onDelete}
              />
            )}
          </div>

          <Pagination total={total} />
        </div>
      </main>
    </div>
  );
};
