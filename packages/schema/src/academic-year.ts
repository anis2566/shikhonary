import { z } from "zod";

/**
 * Academic Year Schema
 */
export const academicYearSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isCurrent: z.boolean().default(false),
  isActive: z.boolean().default(true),
  totalStudents: z.number().int().optional(),
  totalBatches: z.number().int().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AcademicYear = z.infer<typeof academicYearSchema>;

/**
 * Form Schema for Creating Academic Year
 */
export const academicYearFormSchema = academicYearSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type AcademicYearForm = z.infer<typeof academicYearFormSchema>;

/**
 * Update Schema for Academic Year
 */
export const updateAcademicYearSchema = academicYearFormSchema.partial();
