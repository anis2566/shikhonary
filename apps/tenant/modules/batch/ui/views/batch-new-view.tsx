"use client";

import React from "react";
import { ArrowLeft, Layers } from "lucide-react";
import { BatchCreateForm } from "../form/batch-create-form";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export function BatchNewView() {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 md:py-16 px-4 md:px-8 font-['Inter']">
      {/* Back Navigation + Page Title */}
      <div className="mb-8 md:mb-10">
        <Button
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group mb-4 w-full max-w-fit hover:bg-transparent"
          asChild
          variant="ghost"
        >
          <Link href="/batches" prefetch>
            <ArrowLeft className="text-base group-hover:-translate-x-1 transition-transform size-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Back to Batches
            </span>
          </Link>
        </Button>

        <div className="flex items-center gap-4">
          {/* Icon accent */}
          <div
            className="hidden md:flex size-12 rounded-xl items-center justify-center shrink-0"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #006c49 0%, #10b981 100%)",
            }}
          >
            <Layers className="size-6 text-white" />
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-on-background tracking-tight">
              Create New Batch
            </h1>
            <p className="text-on-surface-variant text-sm">
              Define the parameters for your new student grouping.
            </p>
          </div>
        </div>
      </div>

      <BatchCreateForm />
    </div>
  );
}
