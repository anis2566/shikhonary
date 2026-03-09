import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { QuestionPaperService } from "../services/question-paper.service";
import { baseListInputSchema, zNullishString } from "../shared/filters";
import {
  questionPaperFormSchema,
  updateQuestionPaperSchema,
} from "@workspace/schema";

// ─── Inline schemas for new distribution shape ────────────────────────────────
// Defined here rather than in @workspace/schema so the router owns the wire
// contract; the service uses its own DistributionInput interface internally.

const distributionItemSchema = z.object({
  type: z.string().min(1),
  marksPerQuestion: z.number().min(0),
  questionCount: z.number().int().min(0),
  questionsToAttempt: z.number().int().min(0).nullable().optional(),
  sectionLabel: z.string().nullable().optional(),
  orderIndex: z.number().int().min(0).optional(),
});

const subjectBreakdownSchema = z.object({
  subjectId: z.string().uuid(),
  distributions: z.array(distributionItemSchema),
});

// Extends the core paper schema to also accept the optional breakdown payload
// that `CreatePaperForm` attaches. The service pulls this out before running
// `questionPaperFormSchema.parse()` on the rest.
const createQuestionPaperInputSchema = questionPaperFormSchema.extend({
  subjectBreakdowns: z.array(subjectBreakdownSchema).optional(),
});

const updateMarkDistributionSchema = z.object({
  paperSubjectId: z.string().uuid(),
  // paperId is required so the hook can do targeted cache invalidation
  paperId: z.string().uuid(),
  items: z.array(distributionItemSchema),
});

// ─────────────────────────────────────────────────────────────────────────────

export const questionPaperRouter = createTRPCRouter({
  // ─── Queries ──────────────────────────────────────────────────────────────

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
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const service = new QuestionPaperService(ctx.db);
      const data = await service.getByIdWithMcqs(input.id);
      return { success: true, data };
    }),

  /**
   * Returns all subject mark distributions for a paper, ordered by
   * subject then orderIndex. Used by the builder's mark-breakdown panel.
   */
  getMarkDistributions: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const service = new QuestionPaperService(ctx.db);
      const data = await service.getMarkDistributions(input.id);
      return { success: true, data };
    }),

  // ─── Mutations ────────────────────────────────────────────────────────────

  create: baseMutationProcedure
    .input(createQuestionPaperInputSchema)
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
    .input(z.object({ id: z.string().uuid(), data: updateQuestionPaperSchema }))
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
    .input(z.object({ id: z.string().uuid() }))
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
        questionPaperId: z.string().uuid(),
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

  // ─── MCQ Assignment ───────────────────────────────────────────────────────

  assignMcq: baseMutationProcedure
    .input(
      z.object({
        questionPaperId: z.string().uuid(),
        mcqId: z.string().uuid(),
        orderIndex: z.number().int().min(0).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionPaperService(ctx.db);
      const data = await service.assignMcq(input);
      return {
        success: true,
        message: "MCQ assigned to paper",
        data,
      };
    }),

  removeMcq: baseMutationProcedure
    .input(z.object({ questionPaperQuestionId: z.string().uuid() }))
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
        questionPaperId: z.string().uuid(),
        items: z.array(
          z.object({
            id: z.string().uuid(),
            orderIndex: z.number().int().min(0),
          }),
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

  updateQuestionOverrides: baseMutationProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        overrides: z.record(z.any()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionPaperService(ctx.db);
      const data = await service.updateQuestionOverrides(
        input.id,
        input.overrides,
      );
      return {
        success: true,
        message: "Question style updated",
        data,
      };
    }),

  /**
   * Replaces all distribution rows for a (paper × subject) record.
   * `paperId` is passed through so the hook can do targeted invalidation
   * of both `getById` and `getMarkDistributions` without busting every
   * cached paper in the query client.
   */
  updateMarkDistribution: baseMutationProcedure
    .input(updateMarkDistributionSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new QuestionPaperService(ctx.db);
      // paperId is only used for cache invalidation in the hook; the service
      // needs only paperSubjectId + items.
      await service.updateMarkDistribution(input.paperSubjectId, input.items);
      return {
        success: true,
        message: "Mark distribution updated",
      };
    }),
});
