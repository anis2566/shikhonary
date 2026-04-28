import z from "zod";
import { baseListInputSchema } from "../filters";
import { admissionPaymentFormSchema } from "@workspace/schema";

export const listAdmissionPaymentInput = baseListInputSchema.extend({
  studentSearch: z.string().optional().nullable(),
  transactionSearch: z.string().optional().nullable(),
  studentId: z.string().optional().nullable(),
  academicYearId: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  paymentMethod: z.string().optional().nullable(),
  paymentDate: z.string().optional().nullable(),
});

export type ListAdmissionPaymentInputType = z.infer<typeof listAdmissionPaymentInput>;

export const idSchema = z.string().cuid();

export type IdInputType = z.infer<typeof idSchema>;

export const updateAdmissionPaymentSchema = admissionPaymentFormSchema.extend({
  id: idSchema,
});

export type UpdateAdmissionPaymentInputType = z.infer<typeof updateAdmissionPaymentSchema>;
