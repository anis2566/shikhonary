import { auth, User } from "@workspace/auth";
import {
  prisma,
  type TenantClient,
  type Tenant,
  type PrismaClient as BasePrismaClient,
} from "@workspace/db";

/**
 * Portability fix for master Prisma client type.
 * Interface wrapper prevents TS2742 by giving TypeScript a stable name.
 */
export interface PrismaClient extends BasePrismaClient {}

/**
 * Re-export TenantClient as TenantPrismaClient for tRPC context naming consistency.
 *
 * TenantClient is declared as `interface extends ReturnType<typeof buildTenantClient>`
 * in tenant-client.ts — giving TypeScript a portable name for .d.ts emission (fixes TS2742).
 *
 * RULE: Every file that needs the tenant client type imports TenantClient from
 * @workspace/db — NOT PrismaClient or TenantPrismaClient from tenant-client-types.
 * The base PrismaClient type is missing $on (stripped by $extends) and causes
 * "not assignable" errors when used as a service constructor parameter type.
 */
export type TenantPrismaClient = TenantClient;

export interface TRPCContext {
  user: User | null;
  userId: string | null;
  userRole: string | null;
  db: PrismaClient;
  tenant: Tenant | null;
  tenantClient: TenantClient | null; // ✅ TenantClient directly — single source of truth
  headers: Headers;
}

export async function createTRPCContext(opts: {
  headers: Headers;
}): Promise<TRPCContext> {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });

  const user = session?.user ?? null;
  const userId = user?.id ?? null;
  const userRole = (user as any)?.role ?? null;

  return {
    user,
    userId,
    userRole,
    db: prisma as unknown as PrismaClient,
    tenant: null,
    tenantClient: null,
    headers: opts.headers,
  };
}

export type Context = TRPCContext;
