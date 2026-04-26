"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BatchForm } from "../form/batch-form";

export const NewBatchView = () => {
  return (
    <>
      <main className="min-h-screen w-full">
        <div className="hidden md:block py-6 px-8">
          {/* Breadcrumb and Title Section */}
          <div>
            <Link
              href="/batches"
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group mb-2 w-fit"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Back to list
              </span>
            </Link>
            <div className="flex flex-col gap-1 border-none shadow-none">
              <h2 className="text-3xl font-extrabold text-on-background tracking-tight">
                Create New Batch
              </h2>
              <p className="text-on-surface-variant text-sm">
                Organize students into batches for structured learning and
                scheduling.
              </p>
            </div>
          </div>
        </div>
        <BatchForm />
      </main>
    </>
  );
};
