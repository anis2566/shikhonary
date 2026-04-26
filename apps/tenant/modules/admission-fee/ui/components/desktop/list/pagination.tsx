"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useAdmissionFeeFilters } from "@workspace/api-client";

interface PaginationProps {
  total: number;
}

export const Pagination = ({ total }: PaginationProps) => {
  const [filters, setFilters] = useAdmissionFeeFilters();

  const currentPage = filters.page || 1;
  const pageSize = filters.limit || 10;
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const startRange = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRange = Math.min(currentPage * pageSize, total);

  if (total === 0) return null;

  return (
    <div className="p-4 border-t border-surface-container flex flex-col md:flex-row justify-between items-center bg-surface-container-lowest rounded-b-xl gap-4">
      <span className="text-sm font-semibold text-on-surface-variant tracking-tight">
        Showing {startRange} to {endRange} of {total} entries
      </span>
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant h-10 w-10 disabled:opacity-30 transition-all active:scale-95"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </Button>
        <div className="flex gap-1.5">
          <button
            className={cn(
              "w-10 h-10 rounded-xl font-bold text-[13px] flex items-center justify-center transition-all active:scale-90 bg-primary-container text-on-primary-container shadow-sm",
            )}
          >
            {currentPage}
          </button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant h-10 w-10 active:scale-90 disabled:opacity-30 transition-all"
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
};
