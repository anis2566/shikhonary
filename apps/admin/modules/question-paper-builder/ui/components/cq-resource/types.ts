import { CQ } from "@workspace/schema";

export interface CQResource extends CQ {
  subject: {
    id: string;
    name: string;
    displayName: string;
  };
  chapter: {
    id: string;
    name: string;
    displayName: string;
  };
  answer?: {
    answerA: string;
    answerB: string;
    answerC: string;
    answerD: string;
    explanation?: string;
  };
  attachments?: {
    id: string;
    url: string;
    type: string;
    caption?: string;
    position: number;
  }[];
}

export interface CQResourceViewProps {
  questionTypeId: string;
  subjectId: string;
  distributionId: string;
}
