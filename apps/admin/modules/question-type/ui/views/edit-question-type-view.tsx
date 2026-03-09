"use client";

import { EditQuestionTypeForm } from "../form/edit-question-type-form";

interface EditQuestionTypeViewProps {
  id: string;
}

export const EditQuestionTypeView = ({ id }: EditQuestionTypeViewProps) => {
  return <EditQuestionTypeForm id={id} />;
};
