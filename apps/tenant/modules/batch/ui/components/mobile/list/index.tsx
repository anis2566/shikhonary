"use client";

import { Header } from "./header";
import { BatchCard } from "./card";
import { Pagination } from "../../desktop/list/pagination";

const mockBatches = [
  {
    id: "1",
    name: "Advanced Physics A",
    section: "402",
    shift: "Evening",
    className: "Grade 12",
    academicYear: "2023 - 2024",
    capacity: 30,
    studentCount: 28,
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "Digital Arts 101",
    section: "105",
    shift: "Morning",
    className: "Level 2",
    academicYear: "2023 - 2024",
    capacity: 25,
    studentCount: 12,
    status: "SCHEDULED",
  },
  {
    id: "3",
    name: "Calculus II",
    section: "88",
    shift: "Weekend",
    className: "Grade 11",
    academicYear: "2022 - 2023",
    capacity: 50,
    studentCount: 45,
    status: "COMPLETED",
  },
];

export function MobileList() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 md:hidden">
      <Header />

      <main className="flex-grow p-6 space-y-6">
        {mockBatches.map((batch) => (
          <BatchCard key={batch.id} batch={batch} />
        ))}

        {mockBatches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <Users className="w-16 h-16 text-slate-200 mb-4" />
            <p className="text-xl font-bold text-slate-400">No batches found</p>
          </div>
        )}
      </main>

      <div className="px-6 pb-10">
        <Pagination total={24} />
      </div>
    </div>
  );
}

import { Users } from "lucide-react";
