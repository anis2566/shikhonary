"use client";

import React from "react";
import { EditAcademicYearForm } from "../form/edit-academic-year-form";

interface EditAcademicYearViewProps {
  academicYearId: string;
}

export const EditAcademicYearView: React.FC<EditAcademicYearViewProps> = ({
  academicYearId,
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <EditAcademicYearForm yearId={academicYearId} />
    </div>
  );
};

export default EditAcademicYearView;
