import { basePrisma } from "./client";
import { getTenantClient, getPoolStats } from "./tenant-client";

/**
 * Pings the master database to check connectivity
 */
export const pingMaster = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    await basePrisma.$queryRaw`SELECT 1`;
    return { success: true, message: "Master database is healthy" };
  } catch (error: any) {
    return {
      success: false,
      message: `Master database connection failed: ${error.message}`,
    };
  }
};

/**
 * Pings a specific tenant database
 */
export const pingTenant = async (
  connectionString: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const client = getTenantClient(connectionString);
    await client.$queryRaw`SELECT 1`;
    return { success: true, message: "Tenant database is healthy" };
  } catch (error: any) {
    return {
      success: false,
      message: `Tenant database connection failed: ${error.message}`,
    };
  }
};

/**
 * Gets overview of all database connections
 */
export const getDatabaseHealth = async () => {
  const master = await pingMaster();
  const tenants = getPoolStats();

  return {
    master,
    tenants,
    timestamp: new Date().toISOString(),
  };
};
