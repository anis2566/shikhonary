"use client";

import React from "react";
import { TenantTypes } from "@workspace/db";
import { Button } from "@workspace/ui/components/button";
import {
  Edit2,
  Eye,
  Trash2,
  CalendarDays,
  ToggleLeft,
  ToggleRight,
  Layers3,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";

interface BatchWithRelations extends TenantTypes.Batch {
  academicYear: { name: string };
  _count: { students: number };
}

interface BatchCardProps {
  batch: BatchWithRelations;
  index: number;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

const CARD_ACCENTS = [
  { icon: "bg-emerald-100 text-emerald-500", bar: "bg-emerald-500" },
  { icon: "bg-sky-100 text-sky-500", bar: "bg-sky-500" },
  { icon: "bg-violet-100 text-violet-500", bar: "bg-violet-500" },
  { icon: "bg-amber-100 text-amber-500", bar: "bg-amber-500" },
];

export const BatchCard = ({
  batch,
  index,
  onToggleActive,
  onDelete,
}: BatchCardProps) => {
  const capacity = batch.capacity || 1;
  const studentCount = batch._count?.students || 0;
  const progress = Math.min((studentCount / capacity) * 100, 100);
  const isFull = progress > 90;
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      {/* Top accent strip */}
      <div className={cn("h-1 w-full", isFull ? "bg-rose-400" : accent?.bar)} />

      <div className="p-4 flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {/* Icon badge */}
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105",
                accent?.icon,
              )}
            >
              <Layers3 className="w-4 h-4" strokeWidth={2.5} />
            </div>

            {/* Name + meta */}
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-slate-800 truncate leading-tight group-hover:text-emerald-600 transition-colors">
                {batch.name}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <CalendarDays className="w-3 h-3 text-slate-300 flex-shrink-0" />
                <p className="text-[11px] font-semibold text-slate-400 truncate">
                  {batch.className} · {batch.academicYear.name}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              title={batch.isActive ? "Deactivate" : "Activate"}
              className={cn(
                "h-8 w-8 rounded-xl transition-all border-none",
                batch.isActive
                  ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100"
                  : "text-slate-300 hover:text-emerald-500 hover:bg-emerald-50",
              )}
              onClick={() => onToggleActive(batch.id)}
            >
              {batch.isActive ? (
                <ToggleRight className="h-4 w-4" />
              ) : (
                <ToggleLeft className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Delete"
              className="h-8 w-8 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all border-none"
              onClick={() => onDelete(batch.id, batch.name)}
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
            </Button>
          </div>
        </div>

        {/* Status + enrollment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {/* Active badge */}
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                batch.isActive
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-slate-50 text-slate-400 border-slate-100",
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  batch.isActive ? "bg-emerald-400" : "bg-slate-300",
                )}
              />
              {batch.isActive ? "Active" : "Inactive"}
            </span>

            {/* Count */}
            <span
              className={cn(
                "text-[10px] font-bold tabular-nums",
                isFull ? "text-rose-500" : "text-slate-500",
              )}
            >
              <span className="text-slate-800">{studentCount}</span>
              <span className="text-slate-300 mx-0.5">/</span>
              {capacity} students
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: 0.7,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              className={cn(
                "h-full rounded-full",
                isFull ? "bg-rose-400" : accent?.bar,
              )}
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex gap-2 pt-0.5">
          <Button
            className="flex-1 h-9 rounded-xl bg-slate-100 hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold border-none shadow-none transition-all"
            asChild
          >
            <Link href={`/batches/${batch.id}`}>
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              View Batch
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-xl border bg-slate-100 hover:bg-slate-100 hover:text-slate-700 transition-all shadow-none"
            asChild
          >
            <Link href={`/batches/edit/${batch.id}`}>
              <Edit2 className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
