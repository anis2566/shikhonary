import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { McqService } from "../services/mcq.service";
import { baseListInputSchema, zNullishString } from "../shared/filters";

export const mcqRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      baseListInputSchema.extend({
        subjectId: zNullishString,
        chapterId: zNullishString,
        type: zNullishString,
        reference: zNullishString,
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      const data = await service.list(input as any);
      return {
        success: true,
        data,
      };
    }),

  getForAssignment: adminProcedure
    .input(
      baseListInputSchema.extend({
        subjectId: z.string(),
        questionTypeId: z.string(),
        chapterId: zNullishString,
        type: zNullishString,
        reference: zNullishString,
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      const data = await service.getForAssignment(input as any);
      return {
        success: true,
        data,
      };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      const data = await service.getById(input.id);
      return {
        success: true,
        data,
      };
    }),

  create: baseMutationProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "MCQ created successfully",
        data,
      };
    }),

  update: baseMutationProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "MCQ updated successfully",
        data,
      };
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "MCQ deleted successfully",
        data,
      };
    }),

  bulkCreate: baseMutationProcedure
    .input(z.array(z.any()))
    .mutation(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      const data = await service.bulkCreate(input);
      return {
        success: true,
        message: `${data?.count ?? 0} MCQs created successfully`,
        data,
      };
    }),

  bulkDelete: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      const data = await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "MCQs deleted successfully",
        data,
      };
    }),

  getStats: adminProcedure
    .input(z.object({ chapterId: zNullishString }))
    .query(async ({ ctx, input }) => {
      const service = new McqService(ctx.db);
      const data = await service.getStats(input.chapterId);
      return {
        success: true,
        data,
      };
    }),
} satisfies TRPCRouterRecord);
