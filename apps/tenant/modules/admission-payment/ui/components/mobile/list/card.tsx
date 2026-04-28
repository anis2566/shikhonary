"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, CreditCard, MoreHorizontal, User, Trash2, Edit, Eye } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import Link from "next/link";

interface AdmissionPaymentWithRelations {
  id: string;
  studentId: string;
  student: {
    name: string;
    studentId: string;
  };
  academicYear: {
    name: string;
  };
  amount: any;
  discount: any;
  paidAmount: any;
  paymentDate: Date;
  paymentMethod: string;
  transactionId: string | null;
  status: string;
  remarks: string | null;
}

interface AdmissionPaymentCardProps {
  payment: AdmissionPaymentWithRelations;
  index: number;
  onDelete: (id: string, transactionId: string) => void;
}

export const AdmissionPaymentCard = ({
  payment,
  index,
  onDelete,
}: AdmissionPaymentCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-4 active:scale-[0.98] transition-all relative overflow-hidden group"
    >
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                payment.status === "COMPLETED"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-amber-50 text-amber-600 border-amber-100",
              )}
            >
              {payment.status}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
              <Calendar className="w-3 h-3" />
              {format(new Date(payment.paymentDate), "MMM dd, yyyy")}
            </div>
          </div>
          <h3 className="text-lg font-bold text-[#0b1c30] tracking-tight group-hover:text-emerald-600 transition-colors line-clamp-1">
            {payment.student.name}
          </h3>
          <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 italic">
            <User className="w-3.5 h-3.5 text-emerald-500/70" />
            Student ID: {payment.student.studentId}
          </p>
          {payment.transactionId && (
            <p className="text-[10px] font-mono font-medium text-slate-500 flex items-center gap-1 mt-1 bg-slate-50 w-fit px-1.5 py-0.5 rounded border border-slate-100">
              TXN: {payment.transactionId}
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 hover:text-emerald-600 transition-all border-none"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-xl">
            <DropdownMenuItem asChild className="cursor-pointer font-bold text-slate-600">
              <Link href={`/payments/admission-payments/${payment.id}`}>
                <Eye className="w-4 h-4 mr-2 text-emerald-500" /> View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer font-bold text-slate-600">
              <Link href={`/payments/admission-payments/edit/${payment.id}`}>
                <Edit className="w-4 h-4 mr-2 text-blue-500" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-50" />
            <DropdownMenuItem
              className="text-rose-500 focus:text-rose-600 focus:bg-rose-50 cursor-pointer font-bold"
              onClick={() => onDelete(payment.id, payment.transactionId || payment.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Paid Amount
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-[#0b1c30] tracking-tight">
              ৳{Number(payment.paidAmount).toLocaleString()}
            </span>
            {Number(payment.discount) > 0 && (
              <span className="text-xs font-bold text-emerald-500">
                -৳{Number(payment.discount).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="bg-[#f8f9ff] px-4 py-2 rounded-xl border border-slate-100 flex flex-col items-end">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
            Method
          </span>
          <span className="text-xs font-bold text-[#0b1c30]">
            {payment.paymentMethod}
          </span>
        </div>
      </div>

      <div className="pt-2">
        <Button
          asChild
          variant="outline"
          className="w-full h-11 rounded-xl border-slate-100 font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-all gap-2"
        >
          <Link href={`/payments/admission-payments/${payment.id}`}>
            View Transaction Details
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};
