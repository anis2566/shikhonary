import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { AdmissionFeeService } from "../services/admission-fee.service";
import {
  idSchema,
  listInput,
  updateAdmissionFeeSchema,
} from "../shared/input/admission-fee";
import { admissionFeeFormSchema } from "@workspace/schema";

export const admissionFeeRouter = createTRPCRouter({
  list: tenantProcedure.input(listInput).query(async ({ ctx, input }) => {
    const service = new AdmissionFeeService(ctx.tenantClient, ctx.db);
    const data = await service.list(input);
    return {
      success: true,
      data,
    };
  }),

  getById: tenantProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new AdmissionFeeService(ctx.tenantClient, ctx.db);
    const data = await service.getById(input);
    return {
      success: true,
      data,
    };
  }),

  create: baseTenantMutationProcedure
    .input(admissionFeeFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AdmissionFeeService(ctx.tenantClient, ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Admission fee created successfully",
        data,
      };
    }),

  update: baseTenantMutationProcedure
    .input(updateAdmissionFeeSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AdmissionFeeService(ctx.tenantClient, ctx.db);
      const data = await service.update(input);
      return {
        success: true,
        message: "Admission fee updated successfully",
        data,
      };
    }),

  delete: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new AdmissionFeeService(ctx.tenantClient, ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Admission fee deleted successfully",
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
      const service = new AdmissionFeeService(ctx.tenantClient, ctx.db);
      const data = await service.getByYearClassId(input);
      return {
        success: true,
        data,
      };
    }),
} satisfies TRPCRouterRecord);
