"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Hash,
  Calendar,
  GraduationCap,
  Trash2,
  Edit2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { useEditCounterModal } from "@workspace/ui/hooks/use-edit-counter-modal";

interface CounterWithRelations {
  id: string;
  value: number;
  className: string;
  academicYearId: string;
  academicClassId: string;
  academicYear: {
    name: string;
  };
}

interface CounterCardProps {
  counter: CounterWithRelations;
  index: number;
  onDelete: (id: string, name: string) => void;
}

export function CounterCard({ counter, index, onDelete }: CounterCardProps) {
  const editModal = useEditCounterModal();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300">
            <Hash size={20} strokeWidth={2.5} />
          </div>
          <div className="flex gap-1 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
              onClick={() =>
                editModal.onOpen(counter.id, {
                  academicYearId: counter.academicYearId,
                  academicClassId: counter.academicClassId,
                  name: counter.academicYear.name,
                  value: counter.value,
                })
              }
            >
              <Edit2 size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(counter.id, `Counter ${counter.value}`)}
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>

        <div className="space-y-1 mb-4">
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
            {counter.value}
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Count
            </span>
          </h3>
          <div className="flex items-center gap-2 text-slate-500">
            <TrendingUp size={12} className="text-emerald-500" />
            <span className="text-xs font-medium italic">Indexing active</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 p-2.5 bg-slate-50/50 rounded-xl border border-slate-100/50 group-hover:bg-emerald-50/30 transition-colors duration-300">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-500 shadow-sm">
              <Calendar size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                Academic Year
              </span>
              <span className="text-xs font-bold text-slate-700">
                {counter.academicYear.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 bg-slate-50/50 rounded-xl border border-slate-100/50 group-hover:bg-blue-50/30 transition-colors duration-300">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
              <GraduationCap size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                Academic Class
              </span>
              <span className="text-xs font-bold text-slate-700">
                {counter.className}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
