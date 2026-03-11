"use client";

import React from "react";
import { usePreview } from "./preview-context";
import { toBengaliDigits } from "./preview-utils";
import { PaperHeader } from "./paper-header";
import { PaperContent } from "./paper-content";
import { PaperQuestion } from "../types";

interface PaperPageProps {
  pageQuestions: PaperQuestion[];
  pageIndex: number;
}

export const PaperPage: React.FC<PaperPageProps> = ({ pageQuestions, pageIndex }) => {
  const { 
    effectiveScale, 
    getPaperStyle, 
    settings, 
    pages, 
    shouldRestrictHeaderWidth 
  } = usePreview();

  return (
    <div
      data-paper-page-wrapper
      className="origin-top transition-transform duration-200 shrink-0"
      style={{ transform: `scale(${effectiveScale})` }}
    >
      <div
        className="bg-white shadow-lg print:shadow-none relative overflow-hidden flex flex-col"
        style={{
          ...getPaperStyle(),
          padding: `${settings.margins.top}mm ${settings.margins.right}mm ${settings.margins.bottom}mm ${settings.margins.left}mm`,
        }}
        id={`paper-preview-page-${pageIndex + 1}`}
      >
        <div
          data-page-indicator
          className="page-indicator absolute top-2 right-3 text-xs text-muted-foreground/50"
        >
          পৃষ্ঠা {toBengaliDigits(pageIndex + 1)}/{toBengaliDigits(pages.length)}
        </div>

        {pageIndex === 0 && !shouldRestrictHeaderWidth && <PaperHeader />}

        <PaperContent pageQuestions={pageQuestions} pageIndex={pageIndex} />

        {settings.showWatermark && settings.watermark && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 text-6xl font-bold rotate-[-30deg]">
            {settings.watermark}
          </div>
        )}
      </div>
    </div>
  );
};
