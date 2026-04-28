"use client";

import React from "react";
import {
  Edit,
  Trash2,
  Eye,
  CreditCard,
  Hash,
  Calendar,
  User,
} from "lucide-react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";

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

export interface AdmissionPaymentCardProps {
  payment: AdmissionPaymentWithRelations;
  index: number;
  onDelete: (id: string, transactionId: string) => void;
}

export function AdmissionPaymentCard({
  payment,
  index,
  onDelete,
}: AdmissionPaymentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="group relative overflow-hidden bg-white hover:shadow-xl transition-all duration-300 border-slate-100 hover:border-emerald-200">
        <CardContent className="p-0">
          <div className="p-6 pb-4">
            <div className="flex justify-between items-start">
              <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white shadow-sm border border-emerald-100 group-hover:border-emerald-500">
                <CreditCard className="w-6 h-6" />
              </div>

              <div className="flex bg-slate-50/50 rounded-xl p-1 gap-1 border border-slate-100/50">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm transition-all rounded-lg"
                  asChild
                  title="Edit"
                >
                  <Link href={`/payments/admission-payments/edit/${payment.id}`}>
                    <Edit className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-white hover:shadow-sm transition-all rounded-lg"
                  onClick={() => onDelete(payment.id, payment.transactionId || payment.id)}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mt-5 mb-4">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 tracking-tight">
                {payment.student.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <User size={12} className="text-emerald-500/70" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  ID: {payment.student.studentId}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-100">
                <Hash size={14} className="text-slate-400" />
                <span className="text-xs font-mono font-medium text-slate-600 truncate">
                  {payment.transactionId || "NO-TRANSACTION-ID"}
                </span>
              </div>
              
              <div className="flex items-center justify-between gap-2 px-1">
                 <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs">
                    <Calendar size={14} className="text-emerald-500" />
                    {format(new Date(payment.paymentDate), "MMM dd, yyyy")}
                 </div>
                 <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-none">
                    {payment.paymentMethod}
                 </Badge>
              </div>
            </div>
          </div>

          <div className="mt-auto bg-slate-50/50 p-6 pt-4 border-t border-slate-100/50">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">
                  Amount Paid
                </span>
                <span className="text-xl font-black text-slate-900 tracking-tighter">
                  ৳{Number(payment.paidAmount).toLocaleString()}
                </span>
              </div>
              <Badge
                className={cn(
                  "px-3 py-1 text-[10px] font-black rounded-lg border-none shadow-sm",
                  payment.status === "COMPLETED"
                    ? "bg-emerald-500 text-white"
                    : "bg-amber-500 text-white",
                )}
              >
                {payment.status}
              </Badge>
            </div>
            <Button
              asChild
              variant="outline"
              className="w-full h-10 group-hover:border-emerald-600 group-hover:text-emerald-700 bg-white transition-all font-bold text-xs gap-2 rounded-xl shadow-sm"
            >
              <Link href={`/payments/admission-payments/${payment.id}`}>
                <Eye className="w-4 h-4 text-emerald-500" />
                Transaction Details
              </Link>
            </Button>
          </div>
        </CardContent>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </Card>
    </motion.div>
  );
}
