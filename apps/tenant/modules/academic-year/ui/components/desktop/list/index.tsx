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
    <div className="hidden md:block p-8 max-w-7xl mx-auto space-y-8">
      <Header
        title="Academic Years"
        description="Manage and configure your institution's educational timelines"
      />

      <Timeline />

      <Filters viewMode={viewMode} onViewModeChange={setViewMode} />

      <div className="mt-4">
        {viewMode === "table" ? (
          <div className="space-y-6">
            <YearTable
              academicYears={academicYears}
              isLoading={isLoadingYears}
              onToggleActive={toggleActive}
              onDelete={onDelete}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <YearGrid
              academicYears={academicYears}
              onToggleActive={toggleActive}
              onDelete={onDelete}
            />
          </div>
        )}
        {academicYears.length > 0 && <Pagination total={total} />}
      </div>
    </div>
  );
};
