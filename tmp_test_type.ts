import {
  questionTypeFormSchema,
  QuestionTypeFormValues,
} from "./packages/schema/src/question-type";

type CheckIsActive = QuestionTypeFormValues["isActive"];
// If CheckIsActive includes undefined, then QuestionTypeFormValues["isActive"] is optional.
