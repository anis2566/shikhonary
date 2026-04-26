"use client";

import { useCounters, useDeleteCounter } from "@workspace/api-client";
import { List } from "../components/desktop/list";
import { MobileList } from "../components/mobile/list";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { CreateCounterModal } from "../components/desktop/modal/create-counter-modal";
import { EditCounterModal } from "../components/desktop/modal/edit-counter-modal";

export const CountersView = () => {
  const { openDeleteModal } = useDeleteModal();
  const { data: counters, isLoading } = useCounters();
  const deleteMutation = useDeleteCounter();

  const counterItems = counters?.items || [];
  const total = counters?.total || counterItems.length;

  const handleDeleteCounter = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "counter",
      entityName: `${name}`,
      onConfirm: async (id) => {
        await deleteMutation.mutateAsync({ id });
      },
    });
  };

  return (
    <>
      <CreateCounterModal />
      <EditCounterModal />
      {/* Desktop View */}
      <div className="hidden md:block">
        <List
          counters={counterItems}
          isLoading={isLoading}
          total={total}
          onDelete={handleDeleteCounter}
        />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <MobileList
          counters={counterItems}
          isLoading={isLoading}
          total={total}
          onDelete={handleDeleteCounter}
        />
      </div>

      {/* Floating Background Decorative Elements */}
      <div className="fixed top-[20%] -left-16 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="fixed bottom-[10%] -right-16 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl -z-10 pointer-events-none" />
    </>
  );
};
