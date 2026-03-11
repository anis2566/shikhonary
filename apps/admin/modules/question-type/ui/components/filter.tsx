"use client";

import {
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import { useQuestionTypeFilters } from "@workspace/api-client";

interface FilterProps {
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  isLoading: boolean;
}

export const Filter = ({ setSelectedIds, isLoading }: FilterProps) => {
  const [filters, setFilters] = useQuestionTypeFilters();

  const handleClearFilters = () => {
    setFilters({
      search: "",
      isActive: "ALL",
      page: 1,
    });
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-card/30 backdrop-blur-md rounded-2xl border border-border/50 p-4 shadow-medium">
      {/* Search */}
      <div className="relative flex-1 min-w-[280px] group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground transition-all duration-300 group-focus-within:text-primary group-focus-within:scale-110" />
        <Input
          placeholder="Search question types..."
          className="pl-11 h-12 bg-background/50 border-border/50 rounded-xl focus:ring-primary/20 transition-all font-semibold shadow-soft group-hover:border-primary/20"
          value={filters.search ?? ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select
          value={filters.isActive ?? "ALL"}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              isActive: value as "ALL" | "ACTIVE" | "INACTIVE",
            })
          }
        >
          <SelectTrigger className="h-12 w-[160px] bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold hover:border-primary/20">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50 shadow-medium backdrop-blur-xl bg-background/95 p-1 transition-all">
            <SelectItem value="ALL" className="rounded-lg font-medium p-2 cursor-pointer focus:bg-primary/10">All Status</SelectItem>
            <SelectItem value="ACTIVE" className="rounded-lg font-medium p-2 cursor-pointer focus:bg-green-500/10 text-green-600">Active Only</SelectItem>
            <SelectItem value="INACTIVE" className="rounded-lg font-medium p-2 cursor-pointer focus:bg-red-500/10 text-red-600">Inactive Only</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-xl border-border/50 bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all shadow-soft group"
          onClick={handleClearFilters}
          disabled={isLoading}
        >
          <RotateCcw className="size-4 transition-transform duration-500 group-hover:-rotate-180" />
        </Button>

        <Button
          asChild
          className="rounded-xl font-bold shadow-glow h-12 px-6 bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <Link href="/question-types/new">
            <Plus className="size-4 mr-2 stroke-[3]" />
            Add Type
          </Link>
        </Button>
      </div>
    </div>
  );
};
