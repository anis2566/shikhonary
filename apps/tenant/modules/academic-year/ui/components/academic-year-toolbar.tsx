"use client";

import { LayoutGrid, List } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Filter } from "./filter";

type ViewMode = "table" | "cards";

interface AcademicYearToolbarProps {
  isLoading: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function AcademicYearToolbar({
  isLoading,
  viewMode,
  onViewModeChange,
}: AcademicYearToolbarProps) {
  return (
    <Card className="flex gap-4 justify-between items-center p-4 border-none shadow-soft bg-white backdrop-blur-sm">
      {/* Filters */}
      <Filter isLoading={isLoading} />

      {/* View Toggle */}
      <div className="max-sm:hidden flex border rounded-xl overflow-hidden bg-background/50">
        <Button
          variant={viewMode === "table" ? "secondary" : "ghost"}
          size="sm"
          className="rounded-none h-10 px-4 transition-all"
          onClick={() => onViewModeChange("table")}
        >
          <List className="w-4 h-4 mr-2" />
        </Button>
        <Button
          variant={viewMode === "cards" ? "secondary" : "ghost"}
          size="sm"
          className="rounded-none h-10 px-4 transition-all"
          onClick={() => onViewModeChange("cards")}
        >
          <LayoutGrid className="w-4 h-4 mr-2" />
        </Button>
      </div>
    </Card>
  );
}
