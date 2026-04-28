import { z } from "zod";

/**
 * Admission Payment Schema
 */

export const admissionPaymentFormSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  academicYearId: z.string().min(1, "Academic year is required"),
  amount: z.number().min(0, "Amount must be at least 0"),
  discount: z.number().min(0, "Discount must be at least 0"),
  paidAmount: z.number().min(0, "Paid amount must be at least 0"),
  paymentDate: z.coerce.date(),
  paymentMethod: z.string().min(1, "Payment method is required"),
  transactionId: z.string().optional().nullable(),
  status: z.string().min(1, "Status is required"),
  remarks: z.string().optional().nullable(),
  collectedById: z.string().min(1, "Collector is required"),
});

export type AdmissionPaymentFormValues = z.infer<typeof admissionPaymentFormSchema>;
