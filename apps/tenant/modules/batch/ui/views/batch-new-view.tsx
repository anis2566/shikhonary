"use client";

import React from "react";
import { ArrowLeft, Layers } from "lucide-react";
import { BatchCreateForm } from "../form/batch-create-form";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { Badge } from "@workspace/ui/components/badge";

export function BatchNewView() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 font-body antialiased">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 lg:py-20">
        {/* Back Navigation + Page Title */}
        <div className="mb-12 animate-fade-in group">
          <Button
            className="mb-10 flex h-auto items-center gap-2 p-0 text-on-surface-variant/70 hover:bg-transparent hover:text-primary transition-all group/btn"
            asChild
            variant="ghost"
          >
            <Link href="/batches" prefetch>
              <div className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm border border-outline/50 transition-transform group-hover/btn:-translate-x-1">
                <ArrowLeft className="size-4" />
              </div>
              <span className="text-sm font-bold tracking-tight transition-colors group-hover/btn:text-primary">
                Back to Dashboard
              </span>
            </Link>
          </Button>

          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            {/* Icon accent - High Fidelity version from screen.html */}
            <div className="hidden size-20 items-center justify-center rounded-[2rem] bg-gradient-signature shadow-2xl shadow-primary/20 md:flex -rotate-6 transition-transform hover:rotate-0 duration-700">
              <Layers className="size-10 text-white" />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5">
                <Badge
                  variant="outline"
                  className="border-primary/20 bg-primary/5 text-primary text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full"
                >
                  Institutional Entity
                </Badge>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl lg:text-6xl max-w-2xl leading-[1.1]">
                Create New <span className="text-primary italic">Batch</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-on-surface-variant/80 font-medium">
                Define the parameters for your new student grouping with
                administrative precision.
              </p>
            </div>
          </div>
        </div>

        <div className="animate-fade-in [animation-delay:200ms]">
          <BatchCreateForm />
        </div>
      </div>
    </div>
  );
}
