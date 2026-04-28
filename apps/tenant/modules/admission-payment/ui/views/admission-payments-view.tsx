"use client";

import {
  useAdmissionPayments,
  useDeleteAdmissionPayment,
} from "@workspace/api-client";
import { List } from "../components/desktop/list";
import { MobileList } from "../components/mobile/list";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

export const AdmissionPaymentsView = () => {
  const { openDeleteModal } = useDeleteModal();

  const { data: paymentsData, isLoading } = useAdmissionPayments();

  const deleteMutation = useDeleteAdmissionPayment();

  const payments = paymentsData?.items || [];
  const total = paymentsData?.total || payments.length;

  const handleDeletePayment = (id: string, transactionId: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "admissionPayment",
      entityName: transactionId,
      onConfirm: (id) => {
        deleteMutation.mutateAsync({ id });
      },
    });
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        <List
          payments={payments}
          isLoading={isLoading}
          total={total}
          onDelete={handleDeletePayment}
        />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <MobileList
          isLoading={isLoading}
          payments={payments}
          total={total}
          onDelete={handleDeletePayment}
        />
      </div>

      {/* Floating Background Decorative Elements */}
      <div className="fixed top-[20%] -left-16 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="fixed bottom-[10%] -right-16 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl -z-10 pointer-events-none" />
    </>
  );
};
