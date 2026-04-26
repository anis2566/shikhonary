import { z } from "zod";

/**
 * Admission Fee Schema
 */

export const admissionFeeFormSchema = z.object({
  academicYearId: z.string().min(1, "Academic year is required"),
  academicClassId: z.string().min(1, "Class is required"),
  amount: z.number().min(0, "Amount must be at least 0"),
});

export type AdmissionFeeFormValues = z.infer<typeof admissionFeeFormSchema>;
