import { z } from "zod";
import { nameSchema } from "./shared/fields";

/**
 * Question Type Schema
 */

export const questionTypeFormSchema = z.object({
  name: nameSchema,
  displayName: nameSchema,
  label: z.string().min(1, "Label is required"),
  subjectIds: z
    .array(z.string().uuid())
    .min(1, "Please select at least one subject"),
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
  label: "",
  subjectIds: [],
  isActive: true,
};

export const updateQuestionTypeSchema = questionTypeFormSchema.partial();
