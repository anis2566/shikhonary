import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { QuestionPaperService } from "../services/question-paper.service";
import { baseListInputSchema, zNullishString } from "../shared/filters";

export const questionPaperRouter = createTRPCRouter({
  // ─── Queries ────────────────────────────────────────────────────────────

  list: adminProcedure
    .input(
      baseListInputSchema.extend({
        status: zNullishString,
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new QuestionPaperService(ctx.db);
      const data = await service.list(input);
      return { success: true, data };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new QuestionPaperService(ctx.db);
      const data = await service.getByIdWithMcqs(input.id);
      return { success: true, data };
    }),

  // ─── Mutations ──────────────────────────────────────────────────────────

  create: baseMutationProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionPaperService(ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Question paper created successfully",
        data,
      };
    }),

  update: baseMutationProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionPaperService(ctx.db);
      const data = await service.update(input.id, input.data);
      return {
        success: true,
        message: "Question paper updated successfully",
        data,
      };
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionPaperService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Question paper deleted successfully",
        data,
      };
    }),

  updateSettings: baseMutationProcedure
    .input(
      z.object({
        questionPaperId: z.string(),
        settings: z.record(z.any()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionPaperService(ctx.db);
      const data = await service.updateSettings(
        input.questionPaperId,
        input.settings,
      );
      return {
        success: true,
        message: "Settings saved",
        data,
      };
    }),

  // ─── MCQ Assignment ──────────────────────────────────────────────────────

  assignMcq: baseMutationProcedure
    .input(
      z.object({
        questionPaperId: z.string(),
        mcqId: z.string(),
        orderIndex: z.number().int().min(0).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionPaperService(ctx.db);
      const data = await service.assignMcq({
        ...input,
        orderIndex: input.orderIndex ?? 0,
      });
      return {
        success: true,
        message: "MCQ assigned to paper",
        data,
      };
    }),

  removeMcq: baseMutationProcedure
    .input(z.object({ questionPaperQuestionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionPaperService(ctx.db);
      const data = await service.removeMcq(input.questionPaperQuestionId);
      return {
        success: true,
        message: "MCQ removed from paper",
        data,
      };
    }),

  reorderQuestions: baseMutationProcedure
    .input(
      z.object({
        questionPaperId: z.string(),
        items: z.array(
          z.object({ id: z.string(), orderIndex: z.number().int() }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionPaperService(ctx.db);
      await service.reorderQuestions(input.questionPaperId, input.items);
      return {
        success: true,
        message: "Questions reordered",
      };
    }),
} satisfies TRPCRouterRecord);
