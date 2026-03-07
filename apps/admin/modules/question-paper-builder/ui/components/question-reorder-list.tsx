"use client";

import React, { useState } from "react";
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ArrowUp, ArrowDown, ListOrdered } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { PaperQuestion } from "./types";

interface QuestionReorderListProps {
  questions: PaperQuestion[];
  onReorder: (reordered: PaperQuestion[]) => void;
}

// Single sortable row
const SortableRow: React.FC<{
  question: PaperQuestion;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}> = ({ question, index, total, onMoveUp, onMoveDown }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const toBengali = (n: number) =>
    n
      .toString()
      .split("")
      .map((d) => bengaliDigits[parseInt(d)])
      .join("");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-2.5 rounded-xl border transition-all group",
        isDragging
          ? "bg-primary/10 border-primary/30 shadow-lg z-50 scale-[1.02]"
          : "bg-card border-border/50 hover:border-primary/20 hover:bg-muted/30",
      )}
    >
      {/* Drag handle */}
      <div
        className="cursor-grab active:cursor-grabbing shrink-0 touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Number badge */}
      <span className="shrink-0 h-6 w-6 rounded-lg bg-primary/10 text-primary text-[11px] font-black flex items-center justify-center">
        {toBengali(index + 1)}
      </span>

      {/* Question text */}
      <p className="flex-1 text-xs font-medium line-clamp-2 leading-snug text-foreground/80">
        {question.question}
      </p>

      {/* Arrow buttons for keyboard/accessible reorder */}
      <div className="shrink-0 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          disabled={index === 0}
          onClick={onMoveUp}
        >
          <ArrowUp className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          disabled={index === total - 1}
          onClick={onMoveDown}
        >
          <ArrowDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export const QuestionReorderList: React.FC<QuestionReorderListProps> = ({
  questions,
  onReorder,
}) => {
  const [items, setItems] = useState(questions);

  // Keep in sync with external props
  React.useEffect(() => {
    setItems(questions);
  }, [questions]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((q) => q.id === active.id);
    const newIndex = items.findIndex((q) => q.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex).map((q, i) => ({
      ...q,
      number: i + 1,
    }));
    setItems(reordered);
    onReorder(reordered);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const reordered = arrayMove(items, fromIndex, toIndex).map((q, i) => ({
      ...q,
      number: i + 1,
    }));
    setItems(reordered);
    onReorder(reordered);
  };

  return (
    <div className="flex flex-col h-full bg-background border-l">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <ListOrdered className="h-5 w-5 text-violet-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Reorder Questions</h3>
            <p className="text-xs text-muted-foreground font-medium">
              Drag or use arrows to change order
            </p>
          </div>
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1.5">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((question, index) => (
                <SortableRow
                  key={question.id}
                  question={question}
                  index={index}
                  total={items.length}
                  onMoveUp={() => moveItem(index, index - 1)}
                  onMoveDown={() => moveItem(index, index + 1)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </ScrollArea>
    </div>
  );
};
