"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMonthlyFeeFilters } from "@workspace/api-client";
import { cn } from "@workspace/ui/lib/utils";

interface MobilePaginationProps {
  total: number;
}

export const MobilePagination = ({ total }: MobilePaginationProps) => {
  const [filters, setFilters] = useMonthlyFeeFilters();

  const currentPage = filters.page || 1;
  const pageSize = filters.limit || 10;
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setFilters({ ...filters, page });
  };

  const startRange = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRange = Math.min(currentPage * pageSize, total);

  if (total === 0) return null;

  return (
    <nav className="mt-12 flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-emerald-100 transition-colors disabled:opacity-30 disabled:hover:bg-surface-container-low",
          )}
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        
        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-700 text-on-primary font-bold shadow-md shadow-emerald-700/20">
          {currentPage}
        </button>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-emerald-100 transition-colors disabled:opacity-30 disabled:hover:bg-surface-container-low",
          )}
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>
      <span className="text-sm font-medium text-on-surface-variant">
        Showing {startRange}-{endRange} of {total} records
      </span>
    </nav>
  );
};
