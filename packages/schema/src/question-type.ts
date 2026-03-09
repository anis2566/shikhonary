import { z } from "zod";
import { nameSchema } from "./shared/fields";

/**
 * Question Type Schema
 */

export const questionTypeFormSchema = z.object({
  name: nameSchema,
  displayName: nameSchema,
  subjectId: z.string().uuid("Please select a subject"),
  chapterId: z.string().uuid().nullable(),
  isActive: z.boolean(),
});

export type QuestionTypeFormValues = z.infer<typeof questionTypeFormSchema>;

export const questionTypeSchema = questionTypeFormSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type QuestionType = z.infer<typeof questionTypeSchema>;

export const defaultQuestionTypeValues: QuestionTypeFormValues = {
  name: "",
  displayName: "",
  subjectId: "",
  chapterId: null,
  isActive: true,
};

export const updateQuestionTypeSchema = questionTypeFormSchema.partial();
