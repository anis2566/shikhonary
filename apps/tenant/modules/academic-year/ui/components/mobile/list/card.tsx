"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Layers,
  ToggleLeft,
  ToggleRight,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { TenantTypes } from "@workspace/db";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";

interface AcademicYearWithRelations extends TenantTypes.AcademicYear {
  _count: {
    students: number;
    batches: number;
  };
}

interface CardProps {
  ay: AcademicYearWithRelations;
  index: number;
  onToggleActive: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

export const YearCard = ({
  ay,
  index,
  onToggleActive,
  onDelete,
}: CardProps) => {
  const start = new Date(ay.startDate).getTime();
  const end = new Date(ay.endDate).getTime();
  const now = new Date().getTime();
  const completion = Math.min(
    100,
    Math.max(0, Math.round(((now - start) / (end - start)) * 100)),
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="bg-surface-container-lowest rounded-2xl p-5 shadow-ambient relative overflow-hidden border border-outline-variant/10"
    >
      <div
        className={cn(
          "absolute top-0 left-0 w-1.5 h-full",
          ay.isCurrent
            ? "bg-primary"
            : ay.isActive
              ? "bg-blue-500"
              : "bg-outline-variant/30",
        )}
      ></div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-extrabold text-on-surface tracking-tight">
              {ay.name}
            </span>
            {ay.isCurrent ? (
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                Current
              </span>
            ) : ay.isActive ? (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                Planned
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant/40 text-[10px] font-bold uppercase tracking-wider">
                Archive
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant/60">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {new Date(ay.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              -{" "}
              {new Date(ay.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-primary block uppercase tracking-tighter">
            Completion
          </span>
          <span className="text-lg font-bold text-on-surface">
            {ay.isActive ? `${completion}%` : start > now ? "0%" : "100%"}
          </span>
        </div>
      </div>

      <div className="w-full h-1.5 bg-surface-container-low rounded-full mb-5 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            ay.isCurrent
              ? "bg-primary"
              : ay.isActive
                ? "bg-blue-500"
                : "bg-on-surface-variant/20",
          )}
          style={{
            width: ay.isActive ? `${completion}%` : start > now ? "0%" : "100%",
          }}
        ></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-surface-container-low/50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-tighter">
              Students
            </span>
            <span className="text-sm font-bold text-on-surface">
              {ay._count?.students?.toLocaleString() ?? 0}
            </span>
          </div>
        </div>
        <div className="bg-surface-container-low/50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-blue-600 shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-tighter">
              Batches
            </span>
            <span className="text-sm font-bold text-on-surface">
              {ay._count?.batches?.toLocaleString() ?? 0}
            </span>
          </div>
        </div>
      </div>

      <div className="flex bg-surface-container-low/30 rounded-xl p-1 gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-9 text-on-surface-variant/60 text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container-lowest hover:text-on-surface hover:shadow-sm"
          asChild
        >
          <Link href={`/academic-years/${ay.id}`}>Details</Link>
        </Button>
        <div className="w-px h-4 bg-outline-variant/20 mt-2.5 mx-0.5"></div>
        <div className="flex gap-1 px-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-on-surface-variant/40 hover:text-primary hover:bg-surface-container-lowest hover:shadow-sm transition-all"
            onClick={() => onToggleActive(ay.id)}
          >
            {ay.isActive ? (
              <ToggleLeft className="h-5 w-5 text-amber-500" />
            ) : (
              <ToggleRight className="h-5 w-5 text-primary" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-on-surface-variant/40 hover:text-blue-600 hover:bg-surface-container-lowest hover:shadow-sm transition-all"
            asChild
          >
            <Link href={`/academic-years/edit/${ay.id}`}>
              <Edit className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-on-surface-variant/40 hover:text-destructive hover:bg-surface-container-lowest hover:shadow-sm transition-all"
            onClick={() => onDelete(ay.id, ay.name)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
