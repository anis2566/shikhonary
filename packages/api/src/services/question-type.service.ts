import { z } from "zod";
import { type QuestionType, type PrismaClient } from "@workspace/db";
import {
  questionTypeFormSchema,
  updateQuestionTypeSchema,
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

export interface QuestionTypeWithRelations extends QuestionType {
  subject: {
    id: string;
    displayName: string;
  };
  chapter?: {
    id: string;
    displayName: string;
  } | null;
}

/**
 * Service for managing Question Types
 */
export class QuestionTypeService {
  constructor(private db: PrismaClient) {}

  async list(input: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
    subjectId?: string;
    chapterId?: string;
  }): Promise<PaginatedResponse<QuestionTypeWithRelations> | undefined> {
    try {
      const where = buildWhere(input);
      if (input.subjectId) where.subjectId = input.subjectId;
      if (input.chapterId) where.chapterId = input.chapterId;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.questionType.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { createdAt: "desc" },
          ...pagination,
          include: {
            subject: {
              select: { id: true, displayName: true },
            },
            chapter: {
              select: { id: true, displayName: true },
            },
          },
        }),
        this.db.questionType.count({ where }),
      ]);

      return createPaginatedResponse(
        items as QuestionTypeWithRelations[],
        total,
        input.page,
        input.limit,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(
    id: string,
  ): Promise<QuestionTypeWithRelations | null | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const item = await this.db.questionType.findUnique({
        where: { id: validatedId },
        include: {
          subject: {
            select: { id: true, displayName: true },
          },
          chapter: {
            select: { id: true, displayName: true },
          },
        },
      });

      return item as QuestionTypeWithRelations;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(
    input: z.infer<typeof questionTypeFormSchema>,
  ): Promise<QuestionType | undefined> {
    try {
      const data = questionTypeFormSchema.parse(input);
      const item = await this.db.questionType.create({
        data,
      });
      return item;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(
    id: string,
    input: z.infer<typeof updateQuestionTypeSchema>,
  ): Promise<QuestionType | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const data = updateQuestionTypeSchema.parse(input);

      const item = await this.db.questionType.update({
        where: { id: validatedId },
        data,
      });
      return item;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<QuestionType | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const item = await this.db.questionType.delete({
        where: { id: validatedId },
      });
      return item;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkActive(ids: string[]): Promise<{ count: number } | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.questionType.updateMany({
        where: { id: { in: validatedIds } },
        data: { isActive: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDeactive(ids: string[]): Promise<{ count: number } | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.questionType.updateMany({
        where: { id: { in: validatedIds } },
        data: { isActive: false },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]): Promise<{ count: number } | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.questionType.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async forSelection(
    subjectId?: string,
  ): Promise<{ id: string; displayName: string }[] | undefined> {
    try {
      return await this.db.questionType.findMany({
        where: {
          isActive: true,
          ...(subjectId ? { subjectId } : {}),
        },
        select: {
          id: true,
          displayName: true,
        },
        orderBy: { displayName: "asc" },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
