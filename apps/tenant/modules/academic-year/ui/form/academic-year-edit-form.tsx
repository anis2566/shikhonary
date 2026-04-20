"use client";

import { EditAcademicYearForm } from "./desktop/edit-academic-year-form.js";
import { TenantTypes } from "@workspace/db";

interface AcademicYearEditFormProps {
  academicYear: TenantTypes.AcademicYear;
}

export const AcademicYearEditForm = ({
  academicYear,
}: AcademicYearEditFormProps) => {
  return (
    <>
      {/* <div className="md:hidden">
        <MobileEditAcademicYearForm />
      </div> */}

      <div className="hidden md:block">
        <EditAcademicYearForm academicYear={academicYear} />
      </div>
    </>
  );
};
