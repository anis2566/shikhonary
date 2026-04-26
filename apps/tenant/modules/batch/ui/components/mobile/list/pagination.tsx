"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useBatchFilters } from "@workspace/api-client/filters";

interface PaginationProps {
  total: number;
}

export const Pagination = ({ total }: PaginationProps) => {
  const [filters, setFilters] = useBatchFilters();

  const currentPage = filters.page;
  const pageSize = filters.limit;
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  if (total === 0) return null;

  return (
    <nav className="flex items-center justify-center gap-2 mt-8 pb-10">
      <Button
        variant="ghost"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors p-0"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <div className="flex gap-2">
        <Button className="w-10 h-10 rounded-lg bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-600/20 p-0 border-none">
          {currentPage}
        </Button>
      </div>
      <Button
        variant="ghost"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors p-0"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </nav>
  );
};
