"use client";

import React from "react";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { useAdmissionPayments } from "@workspace/api-client";

export const Stats = () => {
  const { data: paymentsData } = useAdmissionPayments();
  
  const payments = paymentsData?.items || [];
  
  const totalAmount = payments.reduce((acc, curr) => acc + Number(curr.paidAmount), 0);
  const completedCount = payments.filter(p => p.status === "COMPLETED").length;
  const pendingCount = payments.filter(p => p.status === "PENDING").length;

  const stats = [
    {
      label: "Total Collection",
      value: `৳${totalAmount.toLocaleString()}`,
      icon: CreditCard,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      borderColor: "border-emerald-100",
    },
    {
      label: "Completed",
      value: completedCount.toString(),
      icon: CheckCircle2,
      color: "text-blue-600",
      bg: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      label: "Pending",
      value: pendingCount.toString(),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      borderColor: "border-amber-100",
    },
    {
      label: "Success Rate",
      value: payments.length > 0 ? `${Math.round((completedCount / payments.length) * 100)}%` : "0%",
      icon: TrendingUp,
      color: "text-violet-600",
      bg: "bg-violet-50",
      borderColor: "border-violet-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-[#f8f9ff]/80 backdrop-blur-[16px] border border-emerald-500/10 p-6 rounded-[12px] shadow-[0_24px_48px_-12px_rgba(11,28,48,0.06)] flex items-center gap-5 group transition-all hover:scale-[1.02]"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color} group-hover:rotate-6 transition-all duration-300 flex-shrink-0 shadow-sm border ${stat.borderColor}`}>
              <stat.icon className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {stat.label}
              </h3>
              <p className="text-2xl font-extrabold text-[#0b1c30] tracking-tight">
                {stat.value}
              </p>
            </div>
          </div>
      ))}
    </div>
  );
};
