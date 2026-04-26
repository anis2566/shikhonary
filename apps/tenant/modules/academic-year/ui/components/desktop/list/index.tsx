import { useState } from "react";
import { Filters } from "./filters";
import { Header } from "./header";
import { Timeline } from "./timeline";
import { YearTable } from "./year-table";
import { TenantTypes } from "@workspace/db";
import { Pagination } from "./pagination";
import { YearGrid } from "./year-grid";

export type ViewMode = "table" | "cards";
export type StatusFilter = "all" | "active" | "inactive" | "current";
export type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";

interface AcademicYearWithRelations extends TenantTypes.AcademicYear {
  _count: {
    students: number;
    batches: number;
  };
}

interface ListProps {
  academicYears: AcademicYearWithRelations[];
  isLoadingYears: boolean;
  toggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
  total: number;
}

export const List = ({
  academicYears,
  isLoadingYears,
  toggleActive,
  onDelete,
  total,
}: ListProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  return (
    <div className="hidden md:flex flex-col min-h-screen bg-surface relative isolate">
      {/* Blob — top left */}
      <div
        aria-hidden
        className="absolute top-[20%] -left-16 w-64 h-64 rounded-full bg-emerald-200/20 blur-3xl -z-10 pointer-events-none"
      />
      {/* Blob — bottom right */}
      <div
        aria-hidden
        className="absolute bottom-[10%] -right-16 w-80 h-80 rounded-full bg-emerald-300/10 blur-3xl -z-10 pointer-events-none"
      />

      <main className="flex-grow container mx-auto px-6 py-12 lg:px-12 max-w-7xl space-y-12">
        <Header
          title="Academic Years"
          description="Manage and configure your institution's educational timelines"
        />

        <Timeline />

        <div className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden flex flex-col">
          <Filters viewMode={viewMode} onViewModeChange={setViewMode} />

          <div className="flex-grow flex flex-col">
            {viewMode === "table" ? (
              <YearTable
                academicYears={academicYears}
                isLoading={isLoadingYears}
                onToggleActive={toggleActive}
                onDelete={onDelete}
              />
            ) : (
              <div className="p-6">
                <YearGrid
                  academicYears={academicYears}
                  isLoading={isLoadingYears}
                  onToggleActive={toggleActive}
                  onDelete={onDelete}
                />
              </div>
            )}
            {academicYears.length > 0 && <Pagination total={total} />}
          </div>
        </div>
      </main>
    </div>
  );
};
