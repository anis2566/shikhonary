"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { EditAcademicYearForm } from "../form/edit-academic-year-form";

export function AcademicYearEditView() {
  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-8 font-['Inter']">
      {/* Breadcrumb and Title Section */}
      <div className="mb-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group mb-2"
        >
          <ArrowLeft className="text-base group-hover:-translate-x-1 transition-transform size-4" />
          <span className="text-xs font-medium uppercase tracking-wider">
            Back to list
          </span>
        </button>
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-extrabold text-on-background tracking-tight">
            Edit Academic Year
          </h2>
          <p className="text-on-surface-variant text-sm">
            Update an academic year session to reflect the organizational timeline.
          </p>
        </div>
      </div>

      <EditAcademicYearForm />
    </div>
  );
}
