"use client";

import {
  BookOpen,
  Calendar,
  CircleDollarSign,
  Edit,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useEditMonthlyFeeModal } from "@workspace/ui/hooks/use-edit-monthly-fee-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

interface MonthlyFeeWithRelations {
  id: string;
  amount: number;
  academicYearId: string;
  academicClassId: string;
  className: string;
  academicYear: {
    name: string;
  };
}

interface MonthlyFeeTableProps {
  monthlyFees: MonthlyFeeWithRelations[];
  isLoading: boolean;
  onDelete: (id: string, name: string) => void;
}

export const MonthlyFeeTable = ({
  monthlyFees,
  isLoading,
  onDelete,
}: MonthlyFeeTableProps) => {
  const editModal = useEditMonthlyFeeModal();

  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Academic Year
                </th>
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Class
                </th>
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Amount
                </th>
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant text-right border-b border-surface-container">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {[...Array(3)].map((_, i) => (
                <tr key={i}>
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg bg-slate-100/50" />
                      <Skeleton className="h-5 w-32 bg-slate-100/50" />
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <Skeleton className="h-5 w-24 bg-slate-100/50" />
                  </td>
                  <td className="py-3 px-6">
                    <Skeleton className="h-8 w-20 bg-slate-100/50" />
                  </td>
                  <td className="py-3 px-6">
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

  if (monthlyFees.length === 0) {
    return (
      <div className="bg-surface-container-lowest py-20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
          <CircleDollarSign size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            No fees found
          </h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
            There are no monthly fees matching your criteria. Try adjusting
            your filters or add a new one.
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
                Academic Year
              </th>
              <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Class
              </th>
              <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Amount
              </th>
              <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant text-right border-b border-surface-container">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {monthlyFees.map((fee, index) => (
              <tr
                key={fee.id}
                className="hover:bg-surface-container-low/30 transition-colors group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-3 px-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded bg-surface-container flex items-center justify-center transition-colors group-hover:bg-white",
                        index % 3 === 0
                          ? "text-blue-500"
                          : "text-on-surface-variant",
                      )}
                    >
                      <Calendar size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-base font-semibold text-on-surface tracking-tight">
                      {fee.academicYear.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-500" />
                    <span className="text-sm font-bold tracking-tight text-on-surface">
                      {fee.className}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign size={16} className="text-blue-500" />
                    <span className="text-sm font-bold tracking-tight text-on-surface">
                      {fee.amount.toLocaleString()} TK
                    </span>
                  </div>
                </td>
                <td className="py-3 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-blue-600 transition-all cursor-pointer rounded-lg hover:bg-blue-50 outline-none focus:outline-none focus:ring-0"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          className="cursor-pointer font-medium text-slate-600"
                          onClick={() =>
                            editModal.onOpen(fee.id, {
                              academicYearId: fee.academicYearId,
                              academicClassId: fee.academicClassId,
                              amount: fee.amount,
                            })
                          }
                        >
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer font-medium"
                          onClick={() =>
                            onDelete(
                              fee.id,
                              `${fee.className} (${fee.academicYear.name})`,
                            )
                          }
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
