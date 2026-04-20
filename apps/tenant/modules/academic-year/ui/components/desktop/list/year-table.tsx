"use client";

import React from "react";
import { motion } from "framer-motion";
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
  Loader2,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import Link from "next/link";
import { TenantTypes } from "@workspace/db";

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
  return (
    <Card className="rounded-xl shadow-sm border-slate-100 overflow-hidden mt-4">
      <Table>
        <TableHeader className="bg-slate-50/30 border-b border-slate-100">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="px-8 py-4 h-auto text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
              Academic Year
            </TableHead>
            <TableHead className="px-8 py-4 h-auto text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
              Start Date
            </TableHead>
            <TableHead className="px-8 py-4 h-auto text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
              End Date
            </TableHead>
            <TableHead className="px-8 py-4 h-auto text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
              Batches/Students
            </TableHead>
            <TableHead className="px-8 py-4 h-auto text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
              Status
            </TableHead>
            <TableHead className="px-8 py-4 h-auto text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {academicYears.map((ay, i) => (
            <motion.tr
              key={ay.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-slate-50 transition-colors hover:bg-slate-50/50 group"
            >
              <TableCell className="px-8 py-7">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 font-bold text-xs shrink-0 ${
                      ay.isActive
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {ay.name.substring(2, 4)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {ay.name}
                      </span>
                      {ay.isCurrent && (
                        <Badge className="text-[10px] gap-1 bg-amber-500/10 hover:bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-none -mt-0.5">
                          <Star className="w-2.5 h-2.5" /> Current
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-8 py-7 text-[14px] text-slate-600 font-medium whitespace-nowrap">
                {new Date(ay.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="px-8 py-7 text-[14px] text-slate-600 font-medium whitespace-nowrap">
                {new Date(ay.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="px-8 py-7 text-[13px] text-slate-600 font-medium">
                <div className="flex items-center text-slate-500 group-hover:text-slate-700 transition-colors">
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  <span>{ay._count?.students ?? 0}</span>
                  <Layers className="w-3.5 h-3.5 ml-4 mr-1.5" />
                  <span>{ay._count?.batches ?? 0}</span>
                </div>
              </TableCell>
              <TableCell className="px-8 py-7">
                {ay.isActive ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold bg-emerald-50 text-emerald-700 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold bg-slate-100 text-slate-600 whitespace-nowrap">
                    Archived
                  </span>
                )}
              </TableCell>
              <TableCell className="px-8 py-7 text-right">
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
              </TableCell>
            </motion.tr>
          ))}

          {isLoading && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-16">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
                <p className="mt-4 text-sm font-medium text-slate-500">
                  Loading academic years...
                </p>
              </TableCell>
            </TableRow>
          )}

          {!isLoading && academicYears.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-16 text-slate-500 font-medium"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-base text-slate-900 font-bold">
                    No academic years found
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Adjust your filters or add a new year
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
