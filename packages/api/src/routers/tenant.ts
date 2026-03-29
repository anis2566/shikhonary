import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
  publicProcedure,
} from "../trpc/index";
import { TenantService } from "../services/tenant.service";
import { baseListInputSchema } from "../shared/filters";
import { tenantFormSchema, updateTenantSchema } from "@workspace/schema";

/**
 * Platform-wide Tenant Management Router (Admin Only)
 */
export const tenantRouter = createTRPCRouter({
  list: adminProcedure
    .input(baseListInputSchema)
    .query(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      return await service.list(input);
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      return await service.getById(input.id);
    }),

  create: baseMutationProcedure
    .input(tenantFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Tenant created successfully",
        data,
      };
    }),

  update: baseMutationProcedure
    .input(z.object({ id: z.string(), data: updateTenantSchema }))
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Tenant updated successfully",
        data,
      };
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Tenant deleted successfully",
        data,
      };
    }),

  toggleStatus: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      const data = await service.toggleStatus(input.id);
      return {
        success: true,
        message: "Tenant status updated successfully",
        data,
      };
    }),

  bulkActive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      await service.bulkActive(input.ids);
      return {
        success: true,
        message: "Tenants activated successfully",
      };
    }),

  bulkDeactive: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      await service.bulkDeactive(input.ids);
      return {
        success: true,
        message: "Tenants deactivated successfully",
      };
    }),

  bulkDelete: baseMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "Tenants deleted successfully",
      };
    }),

  getStats: adminProcedure.query(async ({ ctx }) => {
    const service = new TenantService(ctx.db);
    const data = await service.getStats();
    return {
      success: true,
      data,
    };
  }),

  sendInvitation: adminProcedure
    .input(
      z.object({
        tenantId: z.string(),
        email: z.string().email(),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);

      const data = await service.sendInvitation({
        tenantId: input.tenantId,
        email: input.email,
        name: input.name,
        // Using userId as invitedBy
        invitedBy: "Admin",
      });

      return {
        success: true,
        message: "Invitation sent successfully",
        data,
      };
    }),

  validateInvitation: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      const data = await service.validateInvitation(input.token);
      return {
        success: true,
        data,
      };
    }),

  acceptInvitation: publicProcedure
    .input(
      z.object({
        token: z.string(),
        password: z.string().optional(),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new TenantService(ctx.db);
      const data = await service.acceptInvitation({
        token: input.token,
        userId: ctx.userId ?? undefined,
        password: input.password,
        name: input.name,
      });

      return {
        success: true,
        message: "Invitation accepted successfully",
        data,
      };
    }),
} satisfies TRPCRouterRecord);
