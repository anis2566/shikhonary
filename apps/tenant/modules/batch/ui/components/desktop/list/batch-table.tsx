"use client";

import {
  BookOpen,
  Calendar,
  Edit,
  Eye,
  Hash,
  Layers,
  MoreHorizontal,
  Trash2,
  Users,
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

interface BatchWithRelations extends TenantTypes.Batch {
  academicYear: {
    name: string;
  };
  _count: {
    students: number;
  };
}

interface BatchTableProps {
  batches: BatchWithRelations[];
  isLoading: boolean;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export const BatchTable = ({
  batches,
  isLoading,
  onDelete,
}: BatchTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest overflow-hidden border-t border-surface-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Batch Name
                </th>
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Class & Year
                </th>
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Capacity
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
                      <Skeleton className="w-10 h-10 rounded-lg bg-slate-100/50" />
                      <Skeleton className="h-5 w-32 bg-slate-100/50" />
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 bg-slate-100/50" />
                      <Skeleton className="h-4 w-28 bg-slate-100/50" />
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <Skeleton className="h-5 w-20 bg-slate-100/50" />
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

  if (batches.length === 0) {
    return (
      <div className="bg-surface-container-lowest py-20 flex flex-col items-center justify-center text-center space-y-4 border-t border-surface-container">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
          <Layers size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            No batches found
          </h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
            There are no batches matching your criteria. Try adjusting your
            filters or add a new one.
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
                Batch Name
              </th>
              <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Class & Year
              </th>
              <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Capacity
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
            {batches.map((batch, index) => (
              <tr
                key={batch.id}
                className="hover:bg-surface-container-low/30 transition-colors group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded bg-surface-container flex items-center justify-center transition-colors group-hover:bg-white",
                        index % 3 === 0
                          ? "text-primary"
                          : "text-on-surface-variant",
                      )}
                    >
                      <Layers size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-base font-semibold text-on-surface tracking-tight">
                      {batch.name}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-emerald-500" />
                      <span className="text-sm font-bold tracking-tight text-on-surface">
                        {batch.className}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-on-surface-variant/60" />
                      <span className="text-xs font-medium text-on-surface-variant">
                        {batch.academicYear.name}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-emerald-500" />
                    <span className="text-sm font-bold tracking-tight text-on-surface">
                      {batch._count.students} / {batch.capacity}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      batch.isActive
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm"
                        : "bg-slate-50 text-slate-400 border-slate-100",
                    )}
                  >
                    {batch.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-5 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="text-slate-400 hover:text-emerald-600 transition-all cursor-pointer rounded-lg hover:bg-emerald-50"
                    >
                      <Link href={`/batches/${batch.id}`}>
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
                        <DropdownMenuItem asChild className="cursor-pointer font-medium text-slate-600">
                          <Link href={`/batches/edit/${batch.id}`}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer font-medium"
                          onClick={() => onDelete(batch.id, batch.name)}
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
