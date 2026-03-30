"use client";

import React from "react";
import {
  Users,
  Calendar,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Progress } from "@workspace/ui/components/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu";
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

interface BatchCardProps {
  batch: BatchWithRelation;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export default function BatchCard({
  batch,
  onDelete,
  onToggleActive,
}: BatchCardProps) {
  const currentSize = batch._count?.students || 0;
  const capacity = batch.capacity || 50;
  const capacityPercent = Math.min(
    Math.round((currentSize / capacity) * 100),
    100,
  );

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-border/50 hover:border-primary/30 h-full flex flex-col">
      {/* Decorative top strip */}
      <div
        className={cn(
          "h-1.5 w-full",
          batch.isActive ? "bg-green-500/30" : "bg-muted-foreground/30",
        )}
      />

      <CardHeader className="pb-3 space-y-1">
        <div className="flex justify-between items-start">
          <Badge
            variant="outline"
            className="text-[10px] uppercase font-bold tracking-wider px-2 py-0 border-border/40"
          >
            {batch.className || "No Class"}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-1 p-0 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 rounded-xl border-border/50 shadow-soft"
            >
              <DropdownMenuItem asChild>
                <Link
                  href={`/batches/${batch.id}`}
                  className="flex items-center gap-2 py-2.5"
                >
                  <Eye className="w-4 h-4 text-primary" />
                  <span>View Details</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="flex items-center gap-2 py-2.5"
              >
                <Link
                  href={`/batches/edit/${batch.id}`}
                  className="flex items-center gap-2 py-2.5"
                >
                  <Edit className="w-4 h-4 text-blue-500" />
                  <span>Edit Batch</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleActive(batch.id)}
                className="flex items-center gap-2 py-2.5"
              >
                {batch.isActive ? (
                  <>
                    <XCircle className="w-4 h-4 text-orange-500" />
                    <span>Deactivate</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Activate</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(batch.id)}
                className="flex items-center gap-2 py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Batch</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardTitle className="scroll-m-20 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          <Link href={`/batches/${batch.id}`}>{batch.name}</Link>
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5 text-xs">
          <Calendar className="w-3.5 h-3.5" />
          {batch.academicYear.name || "No Year Selected"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-5 pt-0">
        <div className="flex items-center gap-6">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                Students
              </span>
              <span>
                {currentSize} / {capacity}
              </span>
            </div>
            <Progress
              value={capacityPercent}
              className={cn(
                "h-2 w-full bg-muted/60",
                capacityPercent >= 90 && "[&>div]:bg-destructive",
                capacityPercent >= 70 &&
                  capacityPercent < 90 &&
                  "[&>div]:bg-amber-500",
                capacityPercent < 70 && "[&>div]:bg-primary",
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <Badge
            variant={batch.isActive ? "default" : "secondary"}
            className={cn(
              "font-semibold text-[10px] px-2.5 h-6 transition-all",
              batch.isActive &&
                "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20",
              !batch.isActive &&
                "bg-muted/80 text-muted-foreground/80 hover:bg-muted",
            )}
          >
            {batch.isActive ? "ACTIVE" : "INACTIVE"}
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 rounded-lg px-2 text-primary font-bold transition-all hover:bg-primary/10"
          >
            <Link
              href={`/batches/${batch.id}`}
              className="flex items-center gap-1.5"
            >
              EXPLORE
              <Eye className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
