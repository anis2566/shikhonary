"use client";

import { useState } from "react";
import { Header } from "./header";
import { Stats } from "./stats";
import { Filters } from "./filters";
import { BatchTable } from "./batch-table";
import { BatchGrid } from "./batch-grid";
import { Pagination } from "./pagination";
import { TenantTypes } from "@workspace/db";

export type ViewMode = "table" | "grid";

interface BatchWithRelations extends TenantTypes.Batch {
  academicYear: {
    name: string;
  };
  _count: {
    students: number;
  };
}

interface BatchTableProps {
  batches: BatchWithRelations[];
  isLoading: boolean;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}
export const List = ({
  batches,
  isLoading,
  onToggleActive,
  onDelete,
}: BatchTableProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <div className="hidden md:block">
      <main className="flex-grow container mx-auto px-6 py-12 lg:px-12 max-w-7xl space-y-0">
        <Header
          title="Manage Batches"
          description="View and manage academic groups, student enrollments, and status tracking for the current semester."
        />

        <Stats />

        <Filters viewMode={viewMode} onViewModeChange={setViewMode} />

        <div className="mt-4">
          {viewMode === "table" ? (
            <div className="space-y-6">
              <BatchTable
                batches={batches}
                isLoading={isLoading}
                onToggleActive={onToggleActive}
                onDelete={onDelete}
              />
            </div>
          ) : (
            <BatchGrid
              batches={batches}
              isLoading={isLoading}
              onToggleActive={onToggleActive}
              onDelete={onDelete}
            />
          )}
          <Pagination total={24} />
        </div>
      </main>
    </div>
  );
};
