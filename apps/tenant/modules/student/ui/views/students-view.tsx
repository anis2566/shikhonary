"use client";

import { useStudents } from "@workspace/api-client";
import { List } from "../components/desktop/list";
import { MobileList } from "../components/mobile/list";
import {
  useDeleteStudent,
  useToggleStudentActive,
} from "@workspace/api-client";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

export const StudentsView = () => {
  const { openDeleteModal } = useDeleteModal();

  const { data: students, isLoading } = useStudents();

  const deleteMutation = useDeleteStudent();
  const toggleActiveMutation = useToggleStudentActive();

  const studentItems = students?.items || [];
  const total = students?.total || studentItems.length;

  const toggleActive = async (id: string) => {
    await toggleActiveMutation.mutateAsync({ id });
  };

  const handleDeleteStudent = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "student",
      entityName: name,
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
          students={students?.items ?? []}
          isLoading={isLoading}
          total={total}
          onToggleActive={toggleActive}
          onDelete={handleDeleteStudent}
        />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <MobileList
          students={students?.items ?? []}
          isLoading={isLoading}
          total={total}
          onToggleActive={toggleActive}
          onDelete={handleDeleteStudent}
        />
      </div>

      {/* Floating Background Decorative Elements */}
      <div className="fixed top-[20%] -left-16 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="fixed bottom-[10%] -right-16 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl -z-10 pointer-events-none" />
    </>
  );
};
