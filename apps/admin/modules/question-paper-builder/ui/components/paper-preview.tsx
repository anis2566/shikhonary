"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { PaperPreviewProps } from "./types";
import { FloatingToolbar } from "./floating-toolbar";
import { PreviewProvider, usePreview } from "./preview/preview-context";
import { PaperPage } from "./preview/paper-page";

const PaperPreviewInner: React.FC = () => {
  const {
    containerRef,
    toolbarRef,
    showToolbar,
    isEditing,
    activeContext,
    activeElement,
    handleStyleChange,
    handleOptionsColumnsChange,
    handleToolbarInteractionStart,
    handleToolbarInteractionEnd,
    questions,
    onReorderQuestions,
    pages,
    zoom,
  } = usePreview();

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(questions, oldIndex, newIndex);
        const renumbered = reordered.map((q, idx) => ({ ...q, number: idx + 1 }));
        onReorderQuestions?.(renumbered);
      }
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-0 overflow-auto scroll-smooth p-6">
      <FloatingToolbar
        ref={toolbarRef}
        target={activeElement}
        isVisible={showToolbar && isEditing && activeContext !== null}
        currentStyle={activeContext?.currentStyle || { fontSize: 14, fontFamily: "SolaimanLipi", textAlign: "left" }}
        onStyleChange={handleStyleChange}
        showAlignment={true}
        optionsColumns={activeContext?.optionsColumns}
        onOptionsColumnsChange={
          activeContext?.type === "question" || activeContext?.type === "option"
            ? handleOptionsColumnsChange
            : undefined
        }
        onInteractionStart={handleToolbarInteractionStart}
        onInteractionEnd={handleToolbarInteractionEnd}
      />

      <div
        className="flex flex-col items-center gap-3"
        style={{ minHeight: zoom === "auto" ? "100%" : "auto" }}
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            {pages.map((pageQuestions, idx) => (
              <PaperPage key={idx} pageQuestions={pageQuestions} pageIndex={idx} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export const PaperPreview: React.FC<PaperPreviewProps> = (props) => {
  return (
    <PreviewProvider {...props}>
      <PaperPreviewInner />
    </PreviewProvider>
  );
};
