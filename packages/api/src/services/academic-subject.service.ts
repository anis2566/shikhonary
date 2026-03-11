import { z } from "zod";
import {
  type PrismaClient,
  type AcademicSubject,
  type AcademicClass,
  type AcademicChapter,
  type AcademicTopic,
  type AcademicClassSubject,
} from "@workspace/db";
import {
  academicSubjectFormSchema,
  updateAcademicSubjectSchema,
  AcademicSubjectFormValues,
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

export interface SubjectWithRelations extends AcademicSubject {
  class?: AcademicClass | null; // For backward compatibility
  classSubjects?: (AcademicClassSubject & {
    academicClass: AcademicClass;
  })[];
  chapters?: (AcademicChapter & {
    _count?: {
      topics: number;
      mcqs: number;
      cqs: number;
    };
  })[];
  _count?: {
    chapters: number;
    mcqs: number;
    cqs?: number;
  };
}

export interface SubjectDetailedStats {
  stats: {
    overview: {
      totalChapters: number;
      activeChapters: number;
      totalTopics: number;
      totalSubTopics: number;
      totalMcqs: number;
      totalCqs: number;
      totalQuestions: number;
      completionRate: number;
    };
  };
}

export interface SubjectStatisticsData {
  contentDistribution: {
    id: string;
    name: string;
    topics: number;
    percentage: number;
  }[];
  questionBank: {
    mcqs: number;
    cqs: number;
    total: number;
  };
  hierarchy: {
    chapters: number;
    topics: number;
    subTopics: number;
    questions: number;
  };
}

export interface RecentChapterResponse {
  id: string;
  displayName: string;
  isActive: boolean;
  _count: {
    topics: number;
    mcqs: number;
    cqs: number;
  };
  updatedAt: Date;
}

export interface SubjectRecentTopicResponse {
  id: string;
  name: string;
  chapterName: string;
  subjectName: string;
  updatedAt: Date;
}

const reorderItemsSchema = z.array(
  z.object({
    id: uuidSchema,
    position: z.number().int().min(0),
  }),
);

export class AcademicSubjectService {
  constructor(private db: PrismaClient) {}

  async list(input: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
    classId?: string;
    sort?: string;
  }): Promise<PaginatedResponse<SubjectWithRelations> | undefined> {
    try {
      const where = buildWhere(input);
      if (input.classId) {
        where.classSubjects = {
          some: { classId: input.classId },
        };
      }

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.academicSubject.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { position: "asc" },
          ...pagination,
          include: {
            classSubjects: {
              include: {
                academicClass: true,
              },
            },
            _count: {
              select: { chapters: true, mcqs: true, cqs: true },
            },
          },
        }),
        this.db.academicSubject.count({ where }),
      ]);

      const mappedItems = items.map((item) => ({
        ...item,
        class: item.classSubjects?.[0]?.academicClass || null,
      }));

      return createPaginatedResponse(
        mappedItems as SubjectWithRelations[],
        total,
        input.page,
        input.limit,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string): Promise<SubjectWithRelations | null | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const item = await this.db.academicSubject.findUnique({
        where: { id: validatedId },
        include: {
          classSubjects: {
            include: {
              academicClass: true,
            },
          },
          chapters: {
            orderBy: { position: "asc" },
            include: {
              _count: {
                select: {
                  topics: true,
                  mcqs: true,
                  cqs: true,
                },
              },
            },
          },
          _count: {
            select: {
              chapters: true,
              mcqs: true,
              cqs: true,
            },
          },
        },
      });

      if (!item) return null;

      return {
        ...item,
        class: item.classSubjects?.[0]?.academicClass || null,
      } as SubjectWithRelations;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(
    input: AcademicSubjectFormValues,
  ): Promise<AcademicSubject | undefined> {
    try {
      const data = academicSubjectFormSchema.parse(input);

      const { classIds, ...subjectData } = data;

      return await this.db.academicSubject.create({
        data: {
          ...subjectData,
          classSubjects: {
            create: classIds.map((cid) => ({
              classId: cid,
              position: subjectData.position || 0,
            })),
          },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(
    id: string,
    input: Partial<AcademicSubjectFormValues>,
  ): Promise<AcademicSubject | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const data = updateAcademicSubjectSchema.parse(input);

      const { classIds, ...subjectData } = data;

      return await this.db.$transaction(async (tx) => {
        if (classIds) {
          // Delete old relations
          await tx.academicClassSubject.deleteMany({
            where: { subjectId: validatedId },
          });

          // Create new relations
          if (classIds.length > 0) {
            await tx.academicClassSubject.createMany({
              data: classIds.map((cid) => ({
                classId: cid,
                subjectId: validatedId,
                position: subjectData.position || 0,
              })),
            });
          }
        }

        return await tx.academicSubject.update({
          where: { id: validatedId },
          data: subjectData as any,
        });
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<AcademicSubject | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      return await this.db.academicSubject.delete({
        where: { id: validatedId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async reorder(
    items: { id: string; position: number }[],
  ): Promise<AcademicSubject[] | undefined> {
    try {
      const validatedItems = reorderItemsSchema.parse(items);
      return await this.db.$transaction(
        validatedItems.map((item) =>
          this.db.academicSubject.update({
            where: { id: item.id },
            data: { position: item.position },
          }),
        ),
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats(classId?: string): Promise<
    | {
        totalSubject: number;
        activeSubject: number;
        inactiveSubject: number;
        totalChapters: number;
      }
    | undefined
  > {
    try {
      const where: any = {};
      if (classId) {
        where.classSubjects = {
          some: { classId },
        };
      }

      const [total, active, totalChapters] = await Promise.all([
        this.db.academicSubject.count({ where }),
        this.db.academicSubject.count({ where: { ...where, isActive: true } }),
        this.db.academicChapter.count({
          where: {
            subject: classId
              ? {
                  classSubjects: {
                    some: { classId },
                  },
                }
              : {},
          },
        }),
      ]);
      return {
        totalSubject: total,
        activeSubject: active,
        inactiveSubject: total - active,
        totalChapters,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkActive(ids: string[]): Promise<{ count: number } | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.academicSubject.updateMany({
        where: { id: { in: validatedIds } },
        data: { isActive: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDeactive(ids: string[]): Promise<{ count: number } | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.academicSubject.updateMany({
        where: { id: { in: validatedIds } },
        data: { isActive: false },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]): Promise<{ count: number } | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.academicSubject.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getDetailedStats(
    id: string,
  ): Promise<SubjectDetailedStats | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const [
        chapterCount,
        activeChapterCount,
        topicCount,
        subTopicCount,
        mcqCount,
        cqCount,
      ] = await Promise.all([
        this.db.academicChapter.count({ where: { subjectId: validatedId } }),
        this.db.academicChapter.count({
          where: { subjectId: validatedId, isActive: true },
        }),
        this.db.academicTopic.count({
          where: { chapter: { subjectId: validatedId } },
        }),
        this.db.academicSubTopic.count({
          where: { topic: { chapter: { subjectId: validatedId } } },
        }),
        this.db.mcq.count({ where: { subjectId: validatedId } }),
        this.db.cq.count({ where: { subjectId: validatedId } }),
      ]);

      return {
        stats: {
          overview: {
            totalChapters: chapterCount,
            activeChapters: activeChapterCount,
            totalTopics: topicCount,
            totalSubTopics: subTopicCount,
            totalMcqs: mcqCount,
            totalCqs: cqCount,
            totalQuestions: mcqCount + cqCount,
            completionRate:
              topicCount > 0
                ? Math.min(Math.round((topicCount / 20) * 100), 100)
                : 0,
          },
        },
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStatisticsData(
    id: string,
  ): Promise<SubjectStatisticsData | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const [chapters, topicCount, subTopicCount, mcqCount, cqCount] =
        await Promise.all([
          this.db.academicChapter.findMany({
            where: { subjectId: validatedId },
            select: {
              id: true,
              displayName: true,
              _count: {
                select: {
                  topics: true,
                },
              },
            },
            orderBy: { position: "asc" },
          }),
          this.db.academicTopic.count({
            where: { chapter: { subjectId: validatedId } },
          }),
          this.db.academicSubTopic.count({
            where: { topic: { chapter: { subjectId: validatedId } } },
          }),
          this.db.mcq.count({ where: { subjectId: validatedId } }),
          this.db.cq.count({ where: { subjectId: validatedId } }),
        ]);

      const totalTopics = chapters.reduce(
        (acc, curr) => acc + curr._count.topics,
        0,
      );

      return {
        contentDistribution: chapters.map((c) => ({
          id: c.id,
          name: c.displayName,
          topics: c._count.topics,
          percentage:
            totalTopics > 0 ? (c._count.topics / totalTopics) * 100 : 0,
        })),
        questionBank: {
          mcqs: mcqCount,
          cqs: cqCount,
          total: mcqCount + cqCount,
        },
        hierarchy: {
          chapters: chapters.length,
          topics: topicCount,
          subTopics: subTopicCount,
          questions: mcqCount + cqCount,
        },
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getRecentChapters(input: {
    subjectId: string;
    limit: number;
  }): Promise<RecentChapterResponse[] | undefined> {
    try {
      const validatedSubjectId = uuidSchema.parse(input.subjectId);
      const chapters = await this.db.academicChapter.findMany({
        where: { subjectId: validatedSubjectId },
        orderBy: { updatedAt: "desc" },
        take: input.limit,
        include: {
          _count: {
            select: {
              topics: true,
              mcqs: true,
              cqs: true,
            },
          },
        },
      });

      return chapters.map((c) => ({
        id: c.id,
        displayName: c.displayName,
        isActive: c.isActive,
        _count: c._count,
        updatedAt: c.updatedAt,
      }));
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getRecentTopics(input: {
    subjectId: string;
    limit: number;
  }): Promise<SubjectRecentTopicResponse[] | undefined> {
    try {
      const validatedSubjectId = uuidSchema.parse(input.subjectId);
      const topics = await this.db.academicTopic.findMany({
        where: {
          chapter: {
            subjectId: validatedSubjectId,
          },
        },
        orderBy: { updatedAt: "desc" },
        take: input.limit,
        include: {
          chapter: {
            include: {
              subject: true,
            },
          },
        },
      });

      return topics.map((t) => ({
        id: t.id,
        name: t.displayName,
        chapterName: t.chapter.displayName,
        subjectName: t.chapter.subject.displayName,
        updatedAt: t.updatedAt,
      }));
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async forSelection(
    classId?: string,
  ): Promise<{ id: string; displayName: string }[] | undefined> {
    try {
      const where: any = { isActive: true }; // prisma "where" is hard to type precisely without internal types
      if (classId && classId !== "all") {
        where.classSubjects = {
          some: { classId },
        };
      }

      return await this.db.academicSubject.findMany({
        where,
        select: {
          id: true,
          displayName: true,
        },
        orderBy: { position: "asc" },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
