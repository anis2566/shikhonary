"use client";

import {
  useAcademicYears,
  useDeleteAcademicYear,
  useToggleAcademicYearActive,
} from "@workspace/api-client";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

import { List } from "../components/desktop/list";
import { MobileList } from "../components/mobile/list";

export function AcademicYearListView() {
  const { openDeleteModal } = useDeleteModal();

  const { data: academicYearsData, isLoading: isLoadingYears } =
    useAcademicYears();

  const deleteMutation = useDeleteAcademicYear();
  const toggleActiveMutation = useToggleAcademicYearActive();

  const academicYears = academicYearsData?.data || [];
  const total = academicYearsData?.total || academicYears.length;

  const toggleActive = async (id: string) => {
    await toggleActiveMutation.mutateAsync(id);
  };

  const handleDeleteAcademicYear = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "academicYear",
      entityName: name,
      onConfirm: (id) => {
        deleteMutation.mutateAsync(id);
      },
    });
  };

  return (
    <>
      {/* Mobile View - Separated Component */}
      <div className="md:hidden">
        <MobileList
          academicYears={academicYears}
          isLoading={isLoadingYears}
          onToggleActive={toggleActive}
          onDelete={handleDeleteAcademicYear}
        />
      </div>

      {/* Desktop View */}
      <List
        academicYears={academicYears}
        isLoadingYears={isLoadingYears}
        toggleActive={toggleActive}
        onDelete={handleDeleteAcademicYear}
        total={total}
      />
    </>
  );
}
