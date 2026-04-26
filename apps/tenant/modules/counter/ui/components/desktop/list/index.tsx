"use client";

import { useState } from "react";
import { Header } from "./header";
import { Filters } from "./filters";
import { CounterTable } from "./counter-table";
import { CounterGrid } from "./counter-grid";
import { Pagination } from "./pagination";

export type ViewMode = "table" | "grid";

interface CounterWithRelations {
  id: string;
  value: number;
  className: string;
  academicYear: {
    name: string;
  };
  academicClassId: string;
  academicYearId: string;
}

interface CounterListProps {
  counters: CounterWithRelations[];
  isLoading: boolean;
  total: number;
  onDelete: (id: string, name: string) => void;
}

export const List = ({
  counters,
  isLoading,
  total,
  onDelete,
}: CounterListProps) => {
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

      <main className="flex-grow container mx-auto px-4 py-8 lg:px-12 max-w-7xl relative z-10">
        <Header
          title="Counter List"
          description="Manage and monitor academic year counters."
        />

        <div className="bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col mt-6">
          <Filters viewMode={viewMode} onViewModeChange={setViewMode} />

          <div className="relative flex-grow">
            {viewMode === "table" ? (
              <CounterTable
                counters={counters}
                isLoading={isLoading}
                onDelete={onDelete}
              />
            ) : (
              <div className="p-4 bg-surface-container-lowest border-t border-surface-container">
                <CounterGrid
                  counters={counters}
                  isLoading={isLoading}
                  onDelete={onDelete}
                />
              </div>
            )}
          </div>

          <Pagination total={total} />
        </div>
      </main>
    </div>
  );
};
