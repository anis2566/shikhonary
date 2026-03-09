/**
 * @workspace/api
 *
 * tRPC API Layer — Routers, Context, Procedures & Business Logic
 */

export { appRouter, type AppRouter } from "./trpc/root";
export { createTRPCContext } from "./trpc/context";
export {
  publicProcedure,
  protectedProcedure,
  adminProcedure,
  tenantProcedure,
  tenantAdminProcedure,
} from "./trpc/index";

// Export services for direct use if needed (e.g., in server actions or background jobs)
export * from "./services/tenant.service";
export * from "./services/academic-class.service";
export * from "./services/academic-subject.service";
export * from "./services/academic-chapter.service";
export * from "./services/academic-topic.service";
export * from "./services/academic-subtopic.service";
export * from "./services/mcq.service";
export * from "./services/question-paper.service";
export * from "./services/question-type.service";

export * from "./services/student.service";
export * from "./services/batch.service";
export * from "./services/subscription-plan.service";
export * from "./services/subscription.service";
export {
  AcademicTreeService,
  type AcademicTreeSummary,
  type AcademicTreeCounts,
  type AcademicTreeSearchResults,
} from "./services/academic-tree.service";

// Export shared types and schemas
export * from "./shared/pagination";
export * from "./shared/filters";
export * from "./shared/query-builder";

// Re-export required types for portability
export type {
  PrismaClient,
  TenantPrismaClient,
  Context,
  TRPCContext,
} from "./trpc/context";
export type { User } from "@workspace/auth";
export type { Tenant } from "@workspace/db";
