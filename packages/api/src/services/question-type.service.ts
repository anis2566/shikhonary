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
  subjects: {
    label: string;
    subject: {
      id: string;
      displayName: string;
    };
  }[];
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
          where: {
            ...where,
            ...(input.subjectId
              ? {
                  subjects: {
                    some: { subjectId: input.subjectId },
                  },
                }
              : {}),
          },
          orderBy: input.sortBy ? orderBy : { createdAt: "desc" },
          ...pagination,
          include: {
            subjects: {
              include: {
                subject: {
                  select: { id: true, displayName: true },
                },
              },
            },
          },
        }),
        this.db.questionType.count({
          where: {
            ...where,
            ...(input.subjectId
              ? {
                  subjects: {
                    some: { subjectId: input.subjectId },
                  },
                }
              : {}),
          },
        }),
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
          subjects: {
            include: {
              subject: {
                select: { id: true, displayName: true },
              },
            },
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
      const { subjectIds, ...data } = questionTypeFormSchema.parse(input);
      const item = await this.db.questionType.create({
        data: {
          ...data,
          subjects: {
            create: subjectIds.map((id) => ({
              subjectId: id,
              label: data.label,
            })),
          },
        },
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
      const { subjectIds, ...data } = updateQuestionTypeSchema.parse(input);

      const item = await this.db.questionType.update({
        where: { id: validatedId },
        data: {
          ...data,
          ...(subjectIds
            ? {
                subjects: {
                  deleteMany: {},
                  create: subjectIds.map((id) => ({
                    subjectId: id,
                    label: data.label ?? "",
                  })),
                },
              }
            : {}),
        },
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

  async getStats(): Promise<
    | {
        totalQuestionType: number;
        activeQuestionType: number;
        inactiveQuestionType: number;
      }
    | undefined
  > {
    try {
      const [total, active] = await Promise.all([
        this.db.questionType.count(),
        this.db.questionType.count({ where: { isActive: true } }),
      ]);
      return {
        totalQuestionType: total,
        activeQuestionType: active,
        inactiveQuestionType: total - active,
      };
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
          ...(subjectId
            ? {
                subjects: {
                  some: { subjectId },
                },
              }
            : {}),
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
