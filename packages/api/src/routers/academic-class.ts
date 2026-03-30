import { z } from "zod";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
  publicProcedure,
} from "../trpc/index";
import { AcademicClassService } from "../services/academic-class.service";
import { baseListInputSchema, zNullishString } from "../shared/filters";
import {
  academicClassFormSchema,
  updateAcademicClassSchema,
} from "@workspace/schema";

export const academicClassRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      baseListInputSchema.extend({
        level: zNullishString,
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      const data = await service.list(input);
      return {
        success: true,
        data,
      };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      const data = await service.getById(input.id);
      return {
        success: true,
        data,
      };
    }),

  create: baseMutationProcedure
    .input(academicClassFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Academic class created successfully",
        data,
      };
    }),

  update: baseMutationProcedure
    .input(z.object({ id: z.string(), data: updateAcademicClassSchema }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Academic class updated successfully",
        data,
      };
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Academic class deleted successfully",
        data,
      };
    }),

  bulkActive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      await service.bulkActive(input.ids);
      return {
        success: true,
        message: "Academic classes activated successfully",
      };
    }),

  bulkDeactive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      await service.bulkDeactive(input.ids);
      return {
        success: true,
        message: "Academic classes deactivated successfully",
      };
    }),

  bulkDelete: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "Academic classes deleted successfully",
      };
    }),

  reorder: baseMutationProcedure
    .input(z.array(z.object({ id: z.string(), position: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      const data = await service.reorder(input);
      return {
        success: true,
        message: "Classes reordered successfully",
        data,
      };
    }),

  getStats: adminProcedure.query(async ({ ctx }) => {
    const service = new AcademicClassService(ctx.db);
    const data = await service.getStats();
    return {
      success: true,
      data,
    };
  }),

  getDetailedStats: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      const data = await service.getDetailedStats(input.id);
      return {
        success: true,
        data,
      };
    }),

  getStatisticsData: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      const data = await service.getStatisticsData(input.id);
      return {
        success: true,
        data,
      };
    }),

  getRecentTopics: adminProcedure
    .input(z.object({ classId: z.string(), limit: z.number().default(4) }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicClassService(ctx.db);
      const data = await service.getRecentTopics(input);
      return {
        success: true,
        data,
      };
    }),

  forSelection: publicProcedure.query(async ({ ctx }) => {
    const service = new AcademicClassService(ctx.db);
    const data = await service.forSelection();
    return {
      success: true,
      data,
    };
  }),
});
