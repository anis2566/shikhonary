"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import { useBatchFilters } from "@workspace/api-client";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  total: number;
}

export function Pagination({ total }: PaginationProps) {
  const [filters, setFilters] = useBatchFilters();

  const currentPage = filters.page;
  const pageSize = filters.limit;
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setFilters({ ...filters, page });
  };

  const startRange = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRange = Math.min(currentPage * pageSize, total);

  if (total === 0) return null;

  return (
    <div className="px-8 py-5 flex items-center justify-between border-t border-slate-100 bg-white">
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Showing <span className="text-emerald-600">{startRange}</span> -{" "}
            <span className="text-emerald-600">{endRange}</span> of{" "}
            <span className="text-slate-600">{total}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="h-9 px-3 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent font-bold text-xs gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex items-center gap-1 mx-2">
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <Button
                key={pageNum}
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                className={cn(
                  "w-9 h-9 rounded-lg font-bold text-xs transition-all",
                  currentPage === pageNum
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50",
                )}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="h-9 px-3 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent font-bold text-xs gap-1"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
