import { z } from "zod";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { QuestionTypeService } from "../services/question-type.service";
import { baseListInputSchema, zNullishString } from "../shared/filters";
import {
  questionTypeFormSchema,
  updateQuestionTypeSchema,
} from "@workspace/schema";

export const questionTypeRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      baseListInputSchema.extend({
        subjectId: zNullishString,
        chapterId: zNullishString,
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new QuestionTypeService(ctx.db);
      const data = await service.list(input);
      return {
        success: true,
        data,
      };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new QuestionTypeService(ctx.db);
      const data = await service.getById(input.id);
      return {
        success: true,
        data,
      };
    }),

  create: baseMutationProcedure
    .input(questionTypeFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionTypeService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Question type created successfully",
        data,
      };
    }),

  update: baseMutationProcedure
    .input(z.object({ id: z.string(), data: updateQuestionTypeSchema }))
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionTypeService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Question type updated successfully",
        data,
      };
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionTypeService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Question type deleted successfully",
        data,
      };
    }),

  bulkActive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionTypeService(ctx.db);
      await service.bulkActive(input.ids);
      return {
        success: true,
        message: "Question types activated successfully",
      };
    }),

  bulkDeactive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionTypeService(ctx.db);
      await service.bulkDeactive(input.ids);
      return {
        success: true,
        message: "Question types deactivated successfully",
      };
    }),

  bulkDelete: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionTypeService(ctx.db);
      await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "Question types deleted successfully",
      };
    }),

  forSelection: adminProcedure
    .input(z.object({ subjectId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const service = new QuestionTypeService(ctx.db);
      const data = await service.forSelection(input?.subjectId);
      return {
        success: true,
        data,
      };
    }),
});
