"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStudentFilters } from "@workspace/api-client/filters";
import { DEFAULT_PAGE_SIZE } from "@workspace/utils/constants";

interface PaginationProps {
  total: number;
}

export const Pagination = ({ total }: PaginationProps) => {
  const [filters, setFilters] = useStudentFilters();
  const page = filters.page || 1;
  const limit = filters.limit || DEFAULT_PAGE_SIZE;
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-between z-40">
      <Button
        variant="ghost"
        size="sm"
        disabled={page <= 1}
        onClick={() => setFilters({ ...filters, page: page - 1 })}
        className="h-10 px-4 rounded-xl font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 border-none shadow-none"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Prev
      </Button>

      <div className="flex items-center gap-1.5">
        <span className="text-xs font-black text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg">
          {page}
        </span>
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          of
        </span>
        <span className="text-xs font-bold text-slate-400">
          {totalPages}
        </span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => setFilters({ ...filters, page: page + 1 })}
        className="h-10 px-4 rounded-xl font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 border-none shadow-none"
      >
        Next
        <ChevronRight className="w-5 h-5 ml-1" />
      </Button>
    </div>
  );
};
