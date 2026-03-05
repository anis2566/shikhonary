import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import {
  BookService,
  ChapterService,
  ContentBlockService,
} from "../services/book.service";

const zNullableString = z.string().nullish();

// ── Book Router ───────────────────────────────────────────────────────────────

export const bookRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(50).default(12),
        search: zNullableString,
        classLevel: z.number().int().nullish(),
        academicSubjectId: zNullableString,
      }),
    )
    .query(async ({ ctx, input }) => {
      const service = new BookService(ctx.db);
      const data = await service.list({
        ...input,
        search: input.search ?? undefined,
      });
      return { success: true, data };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new BookService(ctx.db);
      const data = await service.getById(input.id);
      return { success: true, data };
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new BookService(ctx.db);
      await service.delete(input.id);
      return { success: true, message: "Book deleted successfully" };
    }),

  getIngestionJob: adminProcedure
    .input(z.object({ jobId: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new BookService(ctx.db);
      const data = await service.getIngestionJob(input.jobId);
      return { success: true, data };
    }),

  retryIngestion: baseMutationProcedure
    .input(
      z.object({ jobId: z.string(), bookId: z.string(), filePath: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new BookService(ctx.db);
      await service.retryIngestion(input.jobId);
      // Re-send the Inngest event (handled client-side via the upload route pattern)
      return {
        success: true,
        message: "Job reset to PENDING. Re-trigger via the upload endpoint.",
        jobId: input.jobId,
      };
    }),
} satisfies TRPCRouterRecord);

// ── Chapter Router ────────────────────────────────────────────────────────────

export const chapterRouter = createTRPCRouter({
  listByBook: adminProcedure
    .input(z.object({ bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new ChapterService(ctx.db);
      const data = await service.listByBook(input.bookId);
      return { success: true, data };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new ChapterService(ctx.db);
      const data = await service.getById(input.id);
      return { success: true, data };
    }),

  linkAcademicChapter: baseMutationProcedure
    .input(
      z.object({
        id: z.string(),
        academicChapterId: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new ChapterService(ctx.db);
      const data = await service.linkAcademicChapter(
        input.id,
        input.academicChapterId,
      );
      return { success: true, data };
    }),
} satisfies TRPCRouterRecord);

// ── ContentBlock Router ───────────────────────────────────────────────────────

export const contentBlockRouter = createTRPCRouter({
  update: baseMutationProcedure
    .input(
      z.object({
        id: z.string(),
        rawText: z.string().nullish(),
        aiDescription: z.string().nullish(),
        type: z
          .enum(["heading", "paragraph", "figure", "formula", "table"])
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new ContentBlockService(ctx.db);
      const { id, ...data } = input;
      const result = await service.update(id, data);
      return { success: true, data: result };
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new ContentBlockService(ctx.db);
      await service.delete(input.id);
      return { success: true, message: "Block deleted" };
    }),

  updateMedia: baseMutationProcedure
    .input(
      z.object({
        mediaId: z.string(),
        caption: z.string().nullish(),
        altText: z.string().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new ContentBlockService(ctx.db);
      const { mediaId, ...data } = input;
      const result = await service.updateMedia(mediaId, data);
      return { success: true, data: result };
    }),

  deleteMedia: baseMutationProcedure
    .input(z.object({ mediaId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new ContentBlockService(ctx.db);
      await service.deleteMedia(input.mediaId);
      return { success: true, message: "Image deleted" };
    }),
} satisfies TRPCRouterRecord);
