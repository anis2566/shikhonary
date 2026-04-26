"use client";

import { Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

interface HeaderProps {
  title: string;
  description: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
      {/* Subtle background glow behind the title */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 -left-6 w-72 h-24 rounded-full opacity-20 blur-3xl bg-primary"
      />

      {/* Left: title + description */}
      <div className="relative max-w-2xl animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline">
          {title}
        </h1>

        {/* Animated underline accent */}
        <div className="mt-2 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />

        <p className="text-sm leading-6 text-on-surface-variant max-w-lg">
          {description}
        </p>
      </div>

      {/* Right: CTA button */}
      <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        <Button
          asChild
          className="
            group relative overflow-hidden
            inline-flex items-center gap-2
            bg-gradient-to-br from-primary to-primary-container
            text-on-primary font-bold text-sm
            px-5 py-2.5 rounded-2xl
            border-0
            shadow-[0_4px_20px_-4px] shadow-primary/40
            hover:shadow-[0_6px_28px_-4px] hover:shadow-primary/60
            hover:scale-[1.03]
            active:scale-[0.97]
            transition-all duration-200 ease-out
          "
        >
          <Link href="/batches/new">
            {/* Shine sweep on hover */}
            <span
              aria-hidden
              className="
                pointer-events-none absolute inset-0
                translate-x-[-100%] skew-x-[-20deg]
                bg-white/20
                group-hover:translate-x-[120%]
                transition-transform duration-500 ease-in-out
              "
            />

            <span className="relative flex items-center justify-center rounded-lg bg-white/20 p-0.5">
              <Plus size={16} strokeWidth={3} />
            </span>
            <span className="relative">Add Batch</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
