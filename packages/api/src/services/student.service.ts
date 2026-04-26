import { z } from "zod";
import { type TenantClient, type PrismaClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import {
  studentFormSchema,
  uuidSchema,
  StudentFormValues,
} from "@workspace/schema";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  idInputType,
  listInputType,
  updateStudentInputType,
} from "../shared/input/student";

/**
 * Service for managing Students (Tenant Level)
 */
export class StudentService {
  /**
   * Note: This service expects a Tenant-specific Prisma Client
   */
  constructor(
    private db: TenantClient,
    private mainDb: PrismaClient,
  ) {}

  async list(input: listInputType) {
    try {
      const where = buildWhere(input, [
        "name",
        "studentId",
        "email",
        "primaryPhone",
      ]);
      if (input.batchId) where.batchId = input.batchId;
      if (input.academicClassId) where.academicClassId = input.academicClassId;
      if (input.academicYearId) where.academicYearId = input.academicYearId;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.student.findMany({
          where,
          orderBy,
          ...pagination,
          include: {
            batch: {
              select: {
                name: true,
              },
            },
            academicYear: {
              select: {
                name: true,
              },
            },
          },
        }),
        this.db.student.count({ where }),
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
      return await this.db.student.findUnique({
        where: { id: validatedId },
        include: {
          batch: true,
          academicYear: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getDetails(input: idInputType) {
    try {
      const validatedId = uuidSchema.parse(input);

      const student = await this.db.student.findUnique({
        where: { id: validatedId },
        include: {
          batch: true,
          academicYear: true,
          // attendance: {
          //   take: 10,
          //   orderBy: { date: "desc" },
          // },
        },
      });

      if (!student) return null;

      // Add some basic stats for student
      // const [totalAttendance, presentCount] = await Promise.all([
      //   this.db.attendance.count({ where: { studentId: validatedId } }),
      //   this.db.attendance.count({ where: { studentId: validatedId, status: "PRESENT" } }),
      // ]);

      // const attendancePercentage = totalAttendance > 0
      //   ? Math.round((presentCount / totalAttendance) * 100)
      //   : 0;

      return {
        ...student,
        stats: {
          // totalAttendance,
          // presentCount,
          // attendancePercentage,
        },
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: StudentFormValues) {
    try {
      const data = studentFormSchema.parse(input);
      const className = await this.mainDb.academicClass.findUnique({
        where: { id: data.academicClassId },
      });

      return await this.db.student.create({
        data: {
          ...data,
          className: className?.name ?? "",
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(input: updateStudentInputType) {
    try {
      const { id, ...data } = input;
      const className = await this.mainDb.academicClass.findUnique({
        where: { id: data.academicClassId },
      });
      return await this.db.student.update({
        where: { id },
        data: {
          ...data,
          className: className?.name ?? "",
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(input: idInputType) {
    try {
      const validatedId = uuidSchema.parse(input);
      return await this.db.student.delete({ where: { id: validatedId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats() {
    try {
      const [total, active, male, female] = await Promise.all([
        this.db.student.count(),
        this.db.student.count({ where: { isActive: true } }),
        this.db.student.count({ where: { gender: "MALE" } }),
        this.db.student.count({ where: { gender: "FEMALE" } }),
      ]);

      return {
        total,
        active,
        inactive: total - active,
        male,
        female,
        other: total - (male + female),
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async toggleActive(input: string) {
    try {
      const validatedId = uuidSchema.parse(input);
      const student = await this.db.student.findUnique({
        where: { id: validatedId },
      });

      if (!student) throw new Error("Student not found");

      return await this.db.student.update({
        where: { id: validatedId },
        data: { isActive: !student.isActive },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]) {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.student.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkToggleActive(ids: string[], isActive: boolean) {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.student.updateMany({
        where: { id: { in: validatedIds } },
        data: { isActive },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkImport(students: any[]) {
    try {
      // In a real scenario, we might want to do more validation here
      return await this.db.student.createMany({
        data: students,
        skipDuplicates: true,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
