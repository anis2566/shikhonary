import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { AcademicYearService } from "../services/academic-year.service";
import { baseListInputSchema, zNullishString } from "../shared/filters";

export const academicYearRouter = createTRPCRouter({
  list: tenantProcedure
    .input(
      baseListInputSchema.extend({
        isActive: z.boolean().optional(),
        isCurrent: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new AcademicYearService(ctx.tenantClient);
      return await service.list(input);
    }),

  getById: tenantProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new AcademicYearService(ctx.tenantClient);
      return await service.getById(input.id);
    }),

  create: baseTenantMutationProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicYearService(ctx.tenantClient);
      const data = await service.create(input);
      return {
        success: true,
        message: "Academic year created successfully",
        data,
      };
    }),

  update: baseTenantMutationProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicYearService(ctx.tenantClient);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Academic year updated successfully",
        data,
      };
    }),

  delete: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicYearService(ctx.tenantClient);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Academic year deleted successfully",
        data,
      };
    }),
  getStats: tenantProcedure.query(async ({ ctx }) => {
    const service = new AcademicYearService(ctx.tenantClient);
    return await service.getStats();
  }),

  getCurrent: tenantProcedure.query(async ({ ctx }) => {
    const service = new AcademicYearService(ctx.tenantClient);
    return await service.getCurrent();
  }),
} satisfies TRPCRouterRecord);
