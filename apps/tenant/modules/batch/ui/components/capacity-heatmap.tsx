"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { TenantTypes } from "@workspace/db";
import { Badge } from "@workspace/ui/components/badge";

interface BatchWithRelation extends TenantTypes.Batch {
  _count: {
    students: number;
  };
  academicYear: {
    name: string;
  };
}

interface CapacityHeatmapProps {
  batches: BatchWithRelation[];
}

export default function CapacityHeatmap({ batches }: CapacityHeatmapProps) {
  const getCapacityColor = (percent: number) => {
    if (percent >= 95)
      return "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.4)]";
    if (percent >= 80)
      return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]";
    if (percent >= 50)
      return "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.3)]";
    if (percent >= 20)
      return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]";
    return "bg-muted-foreground/20";
  };

  const getCapacityLabel = (percent: number) => {
    if (percent >= 95) return "Critical";
    if (percent >= 80) return "Near Full";
    if (percent >= 50) return "Optimal";
    if (percent >= 20) return "Available";
    return "Vacant";
  };

  const sortedBatches = React.useMemo(() => {
    return [...batches]
      .filter((b) => b.isActive)
      .sort((a, b) => {
        const pA = a.capacity
          ? ((a._count?.students || 0) / a.capacity) * 100
          : 0;
        const pB = b.capacity
          ? ((b._count?.students || 0) / b.capacity) * 100
          : 0;
        return pB - pA;
      })
      .slice(0, 12); // Limit to top 12 for better visual impact
  }, [batches]);

  if (sortedBatches.length === 0) return null;

  return (
    <Card
      className={cn(
        "border-border/40 shadow-soft overflow-hidden group/heatmap",
      )}
    >
      <CardHeader className="pb-3 border-b border-border/10 bg-muted/20">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="w-4 h-4" />
            </div>
            <span>Strategic Capacity Overlook</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            Top {sortedBatches.length} Batches
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 pb-6">
        <TooltipProvider delayDuration={100}>
          <div className="space-y-6">
            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-5 pb-2">
              {[
                { label: "Vacant", cls: "bg-muted-foreground/20" },
                { label: "Available", cls: "bg-emerald-500" },
                { label: "Optimal", cls: "bg-primary" },
                { label: "Near Full", cls: "bg-amber-500" },
                { label: "Critical", cls: "bg-destructive" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 group/legend cursor-help"
                >
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-transform group-hover/legend:scale-125",
                      item.cls,
                    )}
                  />
                  <span className="text-[10px] font-bold text-muted-foreground group-hover/legend:text-foreground transition-colors">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Heatmap bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {sortedBatches.map((batch) => {
                const currentSize = batch._count?.students || 0;
                const capacity = batch.capacity || 50;
                const percent = Math.min(
                  Math.round((currentSize / capacity) * 100),
                  100,
                );

                return (
                  <Tooltip key={batch.id}>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col gap-1.5 cursor-default group/bar">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-muted-foreground group-hover/bar:text-primary transition-colors truncate max-w-[150px]">
                            {batch.name}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-muted-foreground">
                            {currentSize} / {capacity} ({percent}%)
                          </span>
                        </div>
                        <div className="h-3.5 bg-muted/30 rounded-full overflow-hidden border border-border/10 shadow-inner">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-1000 ease-out",
                              getCapacityColor(percent),
                            )}
                            style={{ width: `${Math.max(percent, 4)}%` }}
                          />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={8}
                      className="bg-popover/95 backdrop-blur-sm border-border/50 shadow-xl px-3 py-2 rounded-xl"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-foreground">
                          {batch.name}
                        </p>
                        <div className="flex items-center gap-2 text-[10px]">
                          <Badge
                            variant="secondary"
                            className="h-4 px-1.5 font-bold uppercase"
                          >
                            {batch.className}
                          </Badge>
                          <span className="text-muted-foreground">
                            {getCapacityLabel(percent)} Status
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium pt-1 border-t border-border/20">
                          {capacity - currentSize} remaining slots out of{" "}
                          {capacity}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
