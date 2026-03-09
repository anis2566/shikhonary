import { t } from "./index";
import { authRouter } from "../routers/auth";
import { tenantRouter } from "../routers/tenant";
import { academicClassRouter } from "../routers/academic-class";
import { academicSubjectRouter } from "../routers/academic-subject";
import { academicChapterRouter } from "../routers/academic-chapter";
import { academicTopicRouter } from "../routers/academic-topic";
import { academicSubTopicRouter } from "../routers/academic-subtopic";
import { mcqRouter } from "../routers/mcq";
import { studentRouter } from "../routers/student";
import { batchRouter } from "../routers/batch";
import { academicTreeRouter } from "../routers/academic-tree";
import { subscriptionPlanRouter } from "../routers/subscription-plan";
import { subscriptionRouter } from "../routers/subscription";
import { bookRouter, chapterRouter, contentBlockRouter } from "../routers/book";
import { questionPaperRouter } from "../routers/question-paper";
import { questionTypeRouter } from "../routers/question-type";

// Explicitly import branded types to ensure they are available for inference in this module
import type { TRPCContext, PrismaClient, TenantPrismaClient } from "./context";

/**
 * Root Router Composition.
 */
export const appRouter = t.router({
  auth: authRouter,
  tenant: tenantRouter,
  academicClass: academicClassRouter,
  academicSubject: academicSubjectRouter,
  academicChapter: academicChapterRouter,
  academicTopic: academicTopicRouter,
  academicSubTopic: academicSubTopicRouter,
  mcq: mcqRouter,
  student: studentRouter,
  batch: batchRouter,
  academicTree: academicTreeRouter,
  subscriptionPlan: subscriptionPlanRouter,
  subscription: subscriptionRouter,
  book: bookRouter,
  chapter: chapterRouter,
  contentBlock: contentBlockRouter,
  questionPaper: questionPaperRouter,
  questionType: questionTypeRouter,
});

/**
 * Export AppRouter type for frontend consumption.
 */
export type AppRouter = typeof appRouter;

/**
 * Re-exporting these here as well just to be absolutely sure the compiler
 * can name them when resolving AppRouter.
 */
export type { TRPCContext, PrismaClient, TenantPrismaClient };
