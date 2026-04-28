"use client";

import { useState } from "react";
import { Header } from "./header";
import { Filters } from "./filters";
import { Stats } from "./stats";
import { AdmissionPaymentTable } from "./admission-payment-table";
import { AdmissionPaymentGrid } from "./admission-payment-grid";
import { Pagination } from "./pagination";

export type ViewMode = "table" | "grid";

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

interface AdmissionPaymentListProps {
  payments: AdmissionPaymentWithRelations[];
  isLoading: boolean;
  total: number;
  onDelete: (id: string, transactionId: string) => void;
}

export const List = ({
  payments,
  isLoading,
  total,
  onDelete,
}: AdmissionPaymentListProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  return (
    <div className="hidden md:block min-h-screen bg-surface relative isolate">
      <div
        aria-hidden
        className="absolute top-[20%] -left-16 w-64 h-64 rounded-full bg-emerald-200/20 blur-3xl -z-10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-[10%] -right-16 w-80 h-80 rounded-full bg-emerald-300/10 blur-3xl -z-10 pointer-events-none"
      />

      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        <Header
          title="Admission Payments"
          description="Track and manage student admission fees, discounts, and payment transactions."
        />

        <div className="mt-8">
          <Stats />
        </div>

        <div className="mt-12 bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col border border-slate-100">
          <Filters viewMode={viewMode} onViewModeChange={setViewMode} />

          <div className="relative flex-grow">
            {viewMode === "table" ? (
              <AdmissionPaymentTable
                payments={payments}
                isLoading={isLoading}
                onDelete={onDelete}
              />
            ) : (
              <div className="p-8">
                <AdmissionPaymentGrid
                  payments={payments}
                  isLoading={isLoading}
                  onDelete={onDelete}
                />
              </div>
            )}
          </div>
          
          <Pagination total={total} />
        </div>
      </main>
    </div>
  );
};
