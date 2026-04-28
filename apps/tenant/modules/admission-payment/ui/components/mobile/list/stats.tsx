"use client";

import React from "react";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, Clock } from "lucide-react";
import { useAdmissionPayments } from "@workspace/api-client";

export const Stats = () => {
  const { data: paymentsData, isLoading } = useAdmissionPayments();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-8 px-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 animate-pulse h-[84px]"
          >
            <div className="h-3 w-20 bg-slate-100 rounded mb-2" />
            <div className="h-6 w-10 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const payments = paymentsData?.items || [];
  const totalAmount = payments.reduce((acc, curr) => acc + Number(curr.paidAmount), 0);
  const completedCount = payments.filter(p => p.status === "COMPLETED").length;
  const pendingCount = payments.filter(p => p.status === "PENDING").length;

  return (
    <div className="grid grid-cols-2 gap-3 mb-8 px-6 mt-2">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
          Total Collection
        </p>
        <p className="text-xl font-black text-[#0b1c30]">
          ৳{totalAmount.toLocaleString()}
        </p>
      </div>
      
      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col justify-center">
        <p className="text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-1">
          Completed
        </p>
        <div className="flex items-center gap-2">
          <p className="text-xl font-black text-emerald-900">
            {completedCount}
          </p>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
          Pending
        </p>
        <p className="text-xl font-black text-amber-600">
          {pendingCount}
        </p>
      </div>

      <div className="bg-[#0b1c30] p-4 rounded-xl shadow-sm flex flex-col justify-center">
        <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1">
          Payments
        </p>
        <p className="text-xl font-black text-white">
          {payments.length}
        </p>
      </div>
    </div>
  );
};
