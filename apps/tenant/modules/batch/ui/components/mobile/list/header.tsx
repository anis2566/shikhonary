"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, Layers } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { useBatchFilters } from "@workspace/api-client/filters";
import { Filters } from "./filters";

export const Header = () => {
  const [search, setSearch] = useState("");
  const debounceValue = useDebounce(search, 500);
  const [filters, setFilters] = useBatchFilters();

  useEffect(() => {
    setFilters({ ...filters, search: debounceValue });
  }, [debounceValue, setFilters, filters]);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-[10px] bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/30 text-white">
              <Layers className="w-5 h-5" />
            </div>
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
          </div>

          <div className="min-w-0">
            <h1 className="text-[15px] font-bold tracking-tight text-slate-900 leading-none truncate">
              Academic Batches
            </h1>
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.18em] mt-1 truncate">
              Academic Admin
            </p>
          </div>
        </div>

        {/* Add button */}
        <Button
          asChild
          className="
            flex items-center gap-1.5
            bg-emerald-500 hover:bg-emerald-600 active:scale-95
            text-white text-xs font-bold
            h-9 px-3 sm:px-4
            rounded-xl border-none
            shadow-sm shadow-emerald-500/30
            transition-all duration-150
          "
        >
          <Link href="/batches/new">
            <Plus className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
            <span className="hidden sm:inline">Add Batch</span>
          </Link>
        </Button>
      </div>

      {/* Search + Filter row */}
      <div className="flex items-center gap-2 px-4 pb-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-3.5 h-3.5 pointer-events-none" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records..."
            className="
              w-full h-10 pl-9 pr-8
              bg-slate-50 border border-slate-100
              rounded-xl text-sm text-slate-700
              placeholder:text-slate-300
              focus-visible:ring-2 focus-visible:ring-emerald-500/20
              focus-visible:border-emerald-400
              transition-colors
            "
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-300 transition-colors text-[10px] font-bold leading-none"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex-shrink-0">
          <Filters />
        </div>
      </div>

      {/* Active search pill */}
      {debounceValue && (
        <div className="px-4 pb-3 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <span className="text-[11px] text-slate-400">Results for</span>
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-100 max-w-[160px] truncate">
            "{debounceValue}"
          </span>
        </div>
      )}
    </header>
  );
};
