"use client";

import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { useEditMonthlyFeeModal } from "@workspace/ui/hooks/use-edit-monthly-fee-modal";

interface MonthlyFeeCardProps {
  fee: {
    id: string;
    amount: number;
    academicYearId: string;
    academicClassId: string;
    className: string;
    academicYear: {
      name: string;
    };
  };
  onDelete: (id: string, name: string) => void;
}

export const MonthlyFeeCard = ({ fee, onDelete }: MonthlyFeeCardProps) => {
  const editModal = useEditMonthlyFeeModal();

  return (
    <div className="bg-surface-container-lowest rounded-lg p-6 shadow-[0_8px_24px_-4px_rgba(11,28,48,0.06)] flex flex-col gap-6 relative overflow-hidden group border border-surface-container/50">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />

      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700/60 mb-1 block">
              Academic Year
            </span>
            <div className="text-xl font-bold text-on-surface">
              {fee.academicYear.name}
            </div>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700/60 mb-1 block">
              Class
            </span>
            <div className="text-sm font-black text-on-surface flex items-center gap-1.5 px-3 py-1 bg-surface-container-low w-fit rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {fee.className}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700/60 mb-1 block">
            Amount
          </span>
          <div className="text-4xl font-black text-emerald-600 tabular-nums leading-none">
            {fee.amount.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() =>
            editModal.onOpen(fee.id, {
              academicYearId: fee.academicYearId,
              academicClassId: fee.academicClassId,
              amount: fee.amount,
            })
          }
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-surface-container-low text-on-secondary-container rounded-lg font-bold text-sm hover:bg-emerald-50 transition-colors active:scale-95"
        >
          <Edit size={18} strokeWidth={2.5} />
          Edit
        </button>
        <button
          onClick={() => onDelete(fee.id, `${fee.className} (${fee.academicYear.name})`)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-50 text-rose-600 rounded-lg font-bold text-sm hover:bg-rose-100 transition-colors active:scale-95"
        >
          <Trash2 size={18} strokeWidth={2.5} />
          Delete
        </button>
      </div>
    </div>
  );
};
