import { z } from "zod";
import {
  type AcademicClass,
  type AcademicSubject,
  type PrismaClient,
  type AcademicTopic,
  type AcademicClassSubject,
} from "@workspace/db";
import {
  academicClassFormSchema,
  updateAcademicClassSchema,
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

export interface ClassWithRelations extends AcademicClass {
  subjects?: (AcademicSubject & {
    _count: {
      chapters: number;
      mcqs: number;
      cqs: number;
    };
  })[];
  classSubjects?: (AcademicClassSubject & {
    academicSubject: AcademicSubject & {
      _count: {
        chapters: number;
        mcqs: number;
        cqs: number;
      };
    };
  })[];
  _count?: {
    classSubjects: number;
    subjects?: number; // for backward compatibility
  };
}

export interface ClassDetailedStats {
  stats: {
    overview: {
      totalSubjects: number;
      totalChapters: number;
      totalTopics: number;
      totalSubTopics: number;
      totalMcqs: number;
      totalCqs: number;
    };
  };
}

export interface ClassStatisticsData {
  contentDistribution: {
    id: string;
    name: string;
    chapters: number;
    percentage: number;
  }[];
  questionBank: {
    mcqs: number;
    cqs: number;
    total: number;
  };
  hierarchy: {
    subjects: number;
    chapters: number;
    topics: number;
    subTopics: number;
    questions: number;
  };
}

export interface ClassRecentTopicResponse {
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

/**
 * Service for managing Academic Classes
 */
export class AcademicClassService {
  constructor(private db: PrismaClient) {}

  async list(input: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
    level?: string;
    sort?: string;
  }): Promise<PaginatedResponse<ClassWithRelations> | undefined> {
    try {
      const where = buildWhere(input);
      if (input.level) where.level = input.level;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.academicClass.findMany({
          where,
          orderBy: input.sortBy ? orderBy : { position: "asc" },
          ...pagination,
          include: {
            classSubjects: {
              include: {
                academicSubject: {
                  include: {
                    _count: {
                      select: { chapters: true, mcqs: true, cqs: true },
                    },
                  },
                },
              },
            },
            _count: {
              select: { classSubjects: true },
            },
          },
        }),
        this.db.academicClass.count({ where }),
      ]);

      const mappedItems = items.map((item) => ({
        ...item,
        subjects: item.classSubjects?.map((cs) => cs.academicSubject) || [],
        _count: {
          ...item._count,
          subjects: item._count.classSubjects,
        },
      }));

      return createPaginatedResponse(
        mappedItems as ClassWithRelations[],
        total,
        input.page,
        input.limit,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string): Promise<ClassWithRelations | null | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const item = await this.db.academicClass.findUnique({
        where: { id: validatedId },
        include: {
          classSubjects: {
            orderBy: { position: "asc" },
            include: {
              academicSubject: {
                include: {
                  _count: {
                    select: {
                      chapters: true,
                      mcqs: true,
                      cqs: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!item) return null;

      // Map classSubjects to subjects for backward compatibility
      return {
        ...item,
        subjects: item.classSubjects.map((cs) => cs.academicSubject),
      } as ClassWithRelations;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(
    input: z.infer<typeof academicClassFormSchema>,
  ): Promise<AcademicClass | undefined> {
    try {
      const data = academicClassFormSchema.parse(input);

      if (data.position === undefined) {
        const count = await this.db.academicClass.count();
        data.position = count;
      }
      const item = await this.db.academicClass.create({
        data: {
          ...data,
          level: data.level,
        },
      });
      return item;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(
    id: string,
    input: z.infer<typeof updateAcademicClassSchema>,
  ): Promise<AcademicClass | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const data = updateAcademicClassSchema.parse(input);

      const item = await this.db.academicClass.update({
        where: { id: validatedId },
        data: {
          ...data,
          level: data.level,
        },
      });
      return item;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<AcademicClass | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const item = await this.db.academicClass.delete({
        where: { id: validatedId },
      });
      return item;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async reorder(
    items: { id: string; position: number }[],
  ): Promise<AcademicClass[] | undefined> {
    try {
      const validatedItems = reorderItemsSchema.parse(items);
      return await this.db.$transaction(
        validatedItems.map((item) =>
          this.db.academicClass.update({
            where: { id: item.id },
            data: { position: item.position },
          }),
        ),
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkActive(ids: string[]): Promise<{ count: number } | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.academicClass.updateMany({
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
      return await this.db.academicClass.updateMany({
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
      return await this.db.academicClass.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats(): Promise<
    | { total: number; active: number; inactive: number; totalSubject: number }
    | undefined
  > {
    console.log(
      "[AcademicClassService] getStats called. DB instance keys:",
      Object.keys(this.db).filter((k) => !k.startsWith("_")),
    );
    try {
      const [total, active, totalSubject] = await Promise.all([
        this.db.academicClass.count(),
        this.db.academicClass.count({ where: { isActive: true } }),
        this.db.academicSubject.count(),
      ]);
      return { total, active, inactive: total - active, totalSubject };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Get detailed statistics for a specific class
   */
  async getDetailedStats(id: string): Promise<ClassDetailedStats | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const [
        subjectCount,
        chapterCount,
        topicCount,
        subTopicCount,
        mcqCount,
        cqCount,
      ] = await Promise.all([
        this.db.academicSubject.count({
          where: {
            classSubjects: { some: { classId: validatedId } },
          },
        }),
        this.db.academicChapter.count({
          where: {
            subject: {
              classSubjects: { some: { classId: validatedId } },
            },
          },
        }),
        this.db.academicTopic.count({
          where: {
            chapter: {
              subject: {
                classSubjects: { some: { classId: validatedId } },
              },
            },
          },
        }),
        this.db.academicSubTopic.count({
          where: {
            topic: {
              chapter: {
                subject: {
                  classSubjects: { some: { classId: validatedId } },
                },
              },
            },
          },
        }),
        this.db.mcq.count({
          where: {
            subject: {
              classSubjects: { some: { classId: validatedId } },
            },
          },
        }),
        this.db.cq.count({
          where: {
            subject: {
              classSubjects: { some: { classId: validatedId } },
            },
          },
        }),
      ]);

      return {
        stats: {
          overview: {
            totalSubjects: subjectCount,
            totalChapters: chapterCount,
            totalTopics: topicCount,
            totalSubTopics: subTopicCount,
            totalMcqs: mcqCount,
            totalCqs: cqCount,
          },
        },
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Get statistics data for charts (e.g., chapters per subject)
   */
  async getStatisticsData(
    id: string,
  ): Promise<ClassStatisticsData | undefined> {
    try {
      const validatedId = uuidSchema.parse(id);
      const [
        subjectsData,
        chapterCount,
        topicCount,
        subTopicCount,
        mcqCount,
        cqCount,
      ] = await Promise.all([
        this.db.academicSubject.findMany({
          where: {
            classSubjects: { some: { classId: validatedId } },
          },
          select: {
            id: true,
            displayName: true,
            _count: {
              select: {
                chapters: true,
              },
            },
          },
          orderBy: { position: "asc" },
        }),
        this.db.academicChapter.count({
          where: {
            subject: {
              classSubjects: { some: { classId: validatedId } },
            },
          },
        }),
        this.db.academicTopic.count({
          where: {
            chapter: {
              subject: {
                classSubjects: { some: { classId: validatedId } },
              },
            },
          },
        }),
        this.db.academicSubTopic.count({
          where: {
            topic: {
              chapter: {
                subject: {
                  classSubjects: { some: { classId: validatedId } },
                },
              },
            },
          },
        }),
        this.db.mcq.count({
          where: {
            subject: {
              classSubjects: { some: { classId: validatedId } },
            },
          },
        }),
        this.db.cq.count({
          where: {
            subject: {
              classSubjects: { some: { classId: validatedId } },
            },
          },
        }),
      ]);

      const subjects = subjectsData;

      const totalChapters = subjects.reduce(
        (acc, curr) => acc + curr._count.chapters,
        0,
      );

      return {
        contentDistribution: subjects.map((s) => ({
          id: s.id,
          name: s.displayName,
          chapters: s._count.chapters,
          percentage:
            totalChapters > 0 ? (s._count.chapters / totalChapters) * 100 : 0,
        })),
        questionBank: {
          mcqs: mcqCount,
          cqs: cqCount,
          total: mcqCount + cqCount,
        },
        hierarchy: {
          subjects: subjects.length,
          chapters: chapterCount,
          topics: topicCount,
          subTopics: subTopicCount,
          questions: mcqCount + cqCount,
        },
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Get recently updated topics for a class
   */
  async getRecentTopics(input: {
    classId: string;
    limit: number;
  }): Promise<ClassRecentTopicResponse[] | undefined> {
    try {
      const validatedClassId = uuidSchema.parse(input.classId);
      const topics = await this.db.academicTopic.findMany({
        where: {
          chapter: {
            subject: {
              classSubjects: { some: { classId: validatedClassId } },
            },
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

  async forSelection(): Promise<
    { id: string; displayName: string }[] | undefined
  > {
    try {
      return await this.db.academicClass.findMany({
        where: { isActive: true },
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
