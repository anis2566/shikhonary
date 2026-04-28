"use client";

import React from "react";
import { LayoutGrid, CreditCard } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { AdmissionPaymentCard } from "./admission-payment-card";
import { Skeleton } from "@workspace/ui/components/skeleton";

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

interface AdmissionPaymentGridProps {
  payments: AdmissionPaymentWithRelations[];
  isLoading: boolean;
  onDelete: (id: string, transactionId: string) => void;
}

export function AdmissionPaymentGrid({
  payments,
  isLoading,
  onDelete,
}: AdmissionPaymentGridProps) {
  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden bg-white border-slate-100 shadow-sm p-0">
            <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-6">
                    <Skeleton className="w-12 h-12 rounded-xl bg-slate-100/50" />
                    <div className="flex gap-1">
                        <Skeleton className="h-9 w-9 rounded-lg bg-slate-100/50" />
                        <Skeleton className="h-9 w-9 rounded-lg bg-slate-100/50" />
                    </div>
                </div>
                <div className="space-y-3 mb-6">
                    <Skeleton className="h-6 w-3/4 bg-slate-100/50" />
                    <Skeleton className="h-4 w-1/2 bg-slate-100/50" />
                </div>
                <Skeleton className="h-10 w-full rounded-xl bg-slate-100/50 mb-4" />
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-24 bg-slate-100/50" />
                    <Skeleton className="h-5 w-16 rounded-full bg-slate-100/50" />
                </div>
            </div>
            <div className="p-6 pt-4 border-t border-slate-50 bg-slate-50/30">
                <div className="flex justify-between items-center mb-4">
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-12 bg-slate-100/50" />
                        <Skeleton className="h-7 w-20 bg-slate-100/50" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-lg bg-slate-100/50" />
                </div>
                <Skeleton className="h-10 w-full rounded-xl bg-slate-100/50" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
          <CreditCard size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            No payments found
          </h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
            There are no admission payments matching your criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-500">
      {payments.map((payment, i) => (
        <AdmissionPaymentCard
          key={payment.id}
          payment={payment}
          index={i}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
