"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import {
  useBatches,
  useBatchStats,
  useDeleteBatch,
  useToggleBatchActive,
} from "@workspace/api-client";
import { cn } from "@workspace/ui/lib/utils";

import BatchStats from "../components/batch-stats";
import CapacityHeatmap from "../components/capacity-heatmap";
import BatchToolbar from "../components/batch-toolbar";
import BatchTable from "../components/batch-table";
import BatchCard from "../components/batch-card";
import Pagination from "../components/pagination";
import Link from "next/link";

type ViewMode = "table" | "cards";

export default function BatchesView() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const { openDeleteModal } = useDeleteModal();
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);

  const { data: stats, isLoading: statsLoading } = useBatchStats();
  const { data: batchesResponse, isLoading: listLoading } = useBatches();

  const { mutate: deleteBatch, isPending: isDeleting } = useDeleteBatch();
  const { mutate: toggleActive, isPending: isToggling } =
    useToggleBatchActive();

  const batches = batchesResponse?.items ?? [];
  const totalItems = batchesResponse?.total ?? 0;

  const isLoading = statsLoading || listLoading || isDeleting || isToggling;

  const handleDelete = (id: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "batch",
      entityName: "Batch",
      onConfirm: (id) => deleteBatch({ id }),
    });
  };

  const handleToggleActive = (id: string) => {
    toggleActive({ id });
  };

  const toggleSelect = (id: string) => {
    setSelectedBatchIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedBatchIds.length === batches.length) {
      setSelectedBatchIds([]);
    } else {
      setSelectedBatchIds(batches.map((b) => b.id));
    }
  };

  return (
    <div className="space-y-6 container mx-auto px-4 py-8 max-w-[1400px]">
      {/* Header section with strategic title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-2">
        <div className="space-y-1">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Batch Management
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            Control and optimize your academic groups and student distribution
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="rounded-xl h-11 px-6 font-bold shadow-soft hover:shadow-lg transition-all flex items-center gap-2 group"
            asChild
          >
            <Link href="/batches/new">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>New Batch</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Strategic Stats */}
      <BatchStats stats={stats} />

      {/* Analytics Visualization */}
      {!statsLoading && totalItems > 0 && (
        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CapacityHeatmap batches={batches} />
        </div>
      )}

      {/* Actions Toolbar */}
      <BatchToolbar
        isLoading={isLoading}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Batch Listing View */}
      <Card className="border-border/40 shadow-soft overflow-hidden transition-all duration-500 hover:shadow-md h-full">
        <CardContent className="p-0">
          {viewMode === "table" ? (
            <div className="hidden sm:block">
              <BatchTable
                batches={batches}
                selectedBatches={selectedBatchIds}
                onSelectBatch={toggleSelect}
                onSelectAll={toggleSelectAll}
                isLoading={isLoading}
              />
            </div>
          ) : null}

          {/* Cards View (Mobile default + Opt-in Grid) */}
          <div
            className={cn(
              "p-6 gap-6",
              viewMode === "cards"
                ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid sm:hidden grid-cols-1",
            )}
          >
            {batches.map((batch) => (
              <BatchCard
                key={batch.id}
                batch={batch}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
              />
            ))}

            {batches.length === 0 && !isLoading && (
              <div className="col-span-full py-20 text-center animate-in fade-in zoom-in duration-500">
                <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold">No Batches Yet</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mt-2 font-medium">
                  Get started by creating your first batch to organize your
                  students.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 rounded-xl font-bold"
                  asChild
                >
                  <Link href="/batches/new">Create First Batch</Link>
                </Button>
              </div>
            )}

            {isLoading && batches.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground font-medium">
                  Synchronizing batch data...
                </p>
              </div>
            )}
          </div>
        </CardContent>

        {/* Footer with Pagination */}
        {batches.length > 0 && <Pagination totalItems={totalItems} />}
      </Card>

      {/* Strategic Info Tip */}
      <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex items-start gap-3 mt-8">
        <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0">
          <Plus className="w-4 h-4 rotate-45" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-foreground">
            Pro-tip for Coordinators
          </p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            Monitor the Capacity Heatmap regularly. Batches in{" "}
            <span className="text-destructive font-bold uppercase italic">
              red
            </span>{" "}
            are reaching critical limits. Consider creating parallel sessions
            for students to ensure teaching excellence.
          </p>
        </div>
      </div>
    </div>
  );
}
