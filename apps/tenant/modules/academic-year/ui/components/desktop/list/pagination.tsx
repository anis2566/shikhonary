"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import { useAcademicYearFilters } from "@workspace/api-client/filters";
import { Card } from "@workspace/ui/components/card";

interface PaginationProps {
  total: number;
}

export function Pagination({ total }: PaginationProps) {
  const [filters, setFilters] = useAcademicYearFilters();

  const currentPage = filters.page;
  const pageSize = filters.limit;
  const totalPages = Math.ceil(total / pageSize);

  console.log(totalPages);

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const startRange = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRange = Math.min(currentPage * pageSize, total);

  if (total === 0) return null;

  return (
    <Card className="rounded-xl shadow-sm border-slate-100 overflow-hidden">
      <div className="px-8 py-5 flex items-center justify-between border-t border-slate-100 bg-white">
        <p className="text-[13px] font-medium text-slate-500">
          Showing{" "}
          <span className="font-bold text-slate-900">
            {startRange} - {endRange}
          </span>{" "}
          of <span className="font-bold text-slate-900">{total}</span>
        </p>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-2 bg-white border-slate-200 text-xs font-bold text-slate-400 font-bold transition-all hover:bg-slate-50 active:scale-95 flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>
          <div className="flex items-center gap-1 mx-2">
            {/* Simple version: just current page, could be expanded to show more */}
            <Button className="w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 active:scale-95 transition-all">
              {currentPage}
            </Button>
          </div>
          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-2 bg-white border-slate-200 text-xs font-bold text-slate-400 font-bold transition-all hover:bg-slate-50 active:scale-95 flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
