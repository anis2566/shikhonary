import { PrismaClient } from "../tenant-client-types/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { LRUCache } from "lru-cache";
import { prisma as masterPrisma } from "./client";
import { auditExtension } from "./extensions/audit";

/**
 * Tenant Prisma Client Pool Configuration
 */
const MAX_CLIENTS = 50;
const CLIENT_TTL = 1000 * 60 * 30; // 30 minutes idle time

type TenantClientInstance = {
  client: any; // Using any for extended client type compatibility
  pool: pg.Pool;
};

/**
 * LRU Cache for Tenant Prisma Clients
 */
const tenantCache = new LRUCache<string, TenantClientInstance>({
  max: MAX_CLIENTS,
  dispose: (value) => {
    // Gracefully disconnect when evicted from cache
    value.client.$disconnect();
    value.pool.end();
  },
  ttl: CLIENT_TTL,
});

/**
 * Get or create a Prisma client for a specific tenant connection string
 */
export const getTenantClient = (connectionString: string) => {
  const cached = tenantCache.get(connectionString);
  if (cached) return cached.client;

  const pool = new pg.Pool({
    connectionString,
    max: 10, // Limit connections per tenant
    ssl: { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);

  const baseClient = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  const client = baseClient.$extends(auditExtension(masterPrisma));

  tenantCache.set(connectionString, { client, pool });
  return client;
};

/**
 * Get a Prisma client by Tenant ID (looks up connection string in master DB)
 */
export const getTenantClientByTenantId = async (
  tenantId: string,
): Promise<any | null> => {
  const tenant = await masterPrisma.tenant.findUnique({
    where: { id: tenantId },
    select: { connectionString: true },
  });

  if (!tenant || !tenant.connectionString) {
    return null;
  }

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
 * Gracefully disconnect all tenant clients
 */
export const disconnectAllTenants = async () => {
  const values = Array.from(tenantCache.values());
  await Promise.all(values.map((v) => v.client.$disconnect()));
  await Promise.all(values.map((v) => v.pool.end()));
  tenantCache.clear();
};

/**
 * Get current pool stats
 */
export const getPoolStats = () => {
  return {
    activeClients: tenantCache.size,
    maxClients: MAX_CLIENTS,
  };
};

// Handle cleanup on process exit
process.on("SIGINT", disconnectAllTenants);
process.on("SIGTERM", disconnectAllTenants);
