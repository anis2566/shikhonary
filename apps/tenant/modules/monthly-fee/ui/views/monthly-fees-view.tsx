"use client";

import { useMonthlyFees, useDeleteMonthlyFee } from "@workspace/api-client";
import { List } from "../components/desktop/list";
import { MobileList } from "../components/mobile/list";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { CreateMonthlyFeeModal } from "../components/desktop/modal/create-monthly-fee-modal";
import { EditMonthlyFeeModal } from "../components/desktop/modal/edit-monthly-fee-modal";

export const MonthlyFeesView = () => {
  const { openDeleteModal } = useDeleteModal();
  const { data: monthlyFees, isLoading } = useMonthlyFees();
  const deleteMutation = useDeleteMonthlyFee();

  const feeItems = monthlyFees?.items || [];
  const total = monthlyFees?.total || feeItems.length;

  const handleDeleteFee = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "monthlyFee",
      entityName: `${name}`,
      onConfirm: async (id) => {
        await deleteMutation.mutateAsync({ id });
      },
    });
  };

  return (
    <>
      <CreateMonthlyFeeModal />
      <EditMonthlyFeeModal />
      {/* Desktop View */}
      <div className="hidden md:block">
        <List
          monthlyFees={feeItems}
          isLoading={isLoading}
          total={total}
          onDelete={handleDeleteFee}
        />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <MobileList
          monthlyFees={feeItems}
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
