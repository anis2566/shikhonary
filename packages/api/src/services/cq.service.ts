import { z } from "zod";
import { Prisma, type PrismaClient } from "@workspace/db";
import {
  type CQ,
  cqFormSchema,
  updateCQSchema,
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

export class CqService {
  constructor(private db: PrismaClient) {}

  async list(input: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    sort?: string;
    subjectId?: string;
    chapterId?: string;
    questionTypeId?: string;
    isActive?: boolean;
    reference?: string;
  }): Promise<
    PaginatedResponse<CQ & { subject: any; chapter: any; answer: any; attachments: any[] }> | undefined
  > {
    try {
      const where: Prisma.CqWhereInput = buildWhere(input, ["context", "questionA", "questionB", "questionC", "questionD"]);

      if (input.search) {
        where.OR = [
            ...(where.OR || []),
            { context: { contains: input.search, mode: "insensitive" } },
            { questionA: { contains: input.search, mode: "insensitive" } },
            { questionB: { contains: input.search, mode: "insensitive" } },
            { questionC: { contains: input.search, mode: "insensitive" } },
            { questionD: { contains: input.search, mode: "insensitive" } },
        ];
      }

      if (input.subjectId) where.subjectId = input.subjectId;
      if (input.chapterId) where.chapterId = input.chapterId;
      if (input.questionTypeId) where.questionTypeId = input.questionTypeId;
      if (input.isActive !== undefined) where.isActive = input.isActive;
      if (input.reference) where.reference = { has: input.reference };

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const stableOrderBy = Array.isArray(orderBy)
        ? [...orderBy, { id: "asc" as const }]
        : [orderBy, { id: "asc" as const }];

      const [items, total] = await Promise.all([
        this.db.cq.findMany({
          where,
          orderBy: stableOrderBy,
          ...pagination,
          include: { 
            subject: true, 
            chapter: true,
            answer: true,
            attachments: true
          },
        }),
        this.db.cq.count({ where }),
      ]);

      return createPaginatedResponse(
        items as any,
        total,
        input.page,
        input.limit,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string): Promise<any | null | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return await this.db.cq.findUnique({
        where: { id: validatedId },
        include: { 
            subject: true, 
            chapter: true, 
            topic: true, 
            subtopic: true,
            answer: true,
            attachments: true
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: any): Promise<any | undefined> {
    try {
      const data = cqFormSchema.parse(input);

      // Separate answer fields from the main CQ data
      const { answerA, answerB, answerC, answerD, explanation, ...cqData } = data as any;

      // Normalise optional FK fields
      const sanitised: Record<string, unknown> = { ...cqData };
      for (const fk of ["topicId", "subTopicId"] as const) {
        if (
          fk in sanitised &&
          (sanitised[fk] === "" || sanitised[fk] === undefined)
        ) {
          sanitised[fk] = null;
        }
      }

      const item = await this.db.cq.create({ 
        data: {
            ...sanitised,
            answer: {
                create: {
                    answerA,
                    answerB,
                    answerC,
                    answerD,
                    explanation,
                }
            }
        } as any,
        include: { answer: true }
      });
      return item;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(id: string, input: any): Promise<any | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const data = updateCQSchema.parse(input);

      const { answerA, answerB, answerC, answerD, explanation, ...cqData } = data as any;

      const sanitised: Record<string, unknown> = { ...cqData };
      for (const fk of ["topicId", "subTopicId"] as const) {
        if (
          fk in sanitised &&
          (sanitised[fk] === "" || sanitised[fk] === undefined)
        ) {
          sanitised[fk] = null;
        }
      }

      const item = await this.db.cq.update({
        where: { id: validatedId },
        data: {
            ...sanitised,
            answer: {
                upsert: {
                    create: {
                        answerA,
                        answerB,
                        answerC,
                        answerD,
                        explanation,
                    },
                    update: {
                        answerA,
                        answerB,
                        answerC,
                        answerD,
                        explanation,
                    }
                }
            }
        } as any,
        include: { answer: true }
      });
      return item;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<any | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const item = await this.db.cq.delete({ where: { id: validatedId } });
      return item;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]): Promise<any | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.cq.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats(chapterId?: string): Promise<any | undefined> {
    try {
      const where = chapterId ? { chapterId } : {};
      const total = await this.db.cq.count({ where });
      return { total };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
