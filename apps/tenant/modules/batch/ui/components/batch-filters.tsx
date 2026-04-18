"use client";

import React from "react";
import { Search, ArrowUpDown, LayoutGrid, List } from "lucide-react";

export function BatchFilters() {
  return (
    <section className="mb-6">
      <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-[12px] p-4 shadow-[0_24px_48px_-12px_rgba(11,28,48,0.06)] flex flex-wrap items-center gap-4">
        <div className="relative flex-grow min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 size-[18px]" />
          <input
            className="w-full bg-surface py-2.5 pl-10 pr-4 rounded-[12px] border-none focus:ring-2 focus:ring-primary/20 text-sm text-on-surface placeholder:text-on-surface-variant/40"
            placeholder="Search batches..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-[12px] bg-primary text-on-primary text-sm font-semibold">
            All
          </button>
          <button className="px-4 py-2 rounded-[12px] bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-sm font-medium flex items-center gap-2 transition-colors">
            Active
            <span className="bg-surface-container-highest px-1.5 py-0.5 rounded text-[10px] font-bold">
              18
            </span>
          </button>
          <button className="px-4 py-2 rounded-[12px] bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-sm font-medium flex items-center gap-2 transition-colors">
            Inactive
            <span className="bg-surface-container-highest px-1.5 py-0.5 rounded text-[10px] font-bold">
              6
            </span>
          </button>
        </div>
        <div className="h-6 w-px bg-outline-variant/20 hidden lg:block"></div>
        <div className="flex items-center gap-3">
          <select className="bg-surface-container-low border-none rounded-[12px] text-sm font-medium text-on-surface py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
            <option>All Classes</option>
          </select>
          <select className="bg-surface-container-low border-none rounded-[12px] text-sm font-medium text-on-surface py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
            <option>All Years</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] border border-outline-variant/20 text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
          <ArrowUpDown className="size-[18px]" />
          Name A-Z
        </button>
        <div className="ml-auto flex items-center bg-surface-container-low p-1 rounded-[12px]">
          <button className="p-2 rounded-[10px] bg-white shadow-sm text-primary">
            <LayoutGrid className="size-[20px]" />
          </button>
          <button className="p-2 rounded-[10px] text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <List className="size-[20px]" />
          </button>
        </div>
      </div>
    </section>
  );
}
