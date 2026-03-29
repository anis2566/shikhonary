import { PrismaClient } from "../tenant-client-types/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { LRUCache } from "lru-cache";
import { basePrisma } from "./client";
import { auditExtension } from "./extensions/audit";

const MAX_CLIENTS = 50;
const CLIENT_TTL = 1000 * 60 * 30; // 30 minutes

/**
 * Builds a tenant Prisma client for Prisma 7 + @prisma/adapter-pg 7.
 *
 * BREAKING CHANGE in adapter-pg v6+/v7:
 * PrismaPg no longer accepts a `pg.Pool` instance.
 * It only accepts a connection string config object — same as how the
 * master client.ts is already configured. Passing a Pool caused the
 * "Invalid invocation" runtime error silently.
 */
const buildTenantClient = (connectionString: string) => {
  const adapter = new PrismaPg({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  const base = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  return base.$extends(auditExtension(basePrisma));
};

/**
 * Opaque interface wrapper for the extended tenant client.
 * Using `interface extends` instead of `type =` prevents TS2742
 * ("cannot be named without a reference to internal/prismaNamespace").
 */
export interface TenantClient extends ReturnType<typeof buildTenantClient> {}

type TenantClientInstance = {
  client: TenantClient;
};

const tenantCache = new LRUCache<string, TenantClientInstance>({
  max: MAX_CLIENTS,
  ttl: CLIENT_TTL,
  dispose: (value) => {
    value.client.$disconnect();
  },
});

/**
 * Get or create a Prisma client for a specific tenant connection string.
 */
export const getTenantClient = (connectionString: string): TenantClient => {
  const cached = tenantCache.get(connectionString);
  if (cached) return cached.client;

  const client = buildTenantClient(connectionString) as TenantClient;
  tenantCache.set(connectionString, { client });
  return client;
};

/**
 * Get a Prisma client by Tenant ID.
 */
export const getTenantClientByTenantId = async (
  tenantId: string,
): Promise<TenantClient | null> => {
  const tenant = await basePrisma.tenant.findUnique({
    where: { id: tenantId },
    select: { connectionString: true },
  });

  if (!tenant?.connectionString) return null;

  return getTenantClient(tenant.connectionString);
};

/**
 * Health check for a specific tenant database
 */
export const pingTenantDb = async (connectionString: string) => {
  try {
    const client = getTenantClient(connectionString);
    await client.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Tenant DB Health Check Failed:", error);
    return false;
  }
};

/**
 * Gracefully disconnect all tenant clients from the pool
 */
export const disconnectAllTenants = async () => {
  const values = Array.from(tenantCache.values());
  await Promise.all(values.map((v) => v.client.$disconnect()));
  tenantCache.clear();
};

/**
 * Get current pool stats
 */
export const getPoolStats = () => ({
  activeClients: tenantCache.size,
  maxClients: MAX_CLIENTS,
});

process.on("SIGINT", disconnectAllTenants);
process.on("SIGTERM", disconnectAllTenants);
