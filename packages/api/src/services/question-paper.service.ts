import { type PrismaClient } from "@workspace/db";
import {
  questionPaperFormSchema,
  updateQuestionPaperSchema,
  assignMcqSchema,
  reorderQuestionsSchema,
  uuidSchema,
} from "@workspace/schema";
import { handlePrismaError } from "../middleware/error-handler";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  createPaginatedResponse,
  type PaginatedResponse,
} from "../shared/pagination";

export class QuestionPaperService {
  constructor(private db: PrismaClient) {}

  // ─────────────────────────────────────────────────────────────── LIST ────

  async list(input: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    sort?: string;
    status?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<any> | undefined> {
    try {
      const where = buildWhere(input, ["title", "examName", "description"]);
      if (input.status) where.status = input.status;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const stableOrderBy = Array.isArray(orderBy)
        ? [...orderBy, { id: "asc" as const }]
        : [orderBy, { id: "asc" as const }];

      const [items, total] = await Promise.all([
        (this.db as any).questionPaper.findMany({
          where,
          orderBy: stableOrderBy,
          ...pagination,
          include: {
            _count: { select: { questions: true } },
          },
        }),
        (this.db as any).questionPaper.count({ where }),
      ]);

      return createPaginatedResponse(items, total, input.page, input.limit);
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ──────────────────────────────────────────────────────────── GET BY ID ──

  async getById(id: string): Promise<any | null | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return await (this.db as any).questionPaper.findUnique({
        where: { id: validatedId },
        include: {
          questions: {
            orderBy: { orderIndex: "asc" as const },
            include: {
              // We can't do a cross-db join here – mcqId is stored.
              // The MCQ data will be fetched separately or via a raw join.
              // For now we return the mcqId and let the client fetch MCQs,
              // OR we batch-fetch MCQs by id below.
            },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Returns the paper with MCQ data fully resolved (batch lookup).
   */
  async getByIdWithMcqs(id: string): Promise<any | null | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);

      const paper = await (this.db as any).questionPaper.findUnique({
        where: { id: validatedId },
        include: {
          questions: {
            orderBy: { orderIndex: "asc" as const },
          },
        },
      });

      if (!paper) return null;

      // Batch-fetch MCQs from the tenant DB
      const mcqIds = paper.questions.map((q: any) => q.mcqId);
      const mcqs =
        mcqIds.length > 0
          ? await (this.db as any).mcq.findMany({
              where: { id: { in: mcqIds } },
              include: { subject: true, chapter: true },
            })
          : [];

      const mcqMap = new Map(mcqs.map((m: any) => [m.id, m]));

      return {
        ...paper,
        questions: paper.questions.map((q: any) => ({
          ...q,
          mcq: mcqMap.get(q.mcqId) ?? null,
        })),
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ──────────────────────────────────────────────────────────────── CREATE ──

  async create(input: unknown): Promise<any | undefined> {
    try {
      const data = questionPaperFormSchema.parse(input);
      return await (this.db as any).questionPaper.create({ data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ──────────────────────────────────────────────────────────────── UPDATE ──

  async update(id: string, input: unknown): Promise<any | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const data = updateQuestionPaperSchema.parse(input);
      return await (this.db as any).questionPaper.update({
        where: { id: validatedId },
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ─────────────────────────────────────── PERSIST BUILDER SETTINGS (JSON) ─

  async updateSettings(
    questionPaperId: string,
    settings: Record<string, unknown>,
  ): Promise<any | undefined> {
    try {
      const validatedId = uuidSchema.parse(questionPaperId);
      return await (this.db as any).questionPaper.update({
        where: { id: validatedId },
        data: { settings },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ──────────────────────────────────────────────────────────────── DELETE ──

  async delete(id: string): Promise<any | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      // Soft-delete
      return await (this.db as any).questionPaper.update({
        where: { id: validatedId },
        data: { deletedAt: new Date(), isActive: false },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ────────────────────────────────────────────────────── ASSIGN / REMOVE ──

  async assignMcq(input: unknown): Promise<any | undefined> {
    try {
      const { questionPaperId, mcqId, orderIndex } =
        assignMcqSchema.parse(input);

      // If no orderIndex provided, auto-assign to end
      let resolvedIndex = orderIndex;
      if (resolvedIndex === 0) {
        const count = await (this.db as any).questionPaperQuestion.count({
          where: { questionPaperId },
        });
        resolvedIndex = count;
      }

      return await (this.db as any).questionPaperQuestion.upsert({
        where: { questionPaperId_mcqId: { questionPaperId, mcqId } },
        create: { questionPaperId, mcqId, orderIndex: resolvedIndex },
        update: { orderIndex: resolvedIndex },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async removeMcq(questionPaperQuestionId: string): Promise<any | undefined> {
    try {
      const validatedId = uuidSchema.parse(questionPaperQuestionId);
      return await (this.db as any).questionPaperQuestion.delete({
        where: { id: validatedId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ──────────────────────────────────────────────────────────────── REORDER ─

  async reorderQuestions(
    questionPaperId: string,
    items: { id: string; orderIndex: number }[],
  ): Promise<void> {
    try {
      const validatedPaperId = uuidSchema.parse(questionPaperId);
      const parsed = reorderQuestionsSchema.parse({
        questionPaperId: validatedPaperId,
        items,
      });

      await (this.db as any).$transaction(
        parsed.items.map((item: { id: string; orderIndex: number }) =>
          (this.db as any).questionPaperQuestion.update({
            where: { id: item.id },
            data: { orderIndex: item.orderIndex },
          }),
        ),
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
