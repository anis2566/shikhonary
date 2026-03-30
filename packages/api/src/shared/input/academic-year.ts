import z from "zod";
import { baseListInputSchema } from "../filters";
import { academicYearSchema } from "@workspace/schema";

export const listInput = baseListInputSchema.extend({
  isActive: z.boolean().nullable(),
  isCurrent: z.boolean().nullable(),
});

export type listInputType = z.infer<typeof listInput>;

export const idSchema = z.string().uuid({ message: "Invalid UUID format" });

export type idInputType = z.infer<typeof idSchema>;

export const updateAcademicYearSchema = academicYearSchema.extend({
  id: idSchema,
});

export type updateAcademicYearInputType = z.infer<
  typeof updateAcademicYearSchema
>;

export const forSelectionInput = z.object({
  search: z.string().optional(),
});

export type forSelectionInputType = z.infer<typeof forSelectionInput>;
