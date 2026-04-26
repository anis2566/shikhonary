"use client";

import React from "react";
import {
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
  Phone,
  Hash,
  BookOpen,
} from "lucide-react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { TenantTypes } from "@workspace/db";
import { motion } from "framer-motion";
import Link from "next/link";

interface StudentWithRelations extends TenantTypes.Student {
  batch: { name: string } | null;
  academicYear: { name: string };
}

export interface StudentCardProps {
  student: StudentWithRelations;
  index: number;
  onDelete: (id: string, name: string) => void;
  onToggleActive?: (id: string) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// Cycling avatar palettes — same pattern as BatchCard
const AVATAR_PALETTES = [
  { bg: "bg-emerald-500", text: "text-white", glow: "shadow-emerald-500/30" },
  { bg: "bg-sky-500", text: "text-white", glow: "shadow-sky-500/30" },
  { bg: "bg-violet-500", text: "text-white", glow: "shadow-violet-500/30" },
  { bg: "bg-amber-500", text: "text-white", glow: "shadow-amber-500/30" },
];

export function StudentCard({
  student,
  index,
  onDelete,
  onToggleActive,
}: StudentCardProps) {
  const initials = getInitials(student.name);
  const palette = AVATAR_PALETTES[index % AVATAR_PALETTES.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="h-full"
    >
      <Card className="group relative flex flex-col h-full overflow-hidden bg-white border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-200 rounded-2xl">
        <CardContent className="p-0 flex flex-col h-full">
          {/* ── Top section ───────────────────────────────────────── */}
          <div className="p-4 flex flex-col gap-3.5">
            {/* Avatar + actions */}
            <div className="flex justify-between items-start">
              {/* Avatar */}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-extrabold tracking-tight shadow-md flex-shrink-0 transition-transform duration-200 group-hover:scale-105",
                    palette?.bg,
                    palette?.text,
                    palette?.glow,
                  )}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-slate-800 truncate leading-tight group-hover:text-emerald-600 transition-colors duration-200">
                    {student.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 tracking-widest uppercase font-mono">
                      {student.studentId}
                    </span>
                    {student.gender && (
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {student.gender}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action trio */}
              <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7 rounded-xl border-none transition-all",
                    student.isActive
                      ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100"
                      : "text-slate-300 hover:text-emerald-500 hover:bg-emerald-50",
                  )}
                  onClick={() => onToggleActive?.(student.id)}
                  title={student.isActive ? "Deactivate" : "Activate"}
                >
                  {student.isActive ? (
                    <ToggleRight className="h-3.5 w-3.5" />
                  ) : (
                    <ToggleLeft className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-xl text-slate-300 hover:text-sky-500 hover:bg-sky-50 transition-all border-none"
                  asChild
                  title="Edit"
                >
                  <Link href={`/students/edit/${student.id}`}>
                    <Edit className="w-3.5 h-3.5" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all border-none"
                  onClick={() => onDelete(student.id, student.name)}
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                  <BookOpen size={12} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate leading-none">
                    {student.className}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">
                    {student.batch?.name ?? "No batch assigned"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <Hash size={12} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none">
                    Roll
                  </p>
                  <p className="text-xs font-bold text-slate-700 font-mono mt-0.5">
                    {student.roll || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Placement badges */}
            {(student.section || student.group || student.shift) && (
              <div className="flex flex-wrap gap-1">
                {student.section && (
                  <Badge className="bg-sky-50 text-sky-600 border border-sky-100 font-bold text-[9px] px-1.5 py-px shadow-none rounded-full">
                    SEC {student.section}
                  </Badge>
                )}
                {student.group && (
                  <Badge className="bg-violet-50 text-violet-600 border border-violet-100 font-bold text-[9px] px-1.5 py-px shadow-none rounded-full">
                    {student.group}
                  </Badge>
                )}
                {student.shift && (
                  <Badge className="bg-amber-50 text-amber-600 border border-amber-100 font-bold text-[9px] px-1.5 py-px shadow-none rounded-full">
                    {student.shift}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* ── Bottom section ─────────────────────────────────────── */}
          <div className="mt-auto border-t border-slate-50 p-4 pt-3 flex flex-col gap-2.5">
            {/* Phone + status */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Phone size={11} className="text-slate-300 flex-shrink-0" />
                <span className="text-[11px] font-semibold text-slate-500 truncate">
                  {student.primaryPhone}
                </span>
              </div>
              <span
                className={cn(
                  "flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                  student.isActive
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-slate-50 text-slate-400 border-slate-100",
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    student.isActive ? "bg-emerald-400" : "bg-slate-300",
                  )}
                />
                {student.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* View profile */}
            <Button
              asChild
              className="w-full h-9 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 font-bold text-xs gap-1.5 border-none shadow-none transition-all"
            >
              <Link href={`/students/${student.id}`}>
                <Eye className="w-3.5 h-3.5" />
                View Profile
              </Link>
            </Button>
          </div>
        </CardContent>

        {/* Subtle hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
      </Card>
    </motion.div>
  );
}
