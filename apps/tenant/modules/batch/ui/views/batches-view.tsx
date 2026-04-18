"use client";

import React from "react";
import { Plus } from "lucide-react";
import { BatchStats } from "../components/batch-stats";
import { BatchFilters } from "../components/batch-filters";
import { BatchTable } from "../components/batch-table";

export function BatchesView() {
  return (
    <div className="flex-grow container mx-auto px-6 py-12 lg:px-12 max-w-7xl font-['Inter']">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface">
            Manage Batches
          </h1>
          <p className="text-on-surface-variant max-w-xl text-lg leading-relaxed">
            View and manage academic groups, student enrollments, and status
            tracking for the current semester.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            style={{
              backgroundImage:
                "linear-gradient(135deg, #006c49 0%, #10b981 100%)",
            }}
            className="text-on-primary px-8 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Plus className="size-[20px]" />
            Add Batch
          </button>
        </div>
      </header>

      <BatchStats />
      <BatchFilters />
      <BatchTable />
    </div>
  );
}
