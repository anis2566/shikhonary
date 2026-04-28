import { z } from "zod";
import { type TenantClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import {
  admissionPaymentFormSchema,
  AdmissionPaymentFormValues,
} from "@workspace/schema";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  ListAdmissionPaymentInputType,
  UpdateAdmissionPaymentInputType,
  idSchema,
} from "../shared/input/admission-payment";

/**
 * Service for managing Admission Payments (Tenant Level)
 */
export class AdmissionPaymentService {
  constructor(private db: TenantClient) {}

  async list(input: ListAdmissionPaymentInputType) {
    try {
      const where: any = {};

      if (input.transactionSearch) {
        where.transactionId = {
          contains: input.transactionSearch,
          mode: "insensitive",
        };
      }

      if (input.studentSearch) {
        where.OR = [
          {
            student: {
              name: { contains: input.studentSearch, mode: "insensitive" },
            },
          },
          {
            student: {
              studentId: { contains: input.studentSearch, mode: "insensitive" },
            },
          },
        ];
      }

      if (input.studentId) where.studentId = input.studentId;
      if (input.academicYearId) where.academicYearId = input.academicYearId;
      if (input.status) where.status = input.status;
      if (input.paymentMethod) where.paymentMethod = input.paymentMethod;

      if (input.paymentDate) {
        const date = new Date(input.paymentDate);
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        
        where.paymentDate = {
          gte: start,
          lte: end,
        };
      }

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.admissionPayment.findMany({
          where,
          orderBy,
          ...pagination,
          include: {
            student: {
              select: {
                name: true,
                studentId: true,
              },
            },
            academicYear: {
              select: {
                name: true,
              },
            },
          },
        }),
        this.db.admissionPayment.count({ where }),
      ]);

      return {
        items,
        total,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string) {
    try {
      const validatedId = idSchema.parse(id);
      return await this.db.admissionPayment.findUnique({
        where: { id: validatedId },
        include: {
          student: true,
          academicYear: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: AdmissionPaymentFormValues) {
    try {
      const data = admissionPaymentFormSchema.parse(input);
      return await this.db.admissionPayment.create({
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(input: UpdateAdmissionPaymentInputType) {
    try {
      const { id, ...data } = input;
      return await this.db.admissionPayment.update({
        where: { id },
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string) {
    try {
      const validatedId = idSchema.parse(id);
      return await this.db.admissionPayment.delete({
        where: { id: validatedId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]) {
    try {
      const validatedIds = z.array(idSchema).parse(ids);
      return await this.db.admissionPayment.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
