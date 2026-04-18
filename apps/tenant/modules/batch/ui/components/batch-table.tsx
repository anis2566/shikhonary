"use client";

import React from "react";
import { Users, PenTool, Calculator, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

export const dummyBatches = [
  {
    id: "b_1",
    name: "Advanced Physics A",
    section: "Section 402 • Evening",
    class: "Grade 12",
    academicYear: "2023 - 2024",
    capacity: "28/30",
    capacityColor: "bg-error animate-pulse",
    status: "ACTIVE",
    statusClasses: "bg-secondary-container text-on-secondary-container",
    icon: Users,
  },
  {
    id: "b_2",
    name: "Digital Arts 101",
    section: "Section 105 • Morning",
    class: "Level 2",
    academicYear: "2023 - 2024",
    capacity: "12/25",
    capacityColor: "bg-primary",
    status: "SCHEDULED",
    statusClasses: "bg-surface-container-high text-on-surface-variant",
    icon: PenTool,
  },
  {
    id: "b_3",
    name: "Calculus II",
    section: "Section 88 • Weekend",
    class: "Grade 11",
    academicYear: "2022 - 2023",
    capacity: "45/50",
    capacityColor: "bg-tertiary-container",
    status: "COMPLETED",
    statusClasses: "bg-on-surface-variant/10 text-on-surface-variant/60",
    icon: Calculator,
  },
];

export function BatchTable() {
  return (
    <>
      <section className="bg-surface-container-lowest rounded-xl shadow-[0_24px_48px_-12px_rgba(11,28,48,0.06)] overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 border-b border-outline-variant/10">
                  Batch Name
                </th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 border-b border-outline-variant/10">
                  Class
                </th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 border-b border-outline-variant/10">
                  Academic Year
                </th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 border-b border-outline-variant/10">
                  Capacity
                </th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 border-b border-outline-variant/10">
                  Students
                </th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 border-b border-outline-variant/10">
                  Status
                </th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 border-b border-outline-variant/10 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {dummyBatches.map((batch) => {
                const Icon = batch.icon;
                return (
                  <tr
                    key={batch.id}
                    className="hover:bg-surface-container-low/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                          <Icon className="size-6" />
                        </div>
                        <div>
                          <div className="font-bold text-on-surface">
                            {batch.name}
                          </div>
                          <div className="text-sm text-on-surface-variant">
                            {batch.section}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-on-surface font-medium">
                        {batch.class}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-on-surface font-medium">
                        {batch.academicYear}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className="text-on-surface font-bold">
                          {batch.capacity}
                        </span>
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${batch.capacityColor}`}
                        />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface-container-lowest flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                          +0
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${batch.statusClasses}`}
                      >
                        {batch.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <MoreHorizontal className="size-6" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-on-surface-variant">
          Showing <span className="font-semibold text-on-surface">1</span> to{" "}
          <span className="font-semibold text-on-surface">3</span> of{" "}
          <span className="font-semibold text-on-surface">24</span> results
        </div>
        <nav aria-label="Pagination" className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="size-[18px]" />
            Previous
          </button>
          <div className="flex items-center gap-1">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold bg-primary text-on-primary shadow-lg shadow-primary/20 transition-all">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors">
              3
            </button>
            <span className="px-2 text-on-surface-variant">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors">
              8
            </button>
          </div>
          <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
            Next
            <ChevronRight className="size-[18px]" />
          </button>
        </nav>
      </footer>
    </>
  );
}
