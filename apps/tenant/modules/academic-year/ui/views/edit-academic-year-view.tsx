"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAcademicYearById } from "@workspace/api-client";
import { AcademicYearEditForm } from "../form/academic-year-edit-form";

interface EditAcademicYearViewProps {
  academicYearId: string;
}

export const EditAcademicYearView = ({
  academicYearId,
}: EditAcademicYearViewProps) => {
  const { data } = useAcademicYearById(academicYearId);

  if (!data) return null;

  return (
    <>
      <main className="min-h-screen w-full max-w-5xl mx-auto">
        <div className="hidden md:block py-16 px-8">
          {/* Breadcrumb and Title Section */}
          <div>
            <Link
              href="/academic-years"
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group mb-2 w-fit"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Back to list
              </span>
            </Link>
            <div className="flex flex-col gap-1 border-none shadow-none">
              <h2 className="text-3xl font-extrabold text-on-background tracking-tight">
                Edit Academic Year
              </h2>
              <p className="text-on-surface-variant text-sm">
                Customize an existing academic year
              </p>
            </div>
          </div>
        </div>
        <AcademicYearEditForm academicYear={data} />
      </main>
    </>
  );
};
