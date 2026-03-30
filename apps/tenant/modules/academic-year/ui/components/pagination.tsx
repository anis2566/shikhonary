"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import { useAcademicYearFilters } from "@workspace/api-client";

interface PaginationProps {
  totalItem: number;
}

export const Pagination = ({ totalItem }: PaginationProps) => {
  const [filters, setFilters] = useAcademicYearFilters();
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border bg-white">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Showing</span>
        <Select
          value={String(filters.limit)}
          onValueChange={(value) =>
            setFilters({ ...filters, limit: Number(value) })
          }
        >
          <SelectTrigger className="w-16 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span>of {totalItem} items</span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setFilters({ ...filters, page: 1 })}
          disabled={filters.page === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          disabled={filters.page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1 mx-2">
          <span className="text-sm text-muted-foreground">
            Page {filters.page} of {Math.ceil(totalItem / filters.limit)}
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          disabled={filters.page === Math.ceil(totalItem / filters.limit)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() =>
            setFilters({
              ...filters,
              page: Math.ceil(totalItem / filters.limit),
            })
          }
          disabled={filters.page === Math.ceil(totalItem / filters.limit)}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
