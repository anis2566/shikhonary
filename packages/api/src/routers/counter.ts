import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { CounterService } from "../services/counter.service";
import {
  idSchema,
  listInput,
  updateCounterSchema,
} from "../shared/input/counter";
import { counterFormSchema } from "@workspace/schema";

export const counterRouter = createTRPCRouter({
  list: tenantProcedure.input(listInput).query(async ({ ctx, input }) => {
    const service = new CounterService(ctx.tenantClient, ctx.db);
    const data = await service.list(input);
    return {
      success: true,
      data,
    };
  }),

  getById: tenantProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new CounterService(ctx.tenantClient, ctx.db);
    const data = await service.getById(input);
    return {
      success: true,
      data,
    };
  }),

  create: baseTenantMutationProcedure
    .input(counterFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new CounterService(ctx.tenantClient, ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Counter created successfully",
        data,
      };
    }),

  update: baseTenantMutationProcedure
    .input(updateCounterSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new CounterService(ctx.tenantClient, ctx.db);
      const data = await service.update(input);
      return {
        success: true,
        message: "Counter updated successfully",
        data,
      };
    }),

  delete: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new CounterService(ctx.tenantClient, ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Counter deleted successfully",
        data,
      };
    }),

  getNextId: tenantProcedure
    .input(
      z.object({
        academicYearId: z.string().optional(),
        academicClassId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new CounterService(ctx.tenantClient, ctx.db);
      const data = await service.getNextId(input);
      return {
        success: true,
        data,
      };
    }),
} satisfies TRPCRouterRecord);
