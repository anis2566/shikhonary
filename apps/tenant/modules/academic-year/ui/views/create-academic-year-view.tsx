"use client";

import React from "react";
import { CreateAcademicYearForm } from "../form/create-academic-year-form";

export const CreateAcademicYearView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <CreateAcademicYearForm />
    </div>
  );
};

export default CreateAcademicYearView;
