"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface PaginationProps {
  total: number;
  current?: number;
  pageSize?: number;
}

export function Pagination({ total, current = 1, pageSize = 10 }: PaginationProps) {
  const start = (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);

  return (
    <footer className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-900">{start}</span> to{" "}
        <span className="font-semibold text-slate-900">{end}</span> of{" "}
        <span className="font-semibold text-slate-900">{total}</span> results
      </div>

      <nav aria-label="Pagination" className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled
          className="h-10 px-4 font-medium text-slate-500 bg-slate-50 border-none hover:bg-slate-100 rounded-xl"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            className="w-10 h-10 rounded-xl font-bold bg-emerald-600 text-white shadow-lg shadow-emerald-200"
          >
            1
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-xl font-medium text-slate-500 hover:bg-slate-100"
          >
            2
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-xl font-medium text-slate-500 hover:bg-slate-100"
          >
            3
          </Button>
          <span className="px-2 text-slate-300">...</span>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-xl font-medium text-slate-500 hover:bg-slate-100"
          >
            8
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-10 px-4 font-medium text-slate-500 bg-slate-50 border-none hover:bg-slate-100 rounded-xl"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </nav>
    </footer>
  );
}
