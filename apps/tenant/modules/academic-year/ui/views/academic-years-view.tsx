"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

import {
  useAcademicYears,
  useAcademicYearStats,
  useDeleteAcademicYear,
  useToggleAcademicYearActive,
} from "@workspace/api-client";

import AcademicYearTimeline from "../components/academic-year-timeline";
import AcademicYearStats from "../components/academic-year-stats";
import AcademicYearToolbar from "../components/academic-year-toolbar";
import AcademicYearTable from "../components/academic-year-table";
import AcademicYearCard from "../components/academic-year-card";
import Link from "next/link";
import { Pagination } from "../components/pagination";

type ViewMode = "table" | "cards";

export const AcademicYearsView: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const { openDeleteModal } = useDeleteModal();

  const { data: stats, isLoading: statsLoading } = useAcademicYearStats();
  const { data: academicYearsResponse, isLoading: listLoading } =
    useAcademicYears();
  const { mutate: deleteAcademicYear, isPending: isDeleting } =
    useDeleteAcademicYear();
  const { mutate: toggleActive, isPending: isToggling } =
    useToggleAcademicYearActive();

  const academicYears = academicYearsResponse?.data ?? [];

  const isLoading = statsLoading || listLoading || isDeleting || isToggling;

  const handleDelete = (id: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "academicYear",
      entityName: "Academic Year",
      onConfirm: (id) => deleteAcademicYear(id),
    });
  };

  const handleToggleActiveStatus = (id: string) => {
    toggleActive(id);
  };

  return (
    <div className="space-y-6 min-h-screen p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Academic Years</h1>
          <p className="text-muted-foreground text-sm">
            Manage academic year sessions
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/academic-years/new">
            <Plus className="w-4 h-4" /> Add Year
          </Link>
        </Button>
      </div>

      {/* Timeline */}
      <Card>
        <CardContent className="py-4 px-2">
          <AcademicYearTimeline years={academicYears} />
        </CardContent>
      </Card>

      {/* Stats */}
      <AcademicYearStats
        totalYears={stats?.totalYears}
        currentYear={stats?.currentYear}
        totalStudents={stats?.totalStudents}
        totalBatches={stats?.totalBatches}
      />

      {/* Toolbar */}
      <AcademicYearToolbar
        isLoading={isLoading}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Table view */}
      {viewMode === "table" && (
        <AcademicYearTable
          handleDelete={handleDelete}
          handleToggleActiveStatus={handleToggleActiveStatus}
          academicYears={academicYears}
          isLoading={isLoading}
        />
      )}

      {/* Cards view */}
      <div
        className={
          viewMode === "cards"
            ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "grid sm:hidden grid-cols-1 gap-4"
        }
      >
        {academicYears.map((ay, i) => (
          <AcademicYearCard
            key={ay.id}
            year={ay}
            index={i}
            handleDelete={handleDelete}
            handleToggleActiveStatus={handleToggleActiveStatus}
            isLoading={isLoading}
          />
        ))}
        {academicYears.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No academic years found.
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination totalItem={academicYearsResponse?.total ?? 0} />

      {/* Fixed FAB for Mobile */}
      <Button
        asChild
        size="icon"
        className="sm:hidden fixed bottom-8 right-6 h-12 w-12 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground z-50 group transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <Link href="/academic-years/new">
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
        </Link>
      </Button>
    </div>
  );
};

export default AcademicYearsView;
