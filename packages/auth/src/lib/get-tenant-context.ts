import { auth } from "./auth";
import {
  prisma as masterPrisma,
  getTenantClientByTenantId,
} from "@workspace/db";
import { isSuperAdmin } from "./roles";
import type { TenantContext, AuthUser } from "../types";

/**
 * Resolves the tenant context for the current request.
 * Supports tenant switching via a custom header 'x-tenant-id' or 'x-tenant-slug'.
 */
export async function getTenantContext(
  reqHeaders: Headers,
): Promise<TenantContext | null> {
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session) return null;

  const user = session.user as AuthUser;

  // 1. Check if user is Super Admin
  const superAdmin = isSuperAdmin(user.role);

  // 2. Determine which tenant to use
  // Priority:
  // - Requested tenant ID/Slug (switching)
  // - Primary tenant from memberships

  const requestedTenantId = reqHeaders.get("x-tenant-id");
  const requestedTenantSlug = reqHeaders.get("x-tenant-slug");

  let tenant = null;

  if (requestedTenantId || requestedTenantSlug) {
    // Verify membership or allow if super admin
    tenant = await masterPrisma.tenant.findFirst({
      where: {
        OR: [
          { id: requestedTenantId || undefined },
          { slug: requestedTenantSlug || undefined },
        ],
        AND: superAdmin
          ? {}
          : {
            members: {
              some: { userId: user.id },
            },
          },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        connectionString: true,
        isActive: true,
        isSuspended: true,
      },
    });
  } else {
    // Get primary tenant (first one for now)
    const membership = await masterPrisma.tenantMember.findFirst({
      where: { 
        userId: user.id,
        isActive: true, 
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
            connectionString: true,
            isActive: true,
            isSuspended: true,
          },
        },
      },
    });
    tenant = membership?.tenant || null;
  }

  // 3. Resolve tenant client if tenant exists and is active/not suspended
  let tenantClient = null;
  if (tenant && tenant.isActive && !tenant.isSuspended) {
    tenantClient = await getTenantClientByTenantId(tenant.id);
  }

  return {
    user,
    session: session.session,
    tenant,
    tenantClient,
    isSuperAdmin: superAdmin,
  };
}

/**
 * Check if current user has a specific role in the current request context.
 */
export async function hasRole(reqHeaders: Headers, role: string) {
  const context = await getTenantContext(reqHeaders);
  if (!context) return false;
  return context.user.role === role;
}

/**
 * Assert that the user has a specific role, or throw an error.
 */
export async function requireRole(
  reqHeaders: Headers,
  role: string,
): Promise<TenantContext> {
  const context = await getTenantContext(reqHeaders);
  if (!context || context.user.role !== role) {
    throw new Error("Unauthorized: Role required: " + role);
  }
  return context;
}
