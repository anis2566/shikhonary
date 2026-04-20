"use client";

import React from "react";
import {
  Calendar,
  Users,
  Layers,
  Star,
  Edit,
  Trash2,
  Clock,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import type { TenantTypes } from "@workspace/db";
import { motion } from "framer-motion";
import Link from "next/link";

interface AcadememicYearWithRelations extends TenantTypes.AcademicYear {
  _count: {
    students: number;
    batches: number;
  };
}

export interface AcademicYearCardProps {
  year: AcadememicYearWithRelations;
  index: number;
  onDelete: (id: string, name: string) => void;
  onToggleActive?: (id: string) => void;
}

export function AcademicYearCard({
  year,
  index,
  onDelete,
  onToggleActive,
}: AcademicYearCardProps) {
  const start = new Date(year.startDate);
  const end = new Date(year.endDate);
  const today = new Date();

  const isPast = end.getTime() < today.getTime() && !year.isCurrent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="group relative overflow-hidden bg-white hover:shadow-xl transition-all duration-300 border-slate-100 hover:border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className={`
                p-3 rounded-xl transition-all duration-300
                ${
                  year.isCurrent
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : isPast
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-50 text-slate-400"
                }
              `}
              >
                {year.isCurrent ? (
                  <Calendar className="w-5 h-5" />
                ) : isPast ? (
                  <Calendar className="w-5 h-5 opacity-60" />
                ) : (
                  <Clock className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-2">
                  {year.name}
                  {year.isCurrent && (
                    <Badge className="text-[10px] gap-1 bg-amber-500/10 hover:bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-none">
                      <Star className="w-2.5 h-2.5" /> Current
                    </Badge>
                  )}
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  {start.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  –{" "}
                  {end.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex bg-slate-50/50 rounded-xl p-1 gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-slate-400 hover:text-emerald-600 hover:bg-white hover:shadow-sm transition-all"
                onClick={() => onToggleActive?.(year.id)}
                title={year.isActive ? "Deactivate" : "Activate"}
              >
                {year.isActive ? (
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
                <Link href={`/academic-years/edit/${year.id}`}>
                  <Edit className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-white hover:shadow-sm transition-all"
                onClick={() => onDelete(year.id, year.name)}
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100/50">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Users className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Students
                </span>
              </div>
              <p className="text-lg font-bold text-slate-900">
                {year._count.students}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100/50">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Batches
                </span>
              </div>
              <p className="text-lg font-bold text-slate-900">
                {year._count.batches}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${year.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}
              />
              <span
                className={`text-[12px] font-bold ${year.isActive ? "text-emerald-700" : "text-slate-500"}`}
              >
                {year.isActive ? "Active Session" : "Archived Year"}
              </span>
            </div>
          </div>
        </CardContent>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </Card>
    </motion.div>
  );
}
