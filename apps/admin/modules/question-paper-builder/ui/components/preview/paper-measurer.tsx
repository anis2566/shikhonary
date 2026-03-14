"use client";

import React from "react";
import { usePreview } from "./preview-context";
import { PaperHeader } from "./paper-header";
import { PaperContent } from "./paper-content";

export const PaperMeasurer: React.FC = () => {
  const {
    getPaperDimensions,
    getPaperStyle,
    settings,
    shouldRestrictHeaderWidth,
    measureHeaderRef,
    measureFirstQuestionsRef,
    measureRestQuestionsRef,
    questions,
    firstPageEnd,
  } = usePreview();

  const paperDims = getPaperDimensions();

  return (
    <div
      aria-hidden
      className="absolute left-[-99999px] top-0 pointer-events-none opacity-0"
      style={{ width: `${paperDims.width}mm` }}
    >
      {/* First-page measurement */}
      <div
        className="bg-white"
        style={{
          ...getPaperStyle(),
          padding: `${settings.margins.top}mm ${settings.margins.right}mm ${settings.margins.bottom}mm ${settings.margins.left}mm`,
        }}
      >
        {!shouldRestrictHeaderWidth && (
          <div ref={measureHeaderRef}>
            <PaperHeader />
          </div>
        )}
        <div
          ref={measureFirstQuestionsRef}
          className="w-full h-full flex flex-col"
        >
          <PaperContent
            pageQuestions={questions}
            pageIndex={0}
            isMeasuring={true}
          />
        </div>
      </div>

      {/* Subsequent-page measurement */}
      <div
        className="bg-white"
        style={{
          ...getPaperStyle(),
          padding: `${settings.margins.top}mm ${settings.margins.right}mm ${settings.margins.bottom}mm ${settings.margins.left}mm`,
        }}
      >
        <div
          ref={measureRestQuestionsRef}
          className="w-full h-full flex flex-col"
        >
          <PaperContent
            pageQuestions={questions.slice(firstPageEnd)}
            pageIndex={1}
            isMeasuring={true}
          />
        </div>
      </div>
    </div>
  );
};
