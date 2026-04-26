import z from "zod";
import { baseListInputSchema } from "../filters";
import { admissionFeeFormSchema } from "@workspace/schema";

export const listInput = baseListInputSchema.extend({
  academicYearId: z.string().uuid().nullable().optional(),
  academicClassId: z.string().uuid().nullable().optional(),
});

export type listInputType = z.infer<typeof listInput>;

export const idSchema = z.string().uuid({ message: "Invalid UUID format" });

export type idInputType = z.infer<typeof idSchema>;

export const updateAdmissionFeeSchema = admissionFeeFormSchema.extend({
  id: idSchema,
});

export type updateAdmissionFeeInputType = z.infer<typeof updateAdmissionFeeSchema>;
