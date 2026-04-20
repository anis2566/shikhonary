"use client";

import React, { useEffect, useState } from "react";
import { Plus, CalendarDays, Search } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { useAcademicYearFilters } from "@workspace/api-client";
import { Filters } from "./filters";

export const Header = () => {
  const [search, setSearch] = useState("");

  const debounceValue = useDebounce(search, 500);

  const [_, setFilters] = useAcademicYearFilters();

  useEffect(() => {
    setFilters({
      search: debounceValue,
    });
  }, [debounceValue, setFilters]);

  return (
    <header className="bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg sticky top-0 z-40 px-6 pt-8 pb-4 flex flex-col gap-4 shadow-[0_4px_24px_-4px_rgba(11,28,48,0.06)]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-on-surface leading-none">
              Academic Years
            </h1>
            <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em] mt-1.5">
              Veridian Core
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform h-10 border-none hover:bg-primary/90"
          >
            <Link href="/academic-years/new">
              <Plus className="w-4 h-4" />
              Add Year
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 w-4 h-4" />
          <Input
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border-none rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-primary/10 placeholder:text-on-surface-variant/30 h-11 shadow-sm"
            placeholder="Search years..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
          />
        </div>
        <Filters />
      </div>
    </header>
  );
};
