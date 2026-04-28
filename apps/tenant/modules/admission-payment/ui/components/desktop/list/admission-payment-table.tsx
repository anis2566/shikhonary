"use client";

import {
  Calendar,
  CreditCard,
  Edit,
  Eye,
  Hash,
  MoreHorizontal,
  Trash2,
  User,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
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

interface AdmissionPaymentTableProps {
  payments: AdmissionPaymentWithRelations[];
  isLoading: boolean;
  onDelete: (id: string, transactionId: string) => void;
}

export const AdmissionPaymentTable = ({
  payments,
  isLoading,
  onDelete,
}: AdmissionPaymentTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest overflow-hidden border-t border-surface-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Date
                </th>
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Student
                </th>
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Transaction ID
                </th>
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Amount
                </th>
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                  Status
                </th>
                <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant text-right border-b border-surface-container">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="py-5 px-6">
                    <Skeleton className="h-5 w-24 bg-slate-100/50" />
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg bg-slate-100/50" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32 bg-slate-100/50" />
                        <Skeleton className="h-4 w-20 bg-slate-100/50" />
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <Skeleton className="h-5 w-28 bg-slate-100/50" />
                  </td>
                  <td className="py-5 px-6">
                    <Skeleton className="h-5 w-20 bg-slate-100/50" />
                  </td>
                  <td className="py-5 px-6">
                    <Skeleton className="h-6 w-16 bg-slate-100/50 rounded-full" />
                  </td>
                  <td className="py-5 px-6">
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

  if (payments.length === 0) {
    return (
      <div className="bg-surface-container-lowest py-20 flex flex-col items-center justify-center text-center space-y-4 border-t border-surface-container">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
          <CreditCard size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            No payments found
          </h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
            There are no admission payments matching your criteria. Try adjusting your
            filters or add a new one.
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
                Date
              </th>
              <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Student
              </th>
              <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Transaction ID
              </th>
              <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Amount
              </th>
              <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Method
              </th>
              <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant border-b border-surface-container">
                Status
              </th>
              <th className="py-3 px-6 font-semibold text-sm text-on-surface-variant text-right border-b border-surface-container">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {payments.map((payment, index) => (
              <tr
                key={payment.id}
                className="hover:bg-surface-container-low/30 transition-colors group animate-in fade-in slide-in-from-bottom-3 fill-mode-both"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-emerald-500" />
                    <span className="text-sm font-medium text-on-surface tracking-tight">
                      {format(new Date(payment.paymentDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center transition-colors group-hover:bg-white text-primary">
                      <User size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-on-surface tracking-tight">
                        {payment.student.name}
                      </span>
                      <span className="text-xs font-medium text-on-surface-variant/60 tracking-tight">
                        ID: {payment.student.studentId}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-2 text-[#0b1c30]/70">
                    <Hash size={14} className="opacity-40" />
                    <span className="text-sm font-mono font-medium tracking-tight bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      {payment.transactionId || "N/A"}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-tight text-on-surface">
                      ৳{Number(payment.paidAmount).toLocaleString()}
                    </span>
                    {Number(payment.discount) > 0 && (
                      <span className="text-[10px] text-emerald-600 font-bold">
                        Disc: ৳{Number(payment.discount).toLocaleString()}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-5 px-6">
                  <span className="text-xs font-semibold text-on-surface-variant">
                    {payment.paymentMethod}
                  </span>
                </td>
                <td className="py-5 px-6">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      payment.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm"
                        : "bg-amber-50 text-amber-600 border-amber-100",
                    )}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="py-5 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="text-slate-400 hover:text-emerald-600 transition-all cursor-pointer rounded-lg hover:bg-emerald-50"
                    >
                      <Link href={`/payments/admission-payments/${payment.id}`}>
                        <Eye className="w-5 h-5" />
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-emerald-600 transition-all cursor-pointer rounded-lg hover:bg-emerald-50 outline-none focus:outline-none focus:ring-0"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild className="cursor-pointer font-medium text-slate-600">
                          <Link href={`/payments/admission-payments/edit/${payment.id}`}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer font-medium"
                          onClick={() => onDelete(payment.id, payment.transactionId || payment.id)}
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
