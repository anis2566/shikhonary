"use client";

import {
  BookOpen,
  Calendar,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  User,
  Hash,
  Phone,
  Tag,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { TenantTypes } from "@workspace/db";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import Link from "next/link";

interface StudentWithRelations extends TenantTypes.Student {
  name: string;
  batch: {
    name: string;
  } | null;
  academicYear: {
    name: string;
  };
}

interface StudentTableProps {
  students: StudentWithRelations[];
  isLoading: boolean;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export const StudentTable = ({
  students,
  isLoading,
  onToggleActive,
  onDelete,
}: StudentTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest overflow-hidden border-t border-surface-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Student
                </th>
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Academic Info
                </th>
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Placement
                </th>
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Contact
                </th>
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Status
                </th>
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant text-right border-b border-surface-container">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full bg-slate-100/50" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-5 w-32 bg-slate-100/50" />
                        <Skeleton className="h-3 w-16 bg-slate-100/50" />
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 bg-slate-100/50" />
                      <Skeleton className="h-4 w-28 bg-slate-100/50" />
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20 bg-slate-100/50" />
                      <Skeleton className="h-3 w-32 bg-slate-100/50" />
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <Skeleton className="h-4 w-28 bg-slate-100/50" />
                  </td>
                  <td className="py-5 px-6">
                    <Skeleton className="h-6 w-16 bg-slate-100/50 rounded-full" />
                  </td>
                  <td className="py-5 px-6">
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

  if (students.length === 0) {
    return (
      <div className="bg-surface-container-lowest py-20 flex flex-col items-center justify-center text-center space-y-4 border-t border-surface-container">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
          <User size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            No students found
          </h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
            There are no students matching your criteria. Try adjusting your
            filters or enroll a new student.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest overflow-hidden animate-in fade-in zoom-in-95 duration-500 border-t border-surface-container">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Student
              </th>
              <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Academic Info
              </th>
              <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Placement
              </th>
              <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Contact
              </th>
              <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Status
              </th>
              <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant text-right border-b border-surface-container">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {students.map((student, index) => (
              <tr
                key={student.id}
                className="hover:bg-surface-container-low/30 transition-colors group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Student Identity */}
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full bg-surface-container flex items-center justify-center transition-colors group-hover:bg-white",
                        index % 3 === 0
                          ? "text-primary shadow-sm"
                          : "text-on-surface-variant",
                      )}
                    >
                      <User size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-on-surface tracking-tight leading-tight">
                        {student.name}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10 tracking-wider">
                          {student.studentId}
                        </span>
                        <span className="text-[10px] font-medium text-on-surface-variant/60 uppercase">
                          {student.gender.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Academic Info: Class & Batch */}
                <td className="py-5 px-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-emerald-500 shrink-0" />
                      <span className="text-sm font-bold tracking-tight text-on-surface">
                        {student.className}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-on-surface-variant/60 shrink-0" />
                      <span className="text-xs font-medium text-on-surface-variant">
                        {student.batch?.name ?? "—"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Placement: Roll, Section, Group, Shift */}
                <td className="py-5 px-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-emerald-500 shrink-0" />
                      <span className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest">
                        Roll
                      </span>
                      <span className="text-sm font-bold text-on-surface font-mono">
                        {student.roll || "—"}
                      </span>
                    </div>
                    {/* Compact Badges for specific placement */}
                    {(student.section || student.group || student.shift) && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {student.section && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-sky-50 text-sky-600 border border-sky-100">
                            Sec {student.section}
                          </span>
                        )}
                        {student.group && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-violet-50 text-violet-600 border border-violet-100">
                            {student.group}
                          </span>
                        )}
                        {student.shift && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-600 border border-amber-100">
                            {student.shift}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </td>

                {/* Contact */}
                <td className="py-5 px-6">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-on-surface-variant/50 shrink-0" />
                    <a
                      href={`tel:${student.primaryPhone}`}
                      className="text-sm font-medium text-on-surface hover:text-emerald-600 transition-colors"
                    >
                      {student.primaryPhone}
                    </a>
                  </div>
                </td>

                {/* Status */}
                <td className="py-5 px-6">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      student.isActive
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm"
                        : "bg-slate-50 text-slate-400 border-slate-100",
                    )}
                  >
                    {student.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-5 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="text-slate-400 hover:text-emerald-600 transition-all cursor-pointer rounded-lg hover:bg-emerald-50"
                    >
                      <Link href={`/students/${student.id}`}>
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
                          asChild
                          className="cursor-pointer font-medium text-slate-600"
                        >
                          <Link href={`/students/edit/${student.id}`}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer font-medium text-slate-600"
                          onClick={() => onToggleActive(student.id)}
                        >
                          {student.isActive ? (
                            <>
                              <ToggleLeft className="w-4 h-4 mr-2 text-amber-500" /> Deactivate
                            </>
                          ) : (
                            <>
                              <ToggleRight className="w-4 h-4 mr-2 text-emerald-500" /> Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer font-medium"
                          onClick={() => onDelete(student.id, student.name)}
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
};
