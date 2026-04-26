import { type TenantClient, type PrismaClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import {
  admissionFeeFormSchema,
  uuidSchema,
  AdmissionFeeFormValues,
} from "@workspace/schema";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  idInputType,
  listInputType,
  updateAdmissionFeeInputType,
} from "../shared/input/admission-fee";

/**
 * Service for managing Admission Fees (Tenant Level)
 */
export class AdmissionFeeService {
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

      // Normalize combined sort tokens from frontend
      if (sortBy === "amount-desc") {
        finalSortBy = "amount";
        finalSortOrder = "desc";
      } else if (sortBy === "amount-asc") {
        finalSortBy = "amount";
        finalSortOrder = "asc";
      } else if (sortBy === "newest") {
        finalSortBy = "createdAt";
        finalSortOrder = "desc";
      } else if (sortBy === "oldest") {
        finalSortBy = "createdAt";
        finalSortOrder = "asc";
      }

      const where = buildWhere(rest, ["academicYear.name", "className"]);
      if (input.academicYearId) where.academicYearId = input.academicYearId;
      if (input.academicClassId) where.academicClassId = input.academicClassId;

      const orderBy = buildOrderBy({
        ...rest,
        sortBy: finalSortBy || undefined,
        sortOrder: (finalSortOrder as "asc" | "desc") || undefined,
      });
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.admissionFee.findMany({
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
        this.db.admissionFee.count({ where }),
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
      return await this.db.admissionFee.findUnique({
        where: { id: validatedId },
        include: {
          academicYear: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: AdmissionFeeFormValues) {
    try {
      const data = admissionFeeFormSchema.parse(input);
      const academicClass = await this.mainDb.academicClass.findUnique({
        where: { id: data.academicClassId },
      });
      if (!academicClass) {
        throw new Error("Academic class not found");
      }
      const existingAdmissionFee = await this.db.admissionFee.findFirst({
        where: {
          academicYearId: data.academicYearId,
          academicClassId: data.academicClassId,
        },
      });
      if (existingAdmissionFee) {
        throw new Error("Admission fee already exists");
      }
      return await this.db.admissionFee.create({
        data: {
          ...data,
          className: academicClass.displayName,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(input: updateAdmissionFeeInputType) {
    try {
      const { id, ...data } = input;
      const academicClass = await this.mainDb.academicClass.findUnique({
        where: { id: data.academicClassId },
      });
      if (!academicClass) {
        throw new Error("Academic class not found");
      }
      return await this.db.admissionFee.update({
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
      return await this.db.admissionFee.delete({ where: { id: validatedId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getByYearClassId(input: {
    academicYearId?: string;
    academicClassId?: string;
  }) {
    try {
      if (!input.academicYearId || !input.academicClassId) {
        return 0;
      }
      const fee = await this.db.admissionFee.findFirst({
        where: {
          academicYearId: input.academicYearId,
          academicClassId: input.academicClassId,
        },
      });
      if (!fee) {
        return 0;
      }
      return fee.amount;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
