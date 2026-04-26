import z from "zod";
import { baseListInputSchema } from "../filters";
import { monthlyFeeFormSchema } from "@workspace/schema";

export const listInput = baseListInputSchema.extend({
  academicYearId: z.string().uuid().nullable().optional(),
  academicClassId: z.string().uuid().nullable().optional(),
});

export type listInputType = z.infer<typeof listInput>;

export const idSchema = z.string().uuid({ message: "Invalid UUID format" });

export type idInputType = z.infer<typeof idSchema>;

export const updateMonthlyFeeSchema = monthlyFeeFormSchema.extend({
  id: idSchema,
});

export type updateMonthlyFeeInputType = z.infer<typeof updateMonthlyFeeSchema>;
