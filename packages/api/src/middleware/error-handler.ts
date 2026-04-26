import { TRPCError } from "@trpc/server";
import { Prisma } from "@workspace/db";
import { ZodError } from "zod";

/**
 * Handles Prisma errors and maps them to appropriate TRPC errors
 */
export function handlePrismaError(error: any): never {
  // Zod validation error
  if (error instanceof ZodError) {
    const message = error.errors
      .map((e) => `${e.path.join(".") || "input"}: ${e.message}`)
      .join("; ");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message,
      cause: error,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === "P2002") {
      const target = (error.meta?.target as string[])?.join(", ") || "field";
      throw new TRPCError({
        code: "CONFLICT",
        message: `A record with this ${target} already exists.`,
      });
    }

    // Record not found
    if (error.code === "P2025") {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The requested record was not found.",
      });
    }

    // Foreign key constraint failed
    if (error.code === "P2003") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "This operation could not be completed because of a related record.",
      });
    }
  }

  // Re-throw if it's already a TRPCError
  if (error instanceof TRPCError) {
    throw error;
  }

  // Handle generic errors (e.g., from `throw new Error("...")` in services)
  if (error instanceof Error) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: error.message,
      cause: error,
    });
  }

  // Generic fallback
  console.error("Unhandle Database Error:", error);
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected database error occurred.",
    cause: error as Error,
  });
}
