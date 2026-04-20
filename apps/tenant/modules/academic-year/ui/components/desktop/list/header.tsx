"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

interface HeaderProps {
  title: string;
  description: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="text-slate-500 font-medium">{description}</p>
      </div>
      <Button
        className="px-6 py-5 bg-emerald-600 text-white rounded-lg font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all outline-none focus:outline-none focus:ring-0"
        asChild
      >
        <Link href="/academic-years/new">
          <Plus className="w-5 h-5" />
          Add Year
        </Link>
      </Button>
    </div>
  );
}
