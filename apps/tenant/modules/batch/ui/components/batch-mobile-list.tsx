"use client";

import React from "react";
import { MoreVertical, Edit2, ChevronLeft, ChevronRight } from "lucide-react";

export function BatchMobileList() {
  return (
    <div className="md:hidden space-y-4 mb-24">
      {/* Card 1 */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-2 py-1 rounded-md bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase mb-2">
              Morning Session
            </span>
            <h3 className="text-lg font-bold text-on-background">
              Advanced Chemistry B1
            </h3>
            <p className="text-xs text-on-surface-variant">
              Class XII • 2024 Academic Year
            </p>
          </div>
          <button className="text-outline hover:text-primary transition-colors">
            <MoreVertical className="size-[20px]" />
          </button>
        </div>
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] font-semibold text-on-surface-variant">
              Capacity
            </span>
            <span className="text-[11px] font-bold text-primary">
              42/50 Students
            </span>
          </div>
          <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-container rounded-full"
              style={{ width: "84%" }}
            ></div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 py-2.5 rounded-lg bg-surface-container text-primary text-xs font-bold hover:bg-surface-container-high transition-colors">
            View Students
          </button>
          <button className="aspect-square w-10 flex items-center justify-center rounded-lg border border-outline-variant/30 text-outline">
            <Edit2 className="size-[16px]" />
          </button>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-2 py-1 rounded-md bg-tertiary-container/20 text-on-tertiary-container text-[10px] font-bold uppercase mb-2">
              Evening Session
            </span>
            <h3 className="text-lg font-bold text-on-background">
              Physics Masterclass
            </h3>
            <p className="text-xs text-on-surface-variant">
              Class XI • 2024 Academic Year
            </p>
          </div>
          <button className="text-outline">
            <MoreVertical className="size-[20px]" />
          </button>
        </div>
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] font-semibold text-on-surface-variant">
              Capacity
            </span>
            <span className="text-[11px] font-bold text-tertiary">
              15/50 Students
            </span>
          </div>
          <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
            <div
              className="h-full bg-tertiary-container rounded-full"
              style={{ width: "30%" }}
            ></div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 py-2.5 rounded-lg bg-surface-container text-primary text-xs font-bold">
            View Students
          </button>
          <button className="aspect-square w-10 flex items-center justify-center rounded-lg border border-outline-variant/30 text-outline">
            <Edit2 className="size-[16px]" />
          </button>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] opacity-80">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-2 py-1 rounded-md bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase mb-2">
              Weekends Only
            </span>
            <h3 className="text-lg font-bold text-on-background">
              Pure Mathematics
            </h3>
            <p className="text-xs text-on-surface-variant">
              Graduate • 2023 Academic Year
            </p>
          </div>
          <button className="text-outline">
            <MoreVertical className="size-[20px]" />
          </button>
        </div>
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] font-semibold text-on-surface-variant">
              Capacity
            </span>
            <span className="text-[11px] font-bold text-slate-400">Full</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-300 rounded-full"
              style={{ width: "100%" }}
            ></div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 py-2.5 rounded-lg bg-surface-container text-primary text-xs font-bold">
            View Students
          </button>
          <button className="aspect-square w-10 flex items-center justify-center rounded-lg border border-outline-variant/30 text-outline">
            <Edit2 className="size-[16px]" />
          </button>
        </div>
      </div>

      <nav className="flex items-center justify-center gap-2 mt-8 pb-10">
        <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors">
          <ChevronLeft className="size-[20px]" />
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-lg bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20">
            1
          </button>
          <button className="w-10 h-10 rounded-lg bg-surface-container text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-colors">
            2
          </button>
          <button className="w-10 h-10 rounded-lg bg-surface-container text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-colors">
            3
          </button>
        </div>
        <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors">
          <ChevronRight className="size-[20px]" />
        </button>
      </nav>
    </div>
  );
}
