import { z } from "zod";
import { nameSchema, uuidSchema } from "./shared/fields";

/**
 * Batch Schema
 */

export const batchFormSchema = z.object({
  academicYearId: uuidSchema,
  academicClassId: uuidSchema.or(z.string().min(1, "Please select a class")),
  name: nameSchema,
  academicYear: z.string().min(4, "Invalid year").max(20),
  capacity: z.coerce
    .number()
    .int()
    .min(1, "Capacity must be at least 1"),
  isActive: z.boolean(),
});

export type BatchFormValues = z.infer<typeof batchFormSchema>;
