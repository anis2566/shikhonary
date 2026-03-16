"use client";

import React from "react";
import { usePreview } from "./preview-context";
import { toBengaliDigits } from "./preview-utils";
import { PaperHeader } from "./paper-header";
import { PaperContent } from "./paper-content";
import { PaperQuestion } from "../types";

import { useIntersectionObserver } from "./use-intersection-observer";

interface PaperPageProps {
  pageQuestions: PaperQuestion[];
  pageIndex: number;
}

export const PaperPage: React.FC<PaperPageProps> = ({
  pageQuestions,
  pageIndex,
}) => {
  const {
    effectiveScale,
    getPaperStyle,
    settings,
    pages,
    shouldRestrictHeaderWidth,
  } = usePreview();

  const [ref, entry] = useIntersectionObserver({
    rootMargin: "500px 0px", // Load pages when they are within 500px of viewport
    threshold: 0,
  });

  const isVisible = !!entry?.isIntersecting;
  const paperStyle = getPaperStyle();

  return (
    <div
      ref={ref}
      data-paper-page-wrapper
      className="origin-top transition-transform duration-200 shrink-0"
      style={{
        transform: `scale(${effectiveScale})`,
        width: paperStyle.width,
        height: paperStyle.height,
      }}
    >
      <div
        className="bg-white shadow-lg print:shadow-none relative overflow-hidden flex flex-col"
        style={{
          ...paperStyle,
          padding: `${settings.margins.top}mm ${settings.margins.right}mm ${settings.margins.bottom}mm ${settings.margins.left}mm`,
        }}
        id={`paper-preview-page-${pageIndex + 1}`}
      >
        <div
          data-page-indicator
          className="page-indicator absolute top-2 right-3 text-xs text-muted-foreground/50 font-bold"
        >
          পৃষ্ঠা {toBengaliDigits(pageIndex + 1)}/{toBengaliDigits(pages.length)}
        </div>

        {isVisible ? (
          <>
            {pageIndex === 0 && !shouldRestrictHeaderWidth && <PaperHeader />}

            <PaperContent pageQuestions={pageQuestions} pageIndex={pageIndex} />

            {settings.showWatermark && settings.watermark && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07] text-6xl font-black rotate-[-30deg] select-none uppercase">
                {settings.watermark}
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground/20 italic font-bold">
            Loading page {toBengaliDigits(pageIndex + 1)}...
          </div>
        )}
      </div>
    </div>
  );
};
