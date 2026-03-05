import { type PrismaClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import { buildPagination } from "../shared/query-builder";
import {
  createPaginatedResponse,
  type PaginatedResponse,
} from "../shared/pagination";

export class BookService {
  constructor(private db: PrismaClient) {}

  async list(input: {
    page: number;
    limit: number;
    search?: string;
    classLevel?: number | null;
    academicSubjectId?: string | null;
  }): Promise<PaginatedResponse<any> | undefined> {
    try {
      const where: any = {};
      if (input.search) {
        where.title = { contains: input.search, mode: "insensitive" };
      }
      if (input.classLevel) where.classLevel = input.classLevel;
      if (input.academicSubjectId)
        where.academicSubjectId = input.academicSubjectId;

      const pagination = buildPagination(input);
      const [items, total] = await Promise.all([
        this.db.book.findMany({
          where,
          orderBy: { createdAt: "desc" },
          ...pagination,
          include: { ingestionJob: true },
        }),
        this.db.book.count({ where }),
      ]);

      return createPaginatedResponse(
        items as any,
        total,
        input.page,
        input.limit,
      );
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string): Promise<any | undefined> {
    try {
      return await this.db.book.findUnique({
        where: { id },
        include: {
          ingestionJob: true,
          chapters: { orderBy: { position: "asc" } },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<any | undefined> {
    try {
      return await this.db.book.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async retryIngestion(jobId: string): Promise<any | undefined> {
    try {
      return await this.db.pdfIngestionJob.update({
        where: { id: jobId },
        data: { status: "PENDING", errorMessage: null, processedPages: 0 },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getIngestionJob(jobId: string): Promise<any | undefined> {
    try {
      return await this.db.pdfIngestionJob.findUnique({ where: { id: jobId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}

export class ChapterService {
  constructor(private db: PrismaClient) {}

  async listByBook(bookId: string): Promise<any[] | undefined> {
    try {
      return await this.db.chapter.findMany({
        where: { bookId },
        orderBy: { position: "asc" },
        include: { _count: { select: { blocks: true } } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string): Promise<any | undefined> {
    try {
      return await this.db.chapter.findUnique({
        where: { id },
        include: {
          blocks: {
            orderBy: { orderIndex: "asc" },
            include: { media: { orderBy: { position: "asc" } } },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async linkAcademicChapter(
    id: string,
    academicChapterId: string | null,
  ): Promise<any | undefined> {
    try {
      return await this.db.chapter.update({
        where: { id },
        data: { academicChapterId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}

export class ContentBlockService {
  constructor(private db: PrismaClient) {}

  async update(
    id: string,
    data: {
      rawText?: string | null;
      aiDescription?: string | null;
      type?: string;
    },
  ): Promise<any | undefined> {
    try {
      return await this.db.contentBlock.update({ where: { id }, data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<any | undefined> {
    try {
      return await this.db.contentBlock.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async deleteMedia(mediaId: string): Promise<any | undefined> {
    try {
      return await this.db.contentBlockMedia.delete({ where: { id: mediaId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async updateMedia(
    mediaId: string,
    data: { caption?: string | null; altText?: string | null },
  ): Promise<any | undefined> {
    try {
      return await this.db.contentBlockMedia.update({
        where: { id: mediaId },
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
