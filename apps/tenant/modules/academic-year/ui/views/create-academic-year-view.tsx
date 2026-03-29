"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { CreateAcademicYearForm } from "../form/create-academic-year-form";
import { useCreateAcademicYear } from "@workspace/api-client";

interface CreateAcademicYearViewProps {
  tenantId: string;
}

export const CreateAcademicYearView: React.FC<CreateAcademicYearViewProps> = ({
  tenantId,
}) => {
  const router = useRouter();
  const createMutation = useCreateAcademicYear();

  const handleCancel = () => {
    router.push(`/${tenantId}/academic-years`);
  };

  const handleSubmit = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      router.push(`/${tenantId}/academic-years`);
    } catch (_error) {
      // toast is handled in the hook
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Create Academic Year
          </h1>
          <p className="text-muted-foreground text-sm">
            Add a new academic year session
          </p>
        </div>
      </div>

      <CreateAcademicYearForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default CreateAcademicYearView;
