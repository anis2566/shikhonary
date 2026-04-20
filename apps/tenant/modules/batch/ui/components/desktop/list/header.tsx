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
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
          {title}
        </h1>
        <p className="text-on-surface-variant leading-relaxed">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          className="px-6 py-5 bg-emerald-600 text-white rounded-lg font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all outline-none focus:outline-none focus:ring-0"
          asChild
        >
          <Link href="/batches/new">
            <Plus className="w-5 h-5" />
            Add Batch
          </Link>
        </Button>
      </div>
    </header>
  );
}
