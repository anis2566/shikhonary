import { Prisma } from "../../tenant-client-types/client";
import { PrismaClient as MasterPrismaClient } from "../../master-client-types/client";
import { AsyncLocalStorage } from "node:async_hooks";

export interface AuditContext {
  userId?: string;
  tenantId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export const auditStorage = new AsyncLocalStorage<AuditContext>();

const SENSITIVE_FIELDS = [
  "password",
  "token",
  "accessToken",
  "refreshToken",
  "idToken",
  "connectionString",
];

function maskSensitiveData(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;
  const masked = Array.isArray(obj) ? [...obj] : { ...obj };
  for (const key in masked) {
    if (SENSITIVE_FIELDS.includes(key)) {
      masked[key] = "********";
    } else if (typeof masked[key] === "object") {
      masked[key] = maskSensitiveData(masked[key]);
    }
  }
  return masked;
}

/**
 * Prisma extension for automatic auditing on tenant clients.
 *
 * @param masterPrisma - The RAW (non-extended) master PrismaClient instance.
 *                       Must be the base client, NOT the extended one, to avoid
 *                       type mismatch errors with DynamicClientExtensionThis.
 *
 * NOTE: The tenant schema has no AuditLog model. All audit writes go to the
 * master DB via masterPrisma. This extension is applied to tenant clients only.
 */
export const auditExtension = (masterPrisma: MasterPrismaClient) => {
  return Prisma.defineExtension({
    name: "auditExtension",
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const writeOperations = [
            "create",
            "update",
            "delete",
            "upsert",
            "updateMany",
            "deleteMany",
            "createMany",
          ];

          // Skip non-write operations immediately
          if (!writeOperations.includes(operation)) {
            return query(args);
          }

          const ctx = auditStorage.getStore();

          // Execute the original tenant query first
          const result = await query(args);

          // Fire-and-forget audit log write to master DB
          if (ctx && masterPrisma) {
            const entityId = (args as any)?.where?.id || (result as any)?.id;

            masterPrisma.auditLog
              .create({
                data: {
                  action: operation,
                  entity: model ?? "Unknown",
                  entityId: typeof entityId === "string" ? entityId : undefined,
                  userId: ctx.userId,
                  tenantId: ctx.tenantId,
                  ipAddress: ctx.ipAddress,
                  userAgent: ctx.userAgent,
                  metadata: { input: maskSensitiveData(args) },
                  description: `Automatic audit for ${operation} on ${model}`,
                },
              })
              .catch((err: any) => {
                console.error(
                  "[AuditExtension Error] Failed to log audit:",
                  err,
                );
              });
          }

          return result;
        },
      },
    },
  });
};
