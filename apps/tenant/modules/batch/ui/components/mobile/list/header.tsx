"use client";

import { Search, Filter, Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Batches
        </h1>
        <Button size="icon" className="w-10 h-10 rounded-full bg-emerald-600 shadow-lg shadow-emerald-100">
          <Plus className="w-6 h-6" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            className="bg-slate-50 border-none pl-10 h-11 rounded-xl focus-visible:ring-emerald-500/20" 
            placeholder="Search batches..."
          />
        </div>
        <Button variant="outline" size="icon" className="w-11 h-11 rounded-xl border-slate-100">
          <Filter className="w-5 h-5 text-slate-600" />
        </Button>
      </div>
    </header>
  );
}
