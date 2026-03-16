"use client";

import React from "react";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useBuilderUI } from "./builder-context";

export const BuilderCanvasToolbar: React.FC = () => {
  const { zoom, setZoom } = useBuilderUI();

  return (
    <div className="flex items-center justify-center gap-2 p-2 bg-background/50 border-b absolute top-0 inset-x-0 z-10 backdrop-blur-sm">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-lg"
        onClick={() => setZoom(typeof zoom === "number" ? Math.max(0.25, zoom - 0.1) : 0.5)}
      >
        <ZoomOut className="w-4 h-4" />
      </Button>
      <span className="text-[10px] font-black w-14 text-center tabular-nums uppercase">
        {zoom === "auto" ? "Auto" : `${Math.round(zoom * 100)}%`}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-lg"
        onClick={() => setZoom(typeof zoom === "number" ? Math.min(2, zoom + 0.1) : 1)}
      >
        <ZoomIn className="w-4 h-4" />
      </Button>
      <div className="w-px h-4 bg-border mx-1" />
      <Button
        variant={zoom === "auto" ? "secondary" : "outline"}
        size="sm"
        className="h-8 px-2 rounded-lg font-bold text-[10px]"
        onClick={() => setZoom("auto")}
      >
        <Maximize2 className="h-3.5 w-3.5 mr-1.5" />
        FIT TO SCREEN
      </Button>
    </div>
  );
};
