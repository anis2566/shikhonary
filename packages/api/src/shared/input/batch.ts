import z from "zod";
import { baseListInputSchema } from "../filters";
import { batchFormSchema } from "@workspace/schema";

export const listInput = baseListInputSchema.extend({
  academicClassId: z.string().uuid().nullable(),
  academicYearId: z.string().uuid().nullable(),
});

export type listInputType = z.infer<typeof listInput>;

export const idSchema = z.string().uuid({ message: "Invalid UUID format" });

export type idInputType = z.infer<typeof idSchema>;

export const updateBatchSchema = batchFormSchema.extend({
  id: idSchema,
});

export type updateBatchInputType = z.infer<typeof updateBatchSchema>;
