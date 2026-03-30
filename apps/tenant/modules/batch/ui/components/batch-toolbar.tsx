"use client";

import { LayoutGrid, List } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Filter } from "./filter";

type ViewMode = "table" | "cards";

interface BatchToolbarProps {
  isLoading: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function BatchToolbar({
  isLoading,
  viewMode,
  onViewModeChange,
}: BatchToolbarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-soft">
        <Filter isLoading={isLoading} />

        <div className="flex items-center gap-2">
          <div className="flex border rounded-xl overflow-hidden bg-background/50">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-none h-10 px-4 transition-all"
              onClick={() => onViewModeChange("table")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "cards" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-none h-10 px-4 transition-all"
              onClick={() => onViewModeChange("cards")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
