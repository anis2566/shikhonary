import { z } from "zod";
import { type TenantClient, type PrismaClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import {
  counterFormSchema,
  uuidSchema,
  CounterFormValues,
} from "@workspace/schema";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  idInputType,
  listInputType,
  updateCounterInputType,
} from "../shared/input/counter";

/**
 * Service for managing Counters (Tenant Level)
 */
export class CounterService {
  /**
   * Note: This service expects a Tenant-specific Prisma Client
   */
  constructor(
    private db: TenantClient,
    private mainDb: PrismaClient,
  ) {}

  async list(input: listInputType) {
    try {
      const { sortBy, sortOrder, ...rest } = input;

      let finalSortBy = sortBy;
      let finalSortOrder = sortOrder;

      // Normalize combined sort tokens from frontend (e.g., 'value-desc', 'newest')
      if (sortBy === "value-desc") {
        finalSortBy = "value";
        finalSortOrder = "desc";
      } else if (sortBy === "value-asc") {
        finalSortBy = "value";
        finalSortOrder = "asc";
      } else if (sortBy === "newest") {
        finalSortBy = "createdAt";
        finalSortOrder = "desc";
      } else if (sortBy === "oldest") {
        finalSortBy = "createdAt";
        finalSortOrder = "asc";
      }

      // Search by academic year name
      const where = buildWhere(rest, ["academicYear.name"]);
      if (input.academicYearId) where.academicYearId = input.academicYearId;

      const orderBy = buildOrderBy({
        ...rest,
        sortBy: finalSortBy || undefined,
        sortOrder: (finalSortOrder as "asc" | "desc") || undefined,
      });
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.counter.findMany({
          where,
          orderBy,
          ...pagination,
          include: {
            academicYear: {
              select: {
                name: true,
              },
            },
          },
        }),
        this.db.counter.count({ where }),
      ]);

      return {
        items,
        total,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(input: idInputType) {
    try {
      const validatedId = uuidSchema.parse(input);
      return await this.db.counter.findUnique({
        where: { id: validatedId },
        include: {
          academicYear: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: CounterFormValues) {
    try {
      const data = counterFormSchema.parse(input);
      const academicClass = await this.mainDb.academicClass.findUnique({
        where: { id: data.academicClassId },
      });
      if (!academicClass) {
        throw new Error("Academic class not found");
      }

      const existingCounter = await this.db.counter.findFirst({
        where: {
          academicYearId: data.academicYearId,
          academicClassId: data.academicClassId,
        },
      });

      if (existingCounter) {
        throw new Error("Counter already exists");
      }

      return await this.db.counter.create({
        data: {
          ...data,
          className: academicClass.displayName,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(input: updateCounterInputType) {
    try {
      const { id, ...data } = input;
      const academicClass = await this.mainDb.academicClass.findUnique({
        where: { id: data.academicClassId },
      });
      if (!academicClass) {
        throw new Error("Academic class not found");
      }
      return await this.db.counter.update({
        where: { id },
        data: {
          ...data,
          className: academicClass.displayName,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(input: idInputType) {
    try {
      const validatedId = uuidSchema.parse(input);
      return await this.db.counter.delete({ where: { id: validatedId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getNextId(input: {
    academicYearId?: string;
    academicClassId?: string;
  }) {
    try {
      const { academicYearId, academicClassId } = input;
      if (!academicYearId || !academicClassId) {
        return 0;
      }
      const data = await this.db.counter.findFirst({
        where: { academicYearId, academicClassId },
      });

      if (!data) {
        return 1;
      }

      return data.value + 1;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
