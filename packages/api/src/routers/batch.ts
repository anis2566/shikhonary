import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { BatchService } from "../services/batch.service";
import { idSchema, listInput, updateBatchSchema } from "../shared/input/batch";
import { batchFormSchema } from "@workspace/schema";

export const batchRouter = createTRPCRouter({
  list: tenantProcedure.input(listInput).query(async ({ ctx, input }) => {
    const service = new BatchService(ctx.tenantClient, ctx.db);
    const data = await service.list(input);
    return {
      success: true,
      data,
    };
  }),

  getById: tenantProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new BatchService(ctx.tenantClient, ctx.db);
    const data = await service.getById(input);
    return {
      success: true,
      data,
    };
  }),

  getDetails: tenantProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new BatchService(ctx.tenantClient, ctx.db);
    const data = await service.getDetails(input);
    return {
      success: true,
      data,
    };
  }),

  create: baseTenantMutationProcedure
    .input(batchFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new BatchService(ctx.tenantClient, ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Batch created successfully",
        data,
      };
    }),

  update: baseTenantMutationProcedure
    .input(updateBatchSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new BatchService(ctx.tenantClient, ctx.db);
      const data = await service.update(input);
      return {
        success: true,
        message: "Batch updated successfully",
        data,
      };
    }),

  delete: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new BatchService(ctx.tenantClient, ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Batch deleted successfully",
        data,
      };
    }),

  bulkDelete: baseTenantMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new BatchService(ctx.tenantClient, ctx.db);
      const data = await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "Batches deleted successfully",
        data,
      };
    }),

  getStats: tenantProcedure.query(async ({ ctx }) => {
    const service = new BatchService(ctx.tenantClient, ctx.db);
    const data = await service.getStats();
    return {
      success: true,
      data,
    };
  }),

  toggleActive: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new BatchService(ctx.tenantClient, ctx.db);
      const data = await service.toggleActive(input.id);
      return {
        success: true,
        message: "Batch status toggled successfully",
        data,
      };
    }),

  bulkToggleActive: baseTenantMutationProcedure
    .input(z.object({ ids: z.array(z.string()), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const service = new BatchService(ctx.tenantClient, ctx.db);
      const data = await service.bulkToggleActive(input.ids, input.isActive);
      return {
        success: true,
        message: "Batches status updated successfully",
        data,
      };
    }),
  forSelection: tenantProcedure.query(async ({ ctx }) => {
    const service = new BatchService(ctx.tenantClient, ctx.db);
    const data = await service.forSelection();
    return {
      success: true,
      data,
    };
  }),

  getByYearClassId: tenantProcedure
    .input(
      z.object({
        academicYearId: z.string().optional(),
        academicClassId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new BatchService(ctx.tenantClient, ctx.db);
      const data = await service.getByYearClassId(input);
      return {
        success: true,
        data,
      };
    }),
} satisfies TRPCRouterRecord);
