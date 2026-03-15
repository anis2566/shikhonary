import { z } from "zod";
import { uuidSchema } from "./shared/fields";

/**
 * Question Paper Schema
 * Covers the paper metadata. The full PaperSettings (layout, typography, etc.)
 * is stored separately as a JSON blob in the `settings` column.
 */

export const questionPaperFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  examName: z.string().min(1, "Exam name is required"),
  description: z.string().optional(),
  classId: z.string().uuid("Invalid Class ID"),
  subjectIds: z
    .array(z.string().uuid())
    .min(1, "At least one subject is required"),
  total: z.number().min(0),
  timeInMinutes: z.number().min(0),
  status: z.enum(["Draft", "Published"]),
});

export type QuestionPaperFormValues = z.infer<typeof questionPaperFormSchema>;

export const defaultQuestionPaperValues: QuestionPaperFormValues = {
  title: "",
  examName: "",
  description: "",
  classId: "",
  subjectIds: [],
  total: 0,
  timeInMinutes: 0,
  status: "Draft",
};

export const updateQuestionPaperSchema = questionPaperFormSchema
  .partial()
  .extend({
    settings: z.record(z.any()).optional(),
  });

export const questionPaperSchema = questionPaperFormSchema.extend({
  id: uuidSchema,
  settings: z.any().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type QuestionPaper = z.infer<typeof questionPaperSchema>;

// ---- MCQ Assignment ----

export const assignMcqSchema = z.object({
  questionPaperId: uuidSchema,
  mcqId: uuidSchema,
  orderIndex: z.number().int().min(0).optional(),
});

export type AssignMcqInput = z.infer<typeof assignMcqSchema>;

export const assignCqSchema = z.object({
  questionPaperId: uuidSchema,
  cqId: uuidSchema,
  orderIndex: z.number().int().min(0).optional(),
});

export type AssignCqInput = z.infer<typeof assignCqSchema>;

export const removeMcqSchema = z.object({
  questionPaperQuestionId: uuidSchema,
});

export const reorderQuestionsSchema = z.object({
  questionPaperId: uuidSchema,
  items: z.array(
    z.object({
      id: uuidSchema,
      orderIndex: z.number().int().min(0),
    }),
  ),
});

export const updateMarkDistributionSchema = z.object({
  paperSubjectId: uuidSchema,
  items: z.array(
    z.object({
      questionTypeId: z.string().uuid(),
      marksPerQuestion: z.number().min(0),
      questionCount: z.number().int().min(0).optional(),
      questionsToAttempt: z.number().int().min(0).nullable().optional(),
    }),
  ),
});

export const updateSettingsSchema = z.object({
  questionPaperId: uuidSchema,
  settings: z.record(z.any()),
});
