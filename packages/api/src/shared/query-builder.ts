/**
 * Shared utility to build Prisma query objects from common inputs
 */

/**
 * Builds pagination object for Prisma
 */
export function buildPagination(input: { page: number; limit: number }) {
  return {
    skip: (input.page - 1) * input.limit,
    take: input.limit,
  };
}

/**
 * Builds orderBy object for Prisma
 */
export function buildOrderBy(input: {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  sort?: string;
}) {
  if (input.sort) {
    if (input.sort === "ASC") return { createdAt: "asc" as const };
    if (input.sort === "DESC") return { createdAt: "desc" as const };
    if (input.sort === "POSITION_ASC") return { position: "asc" as const };
    if (input.sort === "POSITION_DESC") return { position: "desc" as const };
  }

  if (!input.sortBy) {
    return { createdAt: "desc" as const };
  }

  // Handle nested sorting if needed (e.g., "user.name")
  if (input.sortBy.includes(".")) {
    const parts = input.sortBy.split(".");
    let current: any = {};
    const result = current;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i] as string;
      if (i === parts.length - 1) {
        current[part] = input.sortOrder || "desc";
      } else {
        current[part] = {};
        current = current[part];
      }
    }
    return result;
  }

  return { [input.sortBy]: input.sortOrder || "desc" };
}

/**
 * Builds where clause for Prisma with search and filters
 */
export function buildWhere(
  input: { search?: string; isActive?: boolean | null },
  searchFields: string[] = ["name", "displayName"],
) {
  const where: any = {};

  if (typeof input.isActive === "boolean") {
    where.isActive = input.isActive;
  }

  if (input.search && searchFields.length > 0) {
    where.OR = searchFields.map((field) => {
      // Handle nested fields (e.g., "academicYear.name")
      if (field.includes(".")) {
        const parts = field.split(".");
        const result: any = {};
        let current = result;

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i] as string;
          if (i === parts.length - 1) {
            current[part] = {
              contains: input.search,
              mode: "insensitive",
            };
          } else {
            current[part] = {};
            current = current[part];
          }
        }
        return result;
      }

      return {
        [field]: {
          contains: input.search,
          mode: "insensitive",
        },
      };
    });
  }

  return where;
}
