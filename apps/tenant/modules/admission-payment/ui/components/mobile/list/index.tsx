"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "./header";
import { Filters } from "./filters";
import { Stats } from "./stats";
import { AdmissionPaymentCard } from "./card";
import { Pagination } from "./pagination";
import { Card } from "@workspace/ui/components/card";
import { CreditCard } from "lucide-react";
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

interface MobileListProps {
  isLoading: boolean;
  payments: AdmissionPaymentWithRelations[];
  total: number;
  onDelete: (id: string, transactionId: string) => void;
}

export const MobileList = ({
  isLoading,
  payments,
  total,
  onDelete,
}: MobileListProps) => {
  return (
    <div className="bg-slate-50/30 text-slate-900 min-h-screen flex flex-col font-sans pb-20">
      <Header />
      <Stats />

      <main className="flex-grow flex flex-col">
        <div className="px-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-12 rounded-full bg-slate-100/50" />
                        <Skeleton className="h-4 w-16 bg-slate-100/50" />
                      </div>
                      <Skeleton className="h-6 w-3/4 bg-slate-100/50" />
                      <Skeleton className="h-3 w-1/2 bg-slate-100/50" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-xl bg-slate-100/50" />
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-16 bg-slate-100/50" />
                      <Skeleton className="h-6 w-24 bg-slate-100/50" />
                    </div>
                    <Skeleton className="h-10 w-20 rounded-xl bg-slate-100/50" />
                  </div>

                  <Skeleton className="h-11 w-full rounded-xl bg-slate-100/50 pt-2" />
                </div>
              ))
            ) : payments.length > 0 ? (
              payments.map((payment, i) => (
                <AdmissionPaymentCard
                  key={payment.id}
                  payment={payment}
                  index={i}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <Card className="text-center py-20 text-slate-300 font-medium rounded-3xl border-slate-100 bg-white shadow-sm mx-6">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                    <CreditCard className="w-10 h-10" />
                  </div>
                  <p className="text-lg text-slate-900 font-bold tracking-tight">
                    No payments found
                  </p>
                  <p className="text-sm text-slate-400">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              </Card>
            )}
          </AnimatePresence>
        </div>

        <Pagination total={total} />
      </main>
    </div>
  );
};
