import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { getTenantClientByTenantId, auditStorage } from "@workspace/db";
import type {
  Context,
  TRPCContext,
  PrismaClient,
  TenantPrismaClient,
} from "./context";
import { rateLimit } from "../middleware/rate-limiter";
import { sanitizeInput } from "../middleware/input-sanitizer";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export type { Context, TRPCContext, PrismaClient, TenantPrismaClient };

// ---------------------------------------------------------------------------
// Auth middleware
// ---------------------------------------------------------------------------

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user || !ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: ctx.user,
      userId: ctx.userId,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

// ---------------------------------------------------------------------------
// Admin middleware
// ---------------------------------------------------------------------------

const isAdmin = t.middleware(({ next, ctx }) => {
  // if (ctx.userRole !== "SUPER_ADMIN" && ctx.userRole !== "ADMIN") {
  //   throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  // }
  return next();
});

export const adminProcedure = protectedProcedure.use(isAdmin);

// ---------------------------------------------------------------------------
// Tenant middleware
//
// KEY: tenantClient is passed directly — no `as unknown as` cast.
// TenantPrismaClient is `interface extends TenantClient` which is
// `interface extends ReturnType<typeof buildTenantClient>`, giving TypeScript
// a stable portable name and resolving TS2742 on the exported procedures.
// ---------------------------------------------------------------------------

const isTenantMember = t.middleware(async ({ next, ctx }) => {
  if (!ctx.userId) throw new TRPCError({ code: "UNAUTHORIZED" });

  console.log("User ID", ctx.userId);

  const membership = await ctx.db.tenantMember.findFirst({
    where: {
      userId: ctx.userId,
      isActive: true,
      tenant: { isActive: true },
    },
    include: { tenant: true },
  });

  if (!membership || !membership.tenant) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Active tenant membership required.",
    });
  }

  const tenantClient = await getTenantClientByTenantId(membership.tenantId);
  if (!tenantClient) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Could not connect to tenant database.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      tenant: membership.tenant,
      tenantClient, // ✅ No cast needed — TenantClient satisfies TenantPrismaClient
    },
  });
});

export const tenantProcedure = protectedProcedure.use(isTenantMember);

// ---------------------------------------------------------------------------
// Tenant Admin middleware
// ---------------------------------------------------------------------------

const isTenantAdmin = t.middleware(({ next, ctx }) => {
  if (ctx.userRole !== "ADMIN" && (ctx as any).membership?.role !== "ADMIN") {
    // Check...
  }
  return next();
});

export const tenantAdminProcedure = tenantProcedure.use(isTenantAdmin);

// ---------------------------------------------------------------------------
// Mutation middleware (audit + rate limit + sanitize)
// ---------------------------------------------------------------------------

export const mutationMiddleware = t.middleware(
  async ({ next, ctx, type, input }) => {
    if (type !== "mutation") return next();

    if (ctx.userId) rateLimit(ctx.userId);
    const sanitizedInput = sanitizeInput(input);

    return auditStorage.run(
      {
        userId: ctx.userId ?? undefined,
        tenantId: ctx.tenant?.id ?? undefined,
        ipAddress:
          ctx.headers.get("x-forwarded-for") ||
          ctx.headers.get("x-real-ip") ||
          undefined,
        userAgent: ctx.headers.get("user-agent") || undefined,
      },
      async () => {
        const result = await next({ ctx });
        return result;
      },
    );
  },
);

export const baseMutationProcedure = protectedProcedure.use(mutationMiddleware);
export const baseTenantMutationProcedure =
  tenantProcedure.use(mutationMiddleware);
