import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { CqService } from "../services/cq.service";
import { baseListInputSchema, zNullishString } from "../shared/filters";

export const cqRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      baseListInputSchema.extend({
        subjectId: zNullishString,
        chapterId: zNullishString,
        questionTypeId: zNullishString,
        reference: z.string().optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new CqService(ctx.db);
      const data = await service.list(input as any);
      return {
        success: true,
        data,
      };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new CqService(ctx.db);
      const data = await service.getById(input.id);
      return {
        success: true,
        data,
      };
    }),

  create: baseMutationProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      const service = new CqService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "CQ created successfully",
        data,
      };
    }),

  update: baseMutationProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const service = new CqService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "CQ updated successfully",
        data,
      };
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new CqService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "CQ deleted successfully",
        data,
      };
    }),

  bulkDelete: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new CqService(ctx.db);
      const data = await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "CQs deleted successfully",
        data,
      };
    }),

  getStats: adminProcedure
    .input(z.object({ chapterId: zNullishString }))
    .query(async ({ ctx, input }) => {
      const service = new CqService(ctx.db);
      const data = await service.getStats(input.chapterId);
      return {
        success: true,
        data,
      };
    }),
} satisfies TRPCRouterRecord);
