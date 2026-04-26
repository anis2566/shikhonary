"use client";

import React from "react";
import {
  Calendar,
  Users,
  Layers,
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import Link from "next/link";
import { TenantTypes } from "@workspace/db";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";

interface AcademicYearWithRelations extends TenantTypes.AcademicYear {
  _count: {
    students: number;
    batches: number;
  };
}

interface YearTableProps {
  academicYears: AcademicYearWithRelations[];
  isLoading: boolean;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export function YearTable({
  academicYears,
  isLoading,
  onToggleActive,
  onDelete,
}: YearTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-hidden border-t border-surface-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-3 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Academic Year
                </th>
                <th className="px-8 py-3 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Timeline
                </th>
                <th className="px-8 py-3 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Stats
                </th>
                <th className="px-8 py-3 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Status
                </th>
                <th className="px-8 py-3 font-semibold text-sm text-on-surface-variant text-right border-b border-surface-container">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg bg-slate-100/50" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32 bg-slate-100/50" />
                        <Skeleton className="h-4 w-20 bg-slate-100/50" />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 bg-slate-100/50" />
                      <Skeleton className="h-4 w-28 bg-slate-100/50" />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Skeleton className="h-5 w-24 bg-slate-100/50" />
                  </td>
                  <td className="px-8 py-6">
                    <Skeleton className="h-6 w-16 rounded-full bg-slate-100/50" />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end">
                      <Skeleton className="w-10 h-10 rounded-lg bg-slate-100/50" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (academicYears.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 border-t border-surface-container">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
          <Calendar size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            No academic years found
          </h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
            There are no academic years matching your criteria. Try adjusting
            your filters or add a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border-t border-surface-container animate-in fade-in zoom-in-95 duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-8 py-3 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Academic Year
              </th>
              <th className="px-8 py-3 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Timeline
              </th>
              <th className="px-8 py-3 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Stats
              </th>
              <th className="px-8 py-3 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Status
              </th>
              <th className="px-8 py-3 font-semibold text-sm text-on-surface-variant text-right border-b border-surface-container">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {academicYears.map((ay, index) => (
              <tr
                key={ay.id}
                className="hover:bg-surface-container-low/30 transition-colors group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-8">
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center mr-4 font-bold text-xs shrink-0 transition-colors group-hover:bg-white shadow-sm shadow-emerald-500/5",
                        ay.isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500",
                      )}
                    >
                      {ay.name.substring(2, 4)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-on-surface group-hover:text-emerald-700 transition-colors">
                          {ay.name}
                        </span>
                        {ay.isCurrent && (
                          <Badge className="text-[10px] gap-1 bg-amber-500/10 hover:bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-none -mt-0.5 animate-pulse">
                            <Star className="w-2.5 h-2.5 fill-current" />{" "}
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                        {ay.isActive ? "Ongoing Session" : "Archived Record"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-emerald-500" />
                      <span className="text-sm font-bold text-on-surface">
                        {new Date(ay.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(ay.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant font-medium">
                      Full session duration
                    </p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4 text-on-surface-variant">
                    <div className="flex items-center gap-1.5">
                      <Users size={16} className="text-emerald-500" />
                      <span className="text-sm font-bold text-on-surface">
                        {ay._count?.students ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers size={16} className="text-blue-500" />
                      <span className="text-sm font-bold text-on-surface">
                        {ay._count?.batches ?? 0}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  {ay.isActive ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-slate-50 text-slate-500 border border-slate-100">
                      Archived
                    </span>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="text-slate-400 hover:text-emerald-600 transition-all cursor-pointer rounded-lg hover:bg-emerald-50"
                    >
                      <Link href={`/academic-years/${ay.id}`}>
                        <Eye className="w-5 h-5" />
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-emerald-600 transition-all cursor-pointer rounded-lg hover:bg-emerald-50 outline-none focus:outline-none focus:ring-0"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          className="cursor-pointer font-medium text-slate-600"
                          asChild
                        >
                          <Link href={`/academic-years/edit/${ay.id}`}>
                            <Edit className="w-4 h-4 mr-2" /> Edit Year
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer font-medium p-2 rounded-lg"
                          onClick={() => onToggleActive(ay.id)}
                        >
                          {ay.isActive ? (
                            <>
                              <ToggleLeft className="h-4 w-4 mr-2 text-amber-500 opacity-70" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <ToggleRight className="h-4 w-4 mr-2 text-green-500 opacity-70" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer font-medium"
                          onClick={() => onDelete(ay.id, ay.name)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
