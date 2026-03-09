import { EditQuestionTypeView } from "@/modules/question-type/ui/views/edit-question-type-view";

interface EditQuestionTypePageProps {
  params: { id: string };
}

export default function EditQuestionTypePage({
  params,
}: EditQuestionTypePageProps) {
  return <EditQuestionTypeView id={params.id} />;
}
