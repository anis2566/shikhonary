export interface MCQ {
  id: string;
  question: string;
  context?: string;
  options: string[];
  answer: string;
  type: string;
  reference?: string[];
  subject?: { displayName: string };
  chapter?: { displayName: string };
  statements?: string[];
}

export interface PaperQuestion {
  id: string;
  mcqId: string;
}

export interface Chapter {
  id: string;
  displayName: string;
}

export interface MCQResourceViewProps {
  questionTypeId: string;
  subjectId: string;
  distributionId: string;
}
