import { z } from "zod";
import { uuidSchema } from "./shared/fields";

/**
 * Counter Schema
 */

export const counterFormSchema = z.object({
  academicYearId: z.string().min(1, "Academic year is required"),
  academicClassId: z.string().min(1, "Class is required"),
  value: z.number().int().min(0, "Value must be at least 0"),
});

export type CounterFormValues = z.infer<typeof counterFormSchema>;
