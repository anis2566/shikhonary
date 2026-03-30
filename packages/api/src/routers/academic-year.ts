import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { AcademicYearService } from "../services/academic-year.service";
import {
  forSelectionInput,
  idSchema,
  listInput,
  updateAcademicYearSchema,
} from "../shared/input/academic-year";
import { academicYearSchema } from "@workspace/schema";

export const academicYearRouter = createTRPCRouter({
  list: tenantProcedure.input(listInput).query(async ({ ctx, input }) => {
    const service = new AcademicYearService(ctx.tenantClient);
    const data = await service.list(input);
    return {
      success: true,
      data,
    };
  }),

  getById: tenantProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new AcademicYearService(ctx.tenantClient);
    const data = await service.getById(input);
    return {
      success: true,
      data,
    };
  }),

  create: baseTenantMutationProcedure
    .input(academicYearSchema)
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
    .input(updateAcademicYearSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicYearService(ctx.tenantClient);
      const data = await service.update(input);
      return {
        success: true,
        message: "Academic year updated successfully",
        data,
      };
    }),

  delete: baseTenantMutationProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicYearService(ctx.tenantClient);
      const data = await service.delete(input);
      return {
        success: true,
        message: "Academic year deleted successfully",
        data,
      };
    }),

  toggleActive: baseTenantMutationProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AcademicYearService(ctx.tenantClient);
      const data = await service.toggleActive(input);
      return {
        success: true,
        message: "Academic year toggled successfully",
        data,
      };
    }),

  getStats: tenantProcedure.query(async ({ ctx }) => {
    const service = new AcademicYearService(ctx.tenantClient);
    const data = await service.getStats();
    return {
      success: true,
      data,
    };
  }),

  getCurrent: tenantProcedure.query(async ({ ctx }) => {
    const service = new AcademicYearService(ctx.tenantClient);
    const data = await service.getCurrent();
    return {
      success: true,
      data,
    };
  }),

  forSelection: tenantProcedure
    .input(forSelectionInput)
    .query(async ({ ctx, input }) => {
      const service = new AcademicYearService(ctx.tenantClient);
      const data = await service.forSelection(input);
      return {
        success: true,
        data,
      };
    }),
} satisfies TRPCRouterRecord);
