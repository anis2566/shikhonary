import type { Session, User } from "../lib/auth";
import type { Role } from "../lib/roles";
import type { TenantTypes } from "@workspace/db";

/**
 * Extended User with Role
 */
export type AuthUser = User & { role: Role };

export type { Role, Session, User };

/**
 * Full session context with user and session
 */
export type AuthSession = {
  session: Session;
  user: User;
} | null;

export type TenantContext = {
  user: AuthUser;
  session: Session;
  tenant: {
    id: string;
    name: string;
    slug: string;
    connectionString: string | null;
    isActive: boolean;
    isSuspended: boolean;
  } | null;
  tenantClient: TenantTypes.PrismaClient | null;
  isSuperAdmin: boolean;
};
