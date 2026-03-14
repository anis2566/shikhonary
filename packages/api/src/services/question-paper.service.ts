import { type PrismaClient } from "@workspace/db";
import {
  questionPaperFormSchema,
  updateQuestionPaperSchema,
  assignMcqSchema,
  reorderQuestionsSchema,
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

// ─── Internal input types ─────────────────────────────────────────────────────

interface DistributionInput {
  questionTypeId: string;
  marksPerQuestion: number;
  questionCount: number;
  questionsToAttempt?: number | null;
  orderIndex?: number;
}

interface SubjectBreakdownInput {
  subjectId: string;
  distributions: DistributionInput[];
}

// ─────────────────────────────────────────────────────────────────────────────

export class QuestionPaperService {
  constructor(private masterDb: PrismaClient) {}

  // ─────────────────────────────────────────────────────────────── LIST ────

  async list(input: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    sort?: string;
    status?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<any> | undefined> {
    try {
      const where = buildWhere(input, ["title", "examName", "description"]);
      if (input.status) where.status = input.status;
      where.isActive = true;
      where.deletedAt = null;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const stableOrderBy = Array.isArray(orderBy)
        ? [...orderBy, { id: "asc" as const }]
        : [orderBy, { id: "asc" as const }];

      const [items, total] = await Promise.all([
        (this.masterDb as any).questionPaper.findMany({
          where,
          orderBy: stableOrderBy,
          ...pagination,
          include: {
            _count: { select: { questions: true } },
            academicClass: { select: { name: true, displayName: true } },
            subjects: {
              include: {
                subject: { select: { name: true, displayName: true } },
                distributions: {
                  include: {
                    questionType: {
                      select: { name: true, displayName: true, label: true },
                    },
                  },
                },
              },
            },
          },
        }),
        (this.masterDb as any).questionPaper.count({ where }),
      ]);

      return createPaginatedResponse(items, total, input.page, input.limit);
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ──────────────────────────────────────────────────────────── GET BY ID ──

  async getById(id: string): Promise<any | null | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return await (this.masterDb as any).questionPaper.findUnique({
        where: { id: validatedId },
        include: {
          academicClass: true,
          subjects: {
            include: {
              subject: true,
              distributions: {
                include: {
                  questionType: true,
                },
                orderBy: { orderIndex: "asc" as const },
              },
            },
          },
          questions: {
            orderBy: { orderIndex: "asc" as const },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Returns the paper with MCQ data fully resolved.
   */
  async getByIdWithMcqs(id: string): Promise<any | null | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return await (this.masterDb as any).questionPaper.findUnique({
        where: { id: validatedId },
        include: {
          academicClass: true,
          subjects: {
            include: {
              subject: true,
              distributions: {
                include: {
                  questionType: true,
                },
                orderBy: { orderIndex: "asc" as const },
              },
            },
          },
          questions: {
            orderBy: { orderIndex: "asc" as const },
            include: {
              mcq: {
                include: {
                  subject: true,
                  chapter: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ──────────────────────────────────────────────────────────────── CREATE ──

  /**
   * Creates a question paper together with its subject rows and, optionally,
   * the full mark-distribution breakdown for each subject.
   *
   * The `subjectBreakdowns` field is not part of the Zod schema (it lives in
   * the form payload but not in the DB schema directly), so we extract it
   * before passing the rest to `questionPaperFormSchema`.
   */
  async create(input: unknown): Promise<any | undefined> {
    try {
      // Pull out breakdowns before schema validation so Zod doesn't reject the
      // extra key, then validate the core paper fields.
      const { subjectBreakdowns, ...rawPaperData } = input as {
        subjectBreakdowns?: SubjectBreakdownInput[];
        [key: string]: unknown;
      };

      const { subjectIds, ...paperData } =
        questionPaperFormSchema.parse(rawPaperData);

      // Build the subject-level total for each subject, derived from its
      // distribution rows (marksPerQuestion × questionsToAttempt ?? questionCount).
      const subjectCreateData = subjectIds.map((sid) => {
        const breakdown = subjectBreakdowns?.find((b) => b.subjectId === sid);
        const distributions = breakdown?.distributions ?? [];

        const subjectTotal = distributions.reduce((sum, d) => {
          const effective =
            d.questionsToAttempt !== null && d.questionsToAttempt !== undefined
              ? d.questionsToAttempt
              : d.questionCount;
          return sum + d.marksPerQuestion * effective;
        }, 0);

        return {
          subjectId: sid,
          subjectTotal,
          distributions: {
            create: distributions.map((d, idx) => ({
              questionTypeId: d.questionTypeId,
              marksPerQuestion: d.marksPerQuestion,
              questionCount: d.questionCount,
              totalMarks:
                d.marksPerQuestion * (d.questionsToAttempt ?? d.questionCount),
              questionsToAttempt: d.questionsToAttempt ?? null,
              orderIndex: d.orderIndex ?? idx,
            })),
          },
        };
      });

      // Derive the paper-level grand total from all subjects
      const grandTotal = subjectCreateData.reduce(
        (s, sub) => s + sub.subjectTotal,
        0,
      );

      return await (this.masterDb as any).questionPaper.create({
        data: {
          ...paperData,
          // Override total with the computed value when distributions are
          // provided; fall back to whatever the user typed in the form field.
          total: grandTotal > 0 ? grandTotal : (paperData.total ?? 0),
          subjects: {
            create: subjectCreateData,
          },
        },
        include: {
          subjects: {
            include: {
              subject: { select: { name: true, displayName: true } },
              distributions: {
                include: {
                  questionType: {
                    select: { name: true, displayName: true, label: true },
                  },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ──────────────────────────────────────────────────────────────── UPDATE ──

  /**
   * Updates paper metadata and optionally replaces the subject list/distributions.
   */
  async update(id: string, input: any): Promise<any | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const { subjectIds, subjectBreakdowns, ...paperData } = input;

      return await (this.masterDb as any).$transaction(async (tx: any) => {
        let grandTotal = 0;

        // 1. Handle subjects and distributions if provided
        if (subjectIds) {
          // Build the subject-level total for each subject
          const subjectCreateData = subjectIds.map((sid: string) => {
            const breakdown = subjectBreakdowns?.find(
              (b: any) => b.subjectId === sid,
            );
            const distributions = breakdown?.distributions ?? [];

            const subjectTotal = distributions.reduce((sum: number, d: any) => {
              const effective =
                d.questionsToAttempt !== null &&
                d.questionsToAttempt !== undefined
                  ? d.questionsToAttempt
                  : d.questionCount;
              return sum + d.marksPerQuestion * effective;
            }, 0);

            grandTotal += subjectTotal;

            return {
              subjectId: sid,
              subjectTotal,
              distributions: {
                create: distributions.map((d: any, idx: number) => ({
                  questionTypeId: d.questionTypeId,
                  marksPerQuestion: d.marksPerQuestion,
                  questionCount: d.questionCount,
                  totalMarks:
                    d.marksPerQuestion *
                    (d.questionsToAttempt ?? d.questionCount),
                  questionsToAttempt: d.questionsToAttempt ?? null,
                  orderIndex: d.orderIndex ?? idx,
                })),
              },
            };
          });

          // Wipe existing subjects
          await tx.questionPaperSubject.deleteMany({
            where: { questionPaperId: validatedId },
          });

          // Re-create subjects with distributions
          await tx.questionPaper.update({
            where: { id: validatedId },
            data: {
              ...paperData,
              total: grandTotal > 0 ? grandTotal : (paperData.total ?? 0),
              subjects: {
                create: subjectCreateData,
              },
            },
          });
        } else {
          // Just update metadata
          await tx.questionPaper.update({
            where: { id: validatedId },
            data: paperData,
          });
        }

        return await tx.questionPaper.findUnique({
          where: { id: validatedId },
          include: {
            subjects: {
              include: {
                subject: true,
                distributions: true,
              },
            },
          },
        });
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ─────────────────────────────────────── PERSIST BUILDER SETTINGS (JSON) ─

  async updateSettings(
    questionPaperId: string,
    settings: Record<string, unknown>,
  ): Promise<any | undefined> {
    try {
      const validatedId = uuidSchema.parse(questionPaperId);
      return await (this.masterDb as any).questionPaper.update({
        where: { id: validatedId },
        data: { settings },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ──────────────────────────────────────────────────────────────── DELETE ──

  async delete(id: string): Promise<any | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return await (this.masterDb as any).questionPaper.update({
        where: { id: validatedId },
        data: { deletedAt: new Date(), isActive: false },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ────────────────────────────────────────────────────── ASSIGN / REMOVE ──

  async assignMcq(input: unknown): Promise<any | undefined> {
    try {
      const { questionPaperId, mcqId, orderIndex } =
        assignMcqSchema.parse(input);

      let resolvedIndex = orderIndex;
      if (resolvedIndex === undefined || resolvedIndex === null) {
        const count = await (this.masterDb as any).questionPaperQuestion.count({
          where: { questionPaperId },
        });
        resolvedIndex = count;
      }

      return await (this.masterDb as any).questionPaperQuestion.upsert({
        where: { questionPaperId_mcqId: { questionPaperId, mcqId } },
        create: { questionPaperId, mcqId, orderIndex: resolvedIndex },
        update: { orderIndex: resolvedIndex },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkAssignMcqs(input: {
    questionPaperId: string;
    mcqIds: string[];
    distributionId: string;
  }): Promise<any | undefined> {
    try {
      const { questionPaperId, mcqIds, distributionId } = input;
      const validatedPaperId = uuidSchema.parse(questionPaperId);

      const count = await (this.masterDb as any).questionPaperQuestion.count({
        where: { questionPaperId: validatedPaperId },
      });

      return await (this.masterDb as any).$transaction(
        mcqIds.map((mcqId, idx) =>
          (this.masterDb as any).questionPaperQuestion.upsert({
            where: {
              questionPaperId_mcqId: {
                questionPaperId: validatedPaperId,
                mcqId,
              },
            },
            create: {
              questionPaperId: validatedPaperId,
              mcqId,
              distributionId,
              orderIndex: count + idx,
            },
            update: { orderIndex: count + idx },
          }),
        ),
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async removeMcq(questionPaperQuestionId: string): Promise<any | undefined> {
    try {
      const validatedId = uuidSchema.parse(questionPaperQuestionId);
      return await (this.masterDb as any).questionPaperQuestion.delete({
        where: { id: validatedId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkRemoveMcqs(ids: string[]): Promise<any | undefined> {
    try {
      const validatedIds = ids.map((id) => uuidSchema.parse(id));
      return await (this.masterDb as any).questionPaperQuestion.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ──────────────────────────────────────────────────────────────── REORDER ─

  async reorderQuestions(
    questionPaperId: string,
    items: { id: string; orderIndex: number }[],
  ): Promise<void> {
    try {
      const validatedPaperId = uuidSchema.parse(questionPaperId);
      const parsed = reorderQuestionsSchema.parse({
        questionPaperId: validatedPaperId,
        items,
      });

      await (this.masterDb as any).$transaction(
        parsed.items.map((item: { id: string; orderIndex: number }) =>
          (this.masterDb as any).questionPaperQuestion.update({
            where: { id: item.id },
            data: { orderIndex: item.orderIndex },
          }),
        ),
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ───────────────────────────────────────────────────────────── OVERRIDES ─

  async updateQuestionOverrides(
    id: string,
    overrides: Record<string, unknown>,
  ): Promise<any | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return await (this.masterDb as any).questionPaperQuestion.update({
        where: { id: validatedId },
        data: { overrides },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ────────────────────────────────────────────────── MARK DISTRIBUTION ──

  /**
   * Fully replaces the mark-distribution rows for a single (paper × subject)
   * record, then re-derives and persists the subject-level total and the
   * paper-level grand total.
   *
   * All writes are wrapped in a single transaction so the DB is never left in
   * a partially-updated state.
   */
  async updateMarkDistribution(
    paperSubjectId: string,
    items: DistributionInput[],
  ): Promise<void> {
    try {
      const validatedId = uuidSchema.parse(paperSubjectId);

      // Compute the new subject-level total from the incoming rows
      const newSubjectTotal = items.reduce((sum, d) => {
        const effective =
          d.questionsToAttempt !== null && d.questionsToAttempt !== undefined
            ? d.questionsToAttempt
            : d.questionCount;
        return sum + d.marksPerQuestion * effective;
      }, 0);

      await (this.masterDb as any).$transaction(async (tx: any) => {
        // 1. Wipe existing distribution rows for this subject
        await tx.questionPaperSubjectMarkDistribution.deleteMany({
          where: { paperSubjectId: validatedId },
        });

        // 2. Re-create with the new rows
        await tx.questionPaperSubjectMarkDistribution.createMany({
          data: items.map((d, idx) => ({
            paperSubjectId: validatedId,
            questionTypeId: d.questionTypeId,
            marksPerQuestion: d.marksPerQuestion,
            questionCount: d.questionCount,
            totalMarks:
              d.marksPerQuestion * (d.questionsToAttempt ?? d.questionCount),
            questionsToAttempt: d.questionsToAttempt ?? null,
            orderIndex: d.orderIndex ?? idx,
          })),
        });

        // 3. Update the denormalised subject-level total
        await tx.questionPaperSubject.update({
          where: { id: validatedId },
          data: { subjectTotal: newSubjectTotal },
        });

        // 4. Re-aggregate and update the paper-level grand total
        const paperSubject = await tx.questionPaperSubject.findUnique({
          where: { id: validatedId },
          select: { questionPaperId: true },
        });

        if (paperSubject) {
          const allSubjects = await tx.questionPaperSubject.findMany({
            where: { questionPaperId: paperSubject.questionPaperId },
            select: { subjectTotal: true },
          });

          const grandTotal = allSubjects.reduce(
            (s: number, sub: { subjectTotal: number }) => s + sub.subjectTotal,
            0,
          );

          await tx.questionPaper.update({
            where: { id: paperSubject.questionPaperId },
            data: { total: grandTotal },
          });
        }
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  // ─────────────────────────────────────── GET MARK DISTRIBUTION (by paper) ─

  /**
   * Convenience method: returns all subject distributions for a paper,
   * grouped by subject, in the order defined by `orderIndex`.
   */
  async getMarkDistributions(paperId: string): Promise<any[] | undefined> {
    try {
      const validatedId = uuidSchema.parse(paperId);
      return await (this.masterDb as any).questionPaperSubject.findMany({
        where: { questionPaperId: validatedId },
        include: {
          subject: { select: { name: true, displayName: true } },
          distributions: {
            include: {
              questionType: {
                select: { name: true, displayName: true, label: true },
              },
            },
            orderBy: { orderIndex: "asc" as const },
          },
        },
        orderBy: { id: "asc" as const },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
