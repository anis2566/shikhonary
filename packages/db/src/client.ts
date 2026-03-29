import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { resolve } from "node:path";
import { PrismaClient } from "../master-client-types/client";
import { auditExtension } from "./extensions/audit";

config({ path: resolve(process.cwd(), "../../.env") });

const getBasePrisma = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not defined. Please check your .env file.",
    );
  }

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  return new PrismaClient({
    adapter,
    log: ["query", "error", "warn"],
  });
};

/**
 * Raw base master PrismaClient.
 *
 * IMPORTANT: This is intentionally kept as the non-extended base client.
 * - It is passed into auditExtension() so the parameter type stays as
 *   PrismaClient (not DynamicClientExtensionThis), avoiding TS type errors.
 * - It is also exported for use in tenant-client.ts for the same reason.
 * - Use `prisma` (the extended version) everywhere else in the app.
 */
export const basePrisma = getBasePrisma();

/**
 * Extended master Prisma client with audit extension.
 * Use this throughout the app for all master DB queries.
 */
const getExtendedPrisma = () => basePrisma.$extends(auditExtension(basePrisma));

const globalForPrisma = global as unknown as {
  prisma: ReturnType<typeof getExtendedPrisma>;
};

export const prisma = globalForPrisma.prisma || getExtendedPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Health check for the master database
 */
export const pingMasterDb = async () => {
  try {
    await basePrisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Master DB Health Check Failed:", error);
    return false;
  }
};
