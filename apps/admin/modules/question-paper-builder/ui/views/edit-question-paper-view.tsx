import { EditPaperForm } from "../form/edit-paper-form";

interface EditQuestionPaperViewProps {
  paperId: string;
}

export const EditQuestionPaperView = ({ paperId }: EditQuestionPaperViewProps) => {
  return <EditPaperForm paperId={paperId} />;
};
