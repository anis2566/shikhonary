"use client";

import React from "react";
import { EditableQuestion } from "../editable-question";
import { usePreview } from "./preview-context";
import { PaperHeader } from "./paper-header";

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
    onUpdateQuestion,
    onDeleteQuestion,
    onDuplicateQuestion,
    isEditing,
    firstPageEnd
  } = usePreview();

  const paperDims = getPaperDimensions();

  return (
    <div aria-hidden className="absolute left-[-99999px] top-0 pointer-events-none opacity-0" style={{ width: `${paperDims.width}mm` }}>
      {/* First-page measurement */}
      <div
        className="bg-white"
        style={{
          ...getPaperStyle(),
          padding: `${settings.margins.top}mm ${settings.margins.right}mm ${settings.margins.bottom}mm ${settings.margins.left}mm`,
        }}
      >
        {!shouldRestrictHeaderWidth && (
          <div ref={measureHeaderRef}><PaperHeader /></div>
        )}
        <div
          ref={measureFirstQuestionsRef}
          style={{
            columnCount: settings.columns,
            columnGap: "1.5rem",
            columnFill: "auto",
            width: "100%",
            overflow: "visible",
          }}
        >
          {shouldRestrictHeaderWidth && <PaperHeader />}
          {questions.map((question, idx) => (
            <div key={question.id} data-question-index={idx} style={{ breakInside: "avoid" }}>
              <EditableQuestion
                question={question}
                settings={settings}
                onUpdate={onUpdateQuestion}
                onDelete={onDeleteQuestion}
                onDuplicate={onDuplicateQuestion}
                isEditing={isEditing}
                isDraggable={false}
              />
            </div>
          ))}
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
          style={{
            columnCount: settings.columns,
            columnGap: "1.5rem",
            columnFill: "auto",
            width: "100%",
            overflow: "visible",
          }}
        >
          {questions.slice(firstPageEnd).map((question, idx) => (
            <div key={question.id} data-question-index={idx} style={{ breakInside: "avoid" }}>
              <EditableQuestion
                question={question}
                settings={settings}
                onUpdate={onUpdateQuestion}
                onDelete={onDeleteQuestion}
                onDuplicate={onDuplicateQuestion}
                isEditing={isEditing}
                isDraggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
