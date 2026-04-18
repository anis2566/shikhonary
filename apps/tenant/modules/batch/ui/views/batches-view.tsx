"use client";

import React from "react";
import { Plus, Network, Search, SlidersHorizontal } from "lucide-react";
import { BatchStats } from "../components/batch-stats";
import { BatchFilters } from "../components/batch-filters";
import { BatchTable } from "../components/batch-table";
import { BatchMobileList } from "../components/batch-mobile-list";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";

export function BatchesView() {
  return (
    <div className="flex-grow container mx-auto md:px-6 md:py-12 lg:px-12 max-w-7xl font-['Inter'] relative md:pb-12 min-h-screen">
      {/* Mobile Header (Hidden on MD and up) */}
      <header className="md:hidden bg-[#f8f9ff]/80 backdrop-blur-md sticky top-0 z-40 px-6 pt-8 pb-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
              <Network className="size-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-on-surface">
                Batches
              </h1>
              <p className="text-xs font-medium text-on-surface-variant uppercase tracking-widest">
                Manage Batches
              </p>
            </div>
          </div>
          <Button
            className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform border-none w-full max-w-fit h-8"
            asChild
          >
            <Link href="/batches/new">
              <Plus className="size-4" />
              <span>New Batch</span>
            </Link>
          </Button>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant size-[18px]" />
            <Input
              className="w-full pl-10 pr-4 py-2.5 h-auto bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline border outline-outline/10 focus:outline-none"
              placeholder="Search batches..."
              type="text"
            />
          </div>
          <Button
            variant="outline"
            className="px-4 py-2.5 h-auto bg-surface-container-lowest text-on-surface-variant rounded-xl flex items-center justify-center active:scale-95 transition-transform border border-outline/10"
          >
            <SlidersHorizontal className="size-5" />
          </Button>
        </div>
      </header>

      {/* Desktop Header (Hidden on Mobile) */}
      <header className="hidden md:flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
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
          <Button
            style={{
              backgroundImage:
                "linear-gradient(135deg, #006c49 0%, #10b981 100%)",
            }}
            className="text-on-primary py-2 rounded-lg font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2 border-none"
            asChild
          >
            <Link href="/batches/new">
              <Plus className="size-[20px]" />
              Add Batch
            </Link>
          </Button>
        </div>
      </header>

      {/* Shared Main Content wrapper */}
      <main className="px-6 py-4 md:p-0">
        <BatchStats />

        {/* Hide Desktop Filters on Mobile */}
        <div className="hidden md:block">
          <BatchFilters />
        </div>

        {/* Responsive List Rendering */}
        <div className="hidden md:block">
          <BatchTable />
        </div>
        <div className="block md:hidden">
          <BatchMobileList />
        </div>
      </main>

      {/* Mobile Floating Action Button */}
      <Button
        className="md:hidden fixed bottom-8 right-6 size-12 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(16,185,129,0.30)] z-[60] active:scale-95 transition-transform border-none p-0"
        asChild
      >
        <Link href="/batches/new">
          <Plus className="size-6" />
        </Link>
      </Button>
    </div>
  );
}
