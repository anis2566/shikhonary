"use client";

import React from "react";
import { ArrowLeft, Layers } from "lucide-react";
import { BatchCreateForm } from "../form/batch-create-form";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export function BatchNewView() {
  return (
    <div className="w-full min-h-screen bg-gradient-background font-body antialiased">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:py-20">
        {/* Back Navigation + Page Title */}
        <div className="mb-12 animate-fade-in group">
          <Button
            className="mb-8 flex h-auto items-center gap-2 p-0 text-on-surface-variant/60 hover:bg-transparent hover:text-primary transition-all group/btn"
            asChild
            variant="ghost"
          >
            <Link href="/batches" prefetch>
              <div className="flex size-8 items-center justify-center rounded-full bg-surface-container transition-transform group-hover/btn:-translate-x-1">
                <ArrowLeft className="size-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] transition-colors group-hover/btn:text-primary">
                Return to Directory
              </span>
            </Link>
          </Button>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-6">
              {/* Icon accent - Atmospheric version */}
              <div className="hidden size-20 items-center justify-center rounded-[2rem] bg-gradient-signature shadow-glow md:flex rotate-3 transition-transform hover:rotate-0 duration-500">
                <Layers className="size-10 text-white" />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] uppercase tracking-wider font-bold px-3 py-0.5 rounded-full">
                    Academic Entity
                  </Badge>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl lg:text-6xl">
                  Forge New <span className="text-primary italic">Batch</span>
                </h1>
                <p className="max-w-md text-sm leading-relaxed text-on-surface-variant/80 md:text-base">
                  Architect the parameters for your next high-performance student grouping with precision and clarity.
                </p>
              </div>
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
