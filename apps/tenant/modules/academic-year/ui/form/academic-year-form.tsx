"use client";

import { NewAcademicYearForm } from "./desktop/new-academic-year-form";
import { MobileNewAcademicYearForm } from "./mobile/new-academic-year-form";

export const AcademicYearForm = () => {
  return (
    <>
      <div className="md:hidden">
        <MobileNewAcademicYearForm />
      </div>

      <div className="hidden md:block">
        <NewAcademicYearForm />
      </div>
    </>
  );
};
