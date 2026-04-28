"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAdmissionPaymentById } from "@workspace/api-client";
import { AdmissionPaymentEditForm } from "../form/admission-payment-edit-form";

interface EditAdmissionPaymentViewProps {
  paymentId: string;
}

export const EditAdmissionPaymentView = ({
  paymentId,
}: EditAdmissionPaymentViewProps) => {
  const { data } = useAdmissionPaymentById(paymentId);

  if (!data) return null;

  return (
    <main className="min-h-screen w-full max-w-5xl mx-auto">
      <div className="hidden md:block py-16 px-8">
        <div>
          <Link
            href="/payments/admission-payments"
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group mb-2 w-fit"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Back to list
            </span>
          </Link>
          <div className="flex flex-col gap-1 border-none shadow-none">
            <h2 className="text-3xl font-extrabold text-on-background tracking-tight">
              Edit Admission Payment
            </h2>
            <p className="text-on-surface-variant text-sm">
              Update details for an existing admission payment
            </p>
          </div>
        </div>
      </div>
      <div className="px-4 md:px-0">
        <AdmissionPaymentEditForm payment={data} />
      </div>
    </main>
  );
};
