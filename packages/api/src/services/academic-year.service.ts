import {
  academicYearFormSchema,
  updateAcademicYearSchema,
  uuidSchema,
} from "@workspace/schema";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import { createPaginatedResponse } from "../shared/pagination";
import { handlePrismaError } from "../middleware/error-handler";
import { type TenantClient } from "@workspace/db";

// ---------------------------------------------------------------------------
// Input types — only inputs need explicit types, outputs are inferred
// ---------------------------------------------------------------------------

type ListInput = {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
  isCurrent?: boolean;
};

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class AcademicYearService {
  constructor(private db: TenantClient) {}

  // Return type is fully inferred — tRPC will pick it up end-to-end
  // just like writing the logic inline in the router.

  async list(input: ListInput) {
    try {
      const where = buildWhere(input, ["name"]);
      if (input.isActive !== undefined) where.isActive = input.isActive;
      if (input.isCurrent !== undefined) where.isCurrent = input.isCurrent;

      const [items, total] = await Promise.all([
        this.db.academicYear.findMany({
          where,
          orderBy: buildOrderBy(input),
          ...buildPagination(input),
        }),
        this.db.academicYear.count({ where }),
      ]);

      const enriched = await Promise.all(
        items.map((item) => this.#withStats(item)),
      );

      return createPaginatedResponse(enriched, total, input.page, input.limit);
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string) {
    try {
      const item = await this.db.academicYear.findUnique({
        where: { id: uuidSchema.parse(id) },
      });
      if (!item) return null;
      return this.#withStats(item);
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getCurrent() {
    try {
      const item = await this.db.academicYear.findFirst({
        where: { isCurrent: true, isActive: true },
      });
      if (!item) return null;
      return this.#withStats(item);
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats() {
    try {
      const currentYear = await this.getCurrent();
      const [totalYears, totalStudents, totalBatches] = await Promise.all([
        this.db.academicYear.count(),
        this.db.student.count({
          where: { createdAt: { gte: currentYear?.startDate } },
        }),
        this.db.batch.count({
          where: { academicYearId: currentYear?.id },
        }),
      ]);
      return {
        totalYears,
        currentYear: currentYear?.name,
        totalStudents,
        totalBatches,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: unknown) {
    try {
      const data = academicYearFormSchema.parse(input);
      if (data.isCurrent) {
        await this.db.academicYear.updateMany({
          where: { isCurrent: true },
          data: { isCurrent: false },
        });
      }
      return this.db.academicYear.create({ data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(id: string, input: unknown) {
    try {
      const validatedId = uuidSchema.parse(id);
      const data = updateAcademicYearSchema.parse(input);
      if (data.isCurrent) {
        await this.db.academicYear.updateMany({
          where: { isCurrent: true, id: { not: validatedId } },
          data: { isCurrent: false },
        });
      }
      return this.db.academicYear.update({ where: { id: validatedId }, data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string) {
    try {
      return this.db.academicYear.delete({
        where: { id: uuidSchema.parse(id) },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  async #withStats(
    item: Awaited<
      ReturnType<TenantClient["academicYear"]["findUniqueOrThrow"]>
    >,
  ) {
    const [totalBatches, totalStudents] = await Promise.all([
      this.db.batch.count({ where: { academicYearId: item.id } }),
      this.db.student.count({ where: { batch: { academicYearId: item.id } } }),
    ]);
    return { ...item, totalStudents, totalBatches };
  }
}
