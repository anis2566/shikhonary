import { z } from "zod";
import { type TenantClient, type PrismaClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import {
  batchFormSchema,
  uuidSchema,
  BatchFormValues,
} from "@workspace/schema";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  idInputType,
  listInputType,
  updateBatchInputType,
} from "../shared/input/batch";

/**
 * Service for managing Batches (Tenant Level)
 */
export class BatchService {
  /**
   * Note: This service expects a Tenant-specific Prisma Client
   */
  constructor(
    private db: TenantClient,
    private mainDb: PrismaClient,
  ) {}

  async list(input: listInputType) {
    try {
      const where = buildWhere(input, ["name"]);
      if (input.academicClassId) where.academicClassId = input.academicClassId;
      if (input.academicYearId) where.academicYearId = input.academicYearId;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.batch.findMany({
          where,
          orderBy,
          ...pagination,
          include: {
            _count: { select: { students: true } },
            academicYear: {
              select: {
                name: true,
              },
            },
          },
        }),
        this.db.batch.count({ where }),
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
      return await this.db.batch.findUnique({
        where: { id: validatedId },
        include: {
          academicYear: true,
          _count: {
            select: {
              students: true,
              exams: true,
            },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getDetails(input: idInputType) {
    try {
      const validatedId = uuidSchema.parse(input);

      const batch = await this.db.batch.findUnique({
        where: { id: validatedId },
        include: {
          academicYear: true,
          _count: {
            select: {
              students: true,
              exams: true,
            },
          },
        },
      });

      if (!batch) return null;

      const [totalStudents, inactiveStudents, totalExams] = await Promise.all([
        this.db.student.count({ where: { batchId: input } }),
        this.db.student.count({ where: { batchId: input, isActive: false } }),
        this.db.exam.count({ where: { batchId: input } }),
      ]);

      return {
        ...batch,
        stats: {
          totalStudents,
          inactiveStudents,
          totalExams,
        },
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: BatchFormValues) {
    try {
      const { academicYear, ...data } = batchFormSchema.parse(input);
      const academicClass = await this.mainDb.academicClass.findUnique({
        where: { id: data.academicClassId },
      });
      if (!academicClass) throw new Error("Academic class not found");
      // Prisma expects academicYearId, which is already in 'data'
      return await this.db.batch.create({
        data: {
          ...data,
          className: academicClass.name,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(input: updateBatchInputType) {
    try {
      const { id, academicYear, ...data } = input;
      return await this.db.batch.update({
        where: { id },
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(input: idInputType) {
    try {
      const validatedId = uuidSchema.parse(input);
      return await this.db.batch.delete({ where: { id: validatedId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats() {
    try {
      const [total, active, totalStudentsResult, batches] = await Promise.all([
        this.db.batch.count(),
        this.db.batch.count({ where: { isActive: true } }),
        this.db.student.count({ where: { isActive: true } }),
        this.db.batch.findMany({
          select: {
            capacity: true,
            students: { where: { isActive: true }, select: { id: true } },
          },
        }),
      ]);

      const nearFull = batches.filter((b) => {
        const capacity = b.capacity || 50;
        const currentSize = b.students.length;
        return currentSize / capacity >= 0.9;
      }).length;

      const totalCapacity = batches.reduce(
        (acc, b) => acc + (b.capacity || 50),
        0,
      );
      const capacityPercent =
        totalCapacity > 0
          ? Math.round((totalStudentsResult / totalCapacity) * 100)
          : 0;

      return {
        total,
        active,
        inactive: total - active,
        totalStudents: totalStudentsResult,
        nearFull,
        capacityPercent,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async toggleActive(input: string) {
    try {
      const validatedId = uuidSchema.parse(input);
      const batch = await this.db.batch.findUnique({
        where: { id: validatedId },
      });

      if (!batch) throw new Error("Batch not found");

      return await this.db.batch.update({
        where: { id: validatedId },
        data: { isActive: !batch.isActive },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]) {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.batch.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkToggleActive(ids: string[], isActive: boolean) {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.batch.updateMany({
        where: { id: { in: validatedIds } },
        data: { isActive },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async forSelection() {
    try {
      return await this.db.batch.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getByYearClassId(input: {
    academicYearId?: string;
    academicClassId?: string;
  }) {
    try {
      if (!input.academicClassId || !input.academicYearId) {
        return [];
      }

      return await this.db.batch.findMany({
        where: {
          academicYearId: input.academicYearId,
          academicClassId: input.academicClassId,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
