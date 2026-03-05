import { z } from "zod";
import { uuidSchema } from "./shared/fields";

/**
 * Question Paper Schema
 * Covers the paper metadata. The full PaperSettings (layout, typography, etc.)
 * is stored separately as a JSON blob in the `settings` column.
 */

export const questionPaperFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  examName: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  className: z.string().optional().or(z.literal("")),
  subjectName: z.string().optional().or(z.literal("")),
  chapterName: z.string().optional().or(z.literal("")),
  status: z.enum(["Draft", "Published"]).default("Draft"),
});

export type QuestionPaperFormValues = z.infer<typeof questionPaperFormSchema>;

export const defaultQuestionPaperValues: QuestionPaperFormValues = {
  title: "",
  examName: "",
  description: "",
  className: "",
  subjectName: "",
  chapterName: "",
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
  orderIndex: z.number().int().min(0).default(0),
});

export type AssignMcqInput = z.infer<typeof assignMcqSchema>;

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

export const updateSettingsSchema = z.object({
  questionPaperId: uuidSchema,
  settings: z.record(z.any()),
});
