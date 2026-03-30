import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import { createPaginatedResponse } from "../shared/pagination";
import { handlePrismaError } from "../middleware/error-handler";
import { type TenantClient } from "@workspace/db";
import { AcademicYear, academicYearSchema } from "@workspace/schema";
import {
  forSelectionInputType,
  idInputType,
  listInputType,
  updateAcademicYearInputType,
} from "../shared/input/academic-year";

// ---------------------------------------------------------------------------
// Input types — only inputs need explicit types, outputs are inferred
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class AcademicYearService {
  constructor(private db: TenantClient) {}

  // Return type is fully inferred — tRPC will pick it up end-to-end
  // just like writing the logic inline in the router.

  async list(input: listInputType) {
    try {
      const where = buildWhere(input, ["name"]);
      if (input.isActive !== null) where.isActive = input.isActive;
      if (input.isCurrent !== null) where.isCurrent = input.isCurrent;

      const [items, total] = await Promise.all([
        this.db.academicYear.findMany({
          where,
          include: {
            _count: {
              select: {
                batches: true,
                students: true,
              },
            },
          },
          orderBy: buildOrderBy(input),
          ...buildPagination(input),
        }),
        this.db.academicYear.count({ where }),
      ]);

      return {
        success: true,
        data: items,
        total,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(input: idInputType) {
    try {
      const item = await this.db.academicYear.findUnique({
        where: { id: input },
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

  async forSelection(input: forSelectionInputType) {
    try {
      const where = buildWhere(input, ["name"]);
      const items = await this.db.academicYear.findMany({
        where: { isActive: true, ...where },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return items;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: AcademicYear) {
    try {
      if (input.isCurrent) {
        await this.db.academicYear.updateMany({
          where: { isCurrent: true },
          data: { isCurrent: false },
        });
      }
      return this.db.academicYear.create({ data: input });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(input: updateAcademicYearInputType) {
    try {
      if (input.isCurrent) {
        await this.db.academicYear.updateMany({
          where: { isCurrent: true, id: { not: input.id } },
          data: { isCurrent: false },
        });
      }
      return this.db.academicYear.update({
        where: { id: input.id },
        data: input,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(input: idInputType) {
    try {
      return this.db.academicYear.delete({ where: { id: input } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async toggleActive(input: idInputType) {
    try {
      const academicYear = await this.db.academicYear.findUnique({
        where: { id: input },
      });

      if (!academicYear) {
        throw new Error("Academic year not found");
      }

      return this.db.academicYear.update({
        where: { id: input },
        data: { isActive: !academicYear.isActive },
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
