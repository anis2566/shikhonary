"use client";

import React from "react";
import {
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
  Layers3,
} from "lucide-react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { cn } from "@workspace/ui/lib/utils";
import { TenantTypes } from "@workspace/db";
import { motion } from "framer-motion";
import Link from "next/link";

interface BatchWithRelations extends TenantTypes.Batch {
  academicYear: {
    name: string;
  };
  _count: {
    students: number;
  };
}

export interface BatchCardProps {
  batch: BatchWithRelations;
  index: number;
  onDelete: (id: string, name: string) => void;
  onToggleActive?: (id: string) => void;
}

export function BatchCard({
  batch,
  index,
  onDelete,
  onToggleActive,
}: BatchCardProps) {
  const capacityPercentage = Math.min(
    (batch._count.students / batch.capacity) * 100,
    100,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="group relative overflow-hidden bg-white hover:shadow-xl transition-all duration-300 border-slate-100 hover:border-emerald-200">
        <CardContent className="p-0">
          <div className="p-6 pb-4">
            <div className="flex justify-between items-start">
              <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                <Layers3 className="w-6 h-6" />
              </div>

              <div className="flex bg-slate-50/50 rounded-xl p-1 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-slate-400 hover:text-emerald-600 hover:bg-white hover:shadow-sm transition-all"
                  onClick={() => onToggleActive?.(batch.id)}
                  title={batch.isActive ? "Deactivate" : "Activate"}
                >
                  {batch.isActive ? (
                    <ToggleLeft className="h-5 w-5 text-amber-500" />
                  ) : (
                    <ToggleRight className="h-5 w-5 text-emerald-500" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm transition-all"
                  asChild
                  title="Edit"
                >
                  <Link href={`/batches/edit/${batch.id}`}>
                    <Edit className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-white hover:shadow-sm transition-all"
                  onClick={() => onDelete(batch.id, batch.name)}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mb-2">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                {batch.name}
              </h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                SECTION {batch.id.slice(-3).toUpperCase() || "N/A"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className="bg-slate-100 hover:bg-slate-200 text-slate-600 border-none font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-none">
                {batch.className || "NO GRADE"}
              </Badge>
              <Badge className="bg-slate-100 hover:bg-slate-200 text-slate-600 border-none font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-none">
                {batch.academicYear.name}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Capacity</span>
                <span className="text-slate-900 flex items-center gap-1.5">
                  {batch._count.students}/{batch.capacity}
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      capacityPercentage >= 100
                        ? "bg-rose-500"
                        : capacityPercentage >= 90
                          ? "bg-amber-500 animate-pulse"
                          : "bg-emerald-500",
                    )}
                  />
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${capacityPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full",
                    capacityPercentage >= 100
                      ? "bg-rose-500"
                      : "bg-emerald-600",
                  )}
                />
              </div>
            </div>
          </div>

          <div className="mt-auto bg-slate-50/50 p-6 pt-2 border-t border-slate-100/50">
            <div className="flex justify-between items-center mb-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <Avatar
                    key={i}
                    className="w-8 h-8 border-2 border-white ring-1 ring-slate-100"
                  >
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?u=${batch.id}${i}`}
                    />
                    <AvatarFallback className="text-[10px] font-bold">
                      ST
                    </AvatarFallback>
                  </Avatar>
                ))}
                {batch._count.students > 3 && (
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-emerald-700 ring-1 ring-slate-100">
                    +{batch._count.students - 3}
                  </div>
                )}
              </div>
              <Badge
                className={cn(
                  "px-3 py-1 text-[10px] font-black rounded-md border-none shadow-none",
                  batch.isActive
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                    : "bg-slate-200 text-slate-600 hover:bg-slate-200",
                )}
              >
                {batch.isActive ? "ACTIVE" : "INACTIVE"}
              </Badge>
            </div>
            <Button
              asChild
              variant="outline"
              className="w-full group-hover:border-emerald-600 group-hover:text-emerald-700 transition-all font-bold text-xs gap-2"
            >
              <Link href={`/batches/${batch.id}`}>
                <Eye className="w-4 h-4" />
                View Details
              </Link>
            </Button>
          </div>
        </CardContent>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </Card>
    </motion.div>
  );
}
