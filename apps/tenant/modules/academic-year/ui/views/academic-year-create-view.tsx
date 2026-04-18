"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateAcademicYearForm } from "../form/create-academic-year-form";

export function AcademicYearCreateView() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto py-16 px-8 font-['Inter']">
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
            Create Academic Year
          </h2>
          <p className="text-on-surface-variant text-sm">
            Add a new academic year session to define the organizational timeline.
          </p>
        </div>
      </div>

      <CreateAcademicYearForm />
    </div>
  );
}
