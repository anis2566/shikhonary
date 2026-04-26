"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useCounterFilters } from "../filters/client";

// ============================================================================
// COUNTER MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating a counter
 */
export function useCreateCounter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.counter.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create counter");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.counter.list.queryKey(),
        });
      } else {
        toast.error(data.message || "Failed to create counter");
      }
    },
  });
}

/**
 * Mutation hook for updating a counter
 */
export function useUpdateCounter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.counter.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update counter");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.counter.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.counter.getById.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message || "Failed to update counter");
      }
    },
  });
}

/**
 * Mutation hook for deleting a counter
 */
export function useDeleteCounter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.counter.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete counter");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.counter.list.queryKey(),
        });
      } else {
        toast.error(data.message || "Failed to delete counter");
      }
    },
  });
}

// ============================================================================
// COUNTER QUERIES
// ============================================================================

/**
 * Hook for listing counters with filters
 */
export function useCounters() {
  const trpc = useTRPC();
  const [filters] = useCounterFilters();

  return useQuery({
    ...trpc.counter.list.queryOptions(filters),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting a counter by ID
 */
export function useCounterById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.counter.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

export function useNextCounterId(
  academicYearId?: string,
  academicClassId?: string,
) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.counter.getNextId.queryOptions({
      academicYearId,
      academicClassId,
    }),
    select: (data) => data.data,
    enabled: !!academicYearId && !!academicClassId,
  });
}
