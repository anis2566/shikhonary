import { z } from "zod";

/**
 * Academic Year Schema
 */
export const academicYearSchema = z.object({
  name: z.string().min(1, "Name is required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isCurrent: z.boolean(),
  isActive: z.boolean(),
});

export type AcademicYear = z.infer<typeof academicYearSchema>;
