import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { AdmissionPaymentService } from "../services/admission-payment.service";
import {
  listAdmissionPaymentInput,
  idSchema,
  updateAdmissionPaymentSchema,
} from "../shared/input/admission-payment";
import { admissionPaymentFormSchema } from "@workspace/schema";

export const admissionPaymentRouter = createTRPCRouter({
  list: tenantProcedure
    .input(listAdmissionPaymentInput)
    .query(async ({ ctx, input }) => {
      const service = new AdmissionPaymentService(ctx.tenantClient);
      const data = await service.list(input);
      return {
        success: true,
        data,
      };
    }),

  getById: tenantProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new AdmissionPaymentService(ctx.tenantClient);
    const data = await service.getById(input);
    return {
      success: true,
      data,
    };
  }),

  create: baseTenantMutationProcedure
    .input(admissionPaymentFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AdmissionPaymentService(ctx.tenantClient);
      const data = await service.create(input);
      return {
        success: true,
        message: "Admission payment recorded successfully",
        data,
      };
    }),

  update: baseTenantMutationProcedure
    .input(updateAdmissionPaymentSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AdmissionPaymentService(ctx.tenantClient);
      const data = await service.update(input);
      return {
        success: true,
        message: "Admission payment updated successfully",
        data,
      };
    }),

  delete: baseTenantMutationProcedure
    .input(z.object({ id: idSchema }))
    .mutation(async ({ ctx, input }) => {
      const service = new AdmissionPaymentService(ctx.tenantClient);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Admission payment deleted successfully",
        data,
      };
    }),

  bulkDelete: baseTenantMutationProcedure
    .input(z.object({ ids: z.array(idSchema) }))
    .mutation(async ({ ctx, input }) => {
      const service = new AdmissionPaymentService(ctx.tenantClient);
      const data = await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "Admission payments deleted successfully",
        data,
      };
    }),
} satisfies TRPCRouterRecord);
