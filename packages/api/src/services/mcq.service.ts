import { z } from "zod";
import { Prisma, type PrismaClient } from "@workspace/db";
import {
  type MCQ,
  mcqFormSchema,
  updateMCQSchema,
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

export class McqService {
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
    type?: string;
    reference?: string;
    isMath?: boolean;
  }): Promise<
    PaginatedResponse<MCQ & { subject: any; chapter: any }> | undefined
  > {
    try {
      const where = buildWhere(input, ["question", "explanation"]);

      if (input.search) {
        where.OR = [...where.OR, { reference: { has: input.search } }];
      }

      if (input.subjectId) where.subjectId = input.subjectId;
      if (input.chapterId) where.chapterId = input.chapterId;
      if (input.questionTypeId) where.questionTypeId = input.questionTypeId;
      if (input.type) where.type = input.type;
      if (input.reference) where.reference = { has: input.reference };
      if (input.isMath) where.isMath = input.isMath;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      // Use an array orderBy so that the primary sort is followed by a
      // deterministic tiebreaker (id). Without this, rows that share the
      // same createdAt (e.g. bulk-imported) can shuffle after an update.
      const stableOrderBy = Array.isArray(orderBy)
        ? [...orderBy, { id: "asc" as const }]
        : [orderBy, { id: "asc" as const }];

      const [items, total] = await Promise.all([
        this.db.mcq.findMany({
          where,
          orderBy: stableOrderBy,
          ...pagination,
          include: { subject: true, chapter: true },
        }),
        this.db.mcq.count({ where }),
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

  async getForAssignment(input: {
    page: number;
    limit: number;
    search?: string;
    subjectId: string;
    questionTypeId: string;
    chapterId?: string;
    type?: string;
    reference?: string;
  }): Promise<
    PaginatedResponse<MCQ & { subject: any; chapter: any }> | undefined
  > {
    try {
      const where: Prisma.McqWhereInput = {
        subjectId: input.subjectId,
        questionTypeId: input.questionTypeId,
        isActive: true,
      };

      if (input.chapterId) where.chapterId = input.chapterId;
      if (input.type) where.type = input.type;
      
      if (input.reference) {
        const matches = await this.db.$queryRaw<{ id: string }[]>`
          SELECT id FROM "Mcq" 
          WHERE EXISTS (
            SELECT 1 FROM unnest(reference) AS ref 
            WHERE ref ILIKE ${input.reference + "%"}
          )
        `;
        where.id = { in: matches.map((m) => m.id) };
      }

      if (input.search) {
        where.OR = [
          { question: { contains: input.search, mode: "insensitive" } },
          { context: { contains: input.search, mode: "insensitive" } },
          { reference: { has: input.search } },
        ];
      }

      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.mcq.findMany({
          where,
          orderBy: { createdAt: "desc" },
          ...pagination,
          include: { subject: true, chapter: true },
        }),
        this.db.mcq.count({ where }),
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
      return await this.db.mcq.findUnique({
        where: { id: validatedId },
        include: { subject: true, chapter: true, topic: true, subtopic: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: MCQ): Promise<MCQ | undefined> {
    try {
      const data = mcqFormSchema.parse(input);

      // Normalise optional FK fields: empty strings → null
      const sanitised: Record<string, unknown> = { ...data };
      for (const fk of ["topicId", "subTopicId"] as const) {
        if (
          fk in sanitised &&
          (sanitised[fk] === "" || sanitised[fk] === undefined)
        ) {
          sanitised[fk] = null;
        }
      }

      const item = await this.db.mcq.create({ data: sanitised as any });
      return item as unknown as MCQ;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(id: string, input: MCQ): Promise<MCQ | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const data = updateMCQSchema.parse(input);

      // Normalise optional FK fields: empty strings → null so Prisma
      // doesn't try to look up a record with id = "".
      const sanitised: Record<string, unknown> = { ...data };
      for (const fk of ["topicId", "subTopicId"] as const) {
        if (
          fk in sanitised &&
          (sanitised[fk] === "" || sanitised[fk] === undefined)
        ) {
          sanitised[fk] = null;
        }
      }

      const item = await this.db.mcq.update({
        where: { id: validatedId },
        data: sanitised as any,
      });
      return item as unknown as MCQ;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<MCQ | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const item = await this.db.mcq.delete({ where: { id: validatedId } });
      return item as unknown as MCQ;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkCreate(items: unknown[]): Promise<{ count: number } | undefined> {
    try {
      const validated = z.array(mcqFormSchema).parse(items);
      const result = await this.db.$transaction(async (tx) => {
        return tx.mcq.createMany({
          data: validated.map((item) => ({
            ...item,
            topicId: (item as any).topicId || null,
            subTopicId: (item as any).subTopicId || null,
            source: "Guide",
          })),
        });
      });
      return result;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]): Promise<any | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.mcq.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats(chapterId?: string): Promise<any | undefined> {
    try {
      const where = chapterId ? { chapterId } : {};
      const total = await this.db.mcq.count({ where });
      const types = await this.db.mcq.groupBy({
        by: ["type"],
        where,
        _count: true,
      });
      return { total, types };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
