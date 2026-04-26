"use client";

import { useAdmissionFees, useDeleteAdmissionFee } from "@workspace/api-client";
import { List } from "../components/desktop/list";
import { MobileList } from "../components/mobile/list";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { CreateAdmissionFeeModal } from "../components/desktop/modal/create-admission-fee-modal";
import { EditAdmissionFeeModal } from "../components/desktop/modal/edit-admission-fee-modal";

export const AdmissionFeesView = () => {
  const { openDeleteModal } = useDeleteModal();
  const { data: admissionFees, isLoading } = useAdmissionFees();
  const deleteMutation = useDeleteAdmissionFee();

  const feeItems = admissionFees?.items || [];
  const total = admissionFees?.total || feeItems.length;

  const handleDeleteFee = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "admissionFee",
      entityName: `${name}`,
      onConfirm: async (id) => {
        await deleteMutation.mutateAsync({ id });
      },
    });
  };

  return (
    <>
      <CreateAdmissionFeeModal />
      <EditAdmissionFeeModal />
      {/* Desktop View */}
      <div className="hidden md:block">
        <List
          admissionFees={feeItems}
          isLoading={isLoading}
          total={total}
          onDelete={handleDeleteFee}
        />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <MobileList
          admissionFees={feeItems}
          isLoading={isLoading}
          total={total}
          onDelete={handleDeleteFee}
        />
      </div>

      {/* Floating Background Decorative Elements */}
      <div className="fixed top-[20%] -left-16 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="fixed bottom-[10%] -right-16 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl -z-10 pointer-events-none" />
    </>
  );
};
