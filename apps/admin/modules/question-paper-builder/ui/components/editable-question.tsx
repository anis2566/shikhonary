"use client";

import React from "react";
import { PaperQuestion, PaperSettings, ElementStyle } from "./types";
import { EditableMcq } from "./editable-mcq";
import { EditableCq } from "./editable-cq";

interface EditableQuestionProps {
  question: PaperQuestion;
  settings: PaperSettings;
  onUpdate: (question: PaperQuestion) => void;
  onDelete: (id: string) => void;
  onDuplicate: (question: PaperQuestion) => void;
  isEditing: boolean;
  isDraggable?: boolean;
  onFocus?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: "question" | "option" | "statement" | "context",
    index?: number,
    currentStyle?: ElementStyle,
  ) => void;
  onBlur?: () => void;
}

export const EditableQuestion: React.FC<EditableQuestionProps> = (props) => {
  if (props.question.type === "creative") {
    return <EditableCq {...props} />;
  }

  return <EditableMcq {...props} />;
};
