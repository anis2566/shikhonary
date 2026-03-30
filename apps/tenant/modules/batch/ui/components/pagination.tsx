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

import { useBatchFilters } from "@workspace/api-client";

interface PaginationProps {
  totalItems: number;
}

export default function Pagination({ totalItems }: PaginationProps) {
  const [filters, setFilters] = useBatchFilters();
  
  const totalPages = Math.max(Math.ceil(totalItems / filters.limit), 1);
  const currentPage = filters.page;
  
  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleLimitChange = (limit: string) => {
    setFilters({ ...filters, limit: Number(limit), page: 1 });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border/40 bg-muted/5">
      <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
        <span>Show</span>
        <Select
          value={String(filters.limit)}
          onValueChange={handleLimitChange}
        >
          <SelectTrigger className="w-[70px] h-9 rounded-lg border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span>items of <span className="text-foreground font-bold">{totalItems}</span> total</span>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-lg border-border/50 hover:bg-primary/5 hover:text-primary transition-colors"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">First page</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-lg border-border/50 hover:bg-primary/5 hover:text-primary transition-colors"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        <div className="flex items-center px-4 h-9 rounded-lg bg-background border border-border/50 text-sm font-semibold shadow-sm">
          <span className="text-muted-foreground mr-1">Page</span>
          <span>{currentPage}</span>
          <span className="mx-1.5 text-muted-foreground">/</span>
          <span className="text-muted-foreground">{totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-lg border-border/50 hover:bg-primary/5 hover:text-primary transition-colors"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-lg border-border/50 hover:bg-primary/5 hover:text-primary transition-colors"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage >= totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Last page</span>
        </Button>
      </div>
    </div>
  );
}
