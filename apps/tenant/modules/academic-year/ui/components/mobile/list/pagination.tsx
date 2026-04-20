"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useAcademicYearFilters } from "@workspace/api-client";

interface PaginationProps {
  total: number;
}

export const Pagination = ({ total }: PaginationProps) => {
  const [filters, setFilters] = useAcademicYearFilters();

  const currentPage = filters.page;
  const pageSize = filters.limit;
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 0) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;
    let start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="px-6 py-4 flex items-center justify-between border-t border-outline-variant/20 bg-surface-container-lowest sticky bottom-0 z-40">
      <button
        className="flex items-center gap-1 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <ChevronLeft className="w-5 h-5" />
        Prev
      </button>
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all shadow-sm",
              currentPage === page
                ? "bg-primary text-on-primary"
                : "hover:bg-surface-container-low text-on-surface-variant font-medium",
            )}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        className="flex items-center gap-1 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
        <ChevronRight className="w-5 h-5" />
      </button>
    </footer>
  );
};
