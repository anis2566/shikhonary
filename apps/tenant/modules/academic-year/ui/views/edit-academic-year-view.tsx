"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  EditAcademicYearForm,
  type EditAcademicYearFormData,
} from "../form/edit-academic-year-form";
import { useAcademicYearById, useUpdateAcademicYear } from "@workspace/api-client";

interface EditAcademicYearViewProps {
  tenantId: string;
  academicYearId: string;
}

export const EditAcademicYearView: React.FC<EditAcademicYearViewProps> = ({
  tenantId,
  academicYearId,
}) => {
  const router = useRouter();
  const { data: academicYear } = useAcademicYearById(academicYearId);
  const updateMutation = useUpdateAcademicYear();

  const handleCancel = () => {
    router.push(`/${tenantId}/academic-years`);
  };

  const handleSubmit = async (data: EditAcademicYearFormData) => {
    try {
      await updateMutation.mutateAsync({ id: academicYearId, data });
      router.push(`/${tenantId}/academic-years`);
    } catch (_error) {
      // toast is handled in the hook
    }
  };

  if (!academicYear) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <p className="text-muted-foreground font-medium">
          Academic year not found.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push(`/${tenantId}/academic-years`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Edit Academic Year
          </h1>
          <p className="text-muted-foreground text-sm">
            Update academic year "{academicYear.name}"
          </p>
        </div>
      </div>

      <EditAcademicYearForm
        initialData={academicYear}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditAcademicYearView;
