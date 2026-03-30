"use client";

import { Calendar, Plus, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";
import { cn } from "@workspace/ui/lib/utils";
import { TenantTypes } from "@workspace/db";
import Link from "next/link";

interface BatchWithRelation extends TenantTypes.Batch {
  _count: {
    students: number;
  };
  academicYear: {
    name: string;
  };
}

interface BatchTableProps {
  batches: BatchWithRelation[];
  selectedBatches: string[];
  onSelectBatch: (id: string) => void;
  onSelectAll: () => void;
  isLoading: boolean;
}

export default function BatchTable({
  batches,
  selectedBatches,
  onSelectBatch,
  onSelectAll,
  isLoading,
}: BatchTableProps) {
  const allSelected =
    batches.length > 0 && selectedBatches.length === batches.length;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 border-none">
            <TableHead className="w-12">
              <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
            </TableHead>
            <TableHead className="font-semibold">Batch Name</TableHead>
            <TableHead className="font-semibold">Class</TableHead>
            <TableHead className="font-semibold">Academic Year</TableHead>
            <TableHead className="font-semibold text-center">
              Students
            </TableHead>
            <TableHead className="font-semibold">Capacity</TableHead>
            <TableHead className="font-semibold text-center">Status</TableHead>
            <TableHead className="w-20 font-semibold text-right pr-6">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch) => {
            const currentSize = batch._count?.students || 0;
            const capacity = batch.capacity || 50;
            const capacityPercent = Math.min(
              Math.round((currentSize / capacity) * 100),
              100,
            );

            return (
              <TableRow
                key={batch.id}
                className="border-border/50 hover:bg-muted/20 transition-colors"
              >
                <TableCell>
                  <Checkbox
                    checked={selectedBatches.includes(batch.id)}
                    onCheckedChange={() => onSelectBatch(batch.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <Link
                      href={`/batches/${batch.id}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary/30"
                    >
                      {batch.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-background/50 font-medium border-border/50"
                  >
                    {batch.className || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {batch.academicYear.name}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2 font-medium">
                    <Users className="w-4 h-4 text-primary/70" />
                    {currentSize}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5 min-w-[120px]">
                    <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
                      <span>
                        {currentSize} / {capacity}
                      </span>
                      <span>{capacityPercent}%</span>
                    </div>
                    <Progress
                      value={capacityPercent}
                      className={cn(
                        "h-1.5 w-full bg-muted/50",
                        capacityPercent >= 90 && "[&>div]:bg-destructive",
                        capacityPercent >= 70 &&
                          capacityPercent < 90 &&
                          "[&>div]:bg-amber-500",
                        capacityPercent < 70 && "[&>div]:bg-primary",
                      )}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={batch.isActive ? "default" : "secondary"}
                    className={cn(
                      "font-medium",
                      batch.isActive &&
                        "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 shadow-none",
                      !batch.isActive && "bg-muted/50 text-muted-foreground",
                    )}
                  >
                    {batch.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Link href={`/batches/${batch.id}`}>
                      <span className="sr-only">View</span>
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {batches.length === 0 && !isLoading && (
        <div className="col-span-full py-20 text-center animate-in fade-in zoom-in duration-500">
          <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-bold">No Batches Yet</h3>
          <p className="text-muted-foreground max-w-xs mx-auto mt-2 font-medium">
            Get started by creating your first batch to organize your students.
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
    </>
  );
}
