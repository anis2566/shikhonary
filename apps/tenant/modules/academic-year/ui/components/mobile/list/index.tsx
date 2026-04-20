import { AnimatePresence } from "framer-motion";
import { Header } from "./header";
import { TenantTypes } from "@workspace/db";
import { YearCard } from "./card";
import { Card } from "@workspace/ui/components/card";
import { Calendar } from "lucide-react";
import { Pagination } from "../../desktop/list/pagination";

interface AcademicYearWithRelations extends TenantTypes.AcademicYear {
  _count: {
    students: number;
    batches: number;
  };
}

interface MobileListProps {
  isLoading: boolean;
  academicYears: AcademicYearWithRelations[];
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export const MobileList = ({
  isLoading,
  academicYears,
  onToggleActive,
  onDelete,
}: MobileListProps) => {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-grow px-6 py-4 flex flex-col gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="bg-surface-container-lowest rounded-2xl p-5 shadow-ambient animate-pulse h-52 border border-outline-variant/10"
              />
            ))
          ) : academicYears.length > 0 ? (
            academicYears.map((ay, i) => (
              <YearCard
                key={ay.id}
                ay={ay}
                index={i}
                onToggleActive={onToggleActive}
                onDelete={onDelete}
              />
            ))
          ) : (
            <Card className="text-center py-20 text-on-surface-variant/40 font-medium rounded-3xl border-outline-variant/10 bg-surface-container-lowest shadow-ambient">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center text-outline-variant/40">
                  <Calendar className="w-10 h-10" />
                </div>
                <p className="text-lg text-on-surface font-bold tracking-tight">
                  No results found
                </p>
              </div>
            </Card>
          )}
        </AnimatePresence>
      </main>

      <Pagination total={academicYears.length} />
    </div>
  );
};
