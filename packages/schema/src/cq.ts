import { z } from "zod";
import { uuidSchema } from "./shared/fields";

/**
 * CQ (Creative Question) Schema
 */

export const cqFormSchema = z.object({
  context: z.string().min(1, "Stem/Context is required"),
  questionA: z.string().min(1, "Question A is required"),
  questionB: z.string().min(1, "Question B is required"),
  questionC: z.string().min(1, "Question C is required"),
  questionD: z.string().min(1, "Question D is required"),
  answerA: z.string().optional().or(z.literal("")),
  answerB: z.string().optional().or(z.literal("")),
  answerC: z.string().optional().or(z.literal("")),
  answerD: z.string().optional().or(z.literal("")),
  chapterId: uuidSchema.or(z.string().min(1, "Chapter is required")),
  subjectId: uuidSchema.or(z.string().min(1, "Subject is required")),
  topicId: uuidSchema.optional().or(z.literal("")),
  subTopicId: uuidSchema.optional().or(z.literal("")),
  isMath: z.boolean(),
  reference: z.array(z.string()).optional(),
  session: z.coerce.number().int().min(1900).max(2100),
  source: z.string().optional().or(z.literal("")),
  questionTypeId: uuidSchema.optional().or(z.literal("")),
});

export type CQFormValues = z.infer<typeof cqFormSchema>;

export const defaultCQValues: CQFormValues = {
  context: "",
  questionA: "",
  questionB: "",
  questionC: "",
  questionD: "",
  answerA: "",
  answerB: "",
  answerC: "",
  answerD: "",
  chapterId: "",
  subjectId: "",
  topicId: "",
  subTopicId: "",
  isMath: false,
  reference: [],
  session: new Date().getFullYear(),
  source: "",
  questionTypeId: "",
};

export const updateCQSchema = cqFormSchema.partial();

export const cqSchema = cqFormSchema.extend({
  id: uuidSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CQ = z.infer<typeof cqSchema>;
