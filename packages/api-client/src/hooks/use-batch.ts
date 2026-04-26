"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useBatchFilters } from "../filters/client";

// ============================================================================
// BATCH MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating a batch
 */
export function useCreateBatch() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.batch.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create batch");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.batch.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.batch.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating a batch
 */
export function useUpdateBatch() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.batch.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update batch");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.batch.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.batch.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting a batch
 */
export function useDeleteBatch() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.batch.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete batch");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.batch.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.batch.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for toggling batch active status
 */
export function useToggleBatchActive() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.batch.toggleActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to toggle batch status");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.batch.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.batch.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deleting batches
 */
export function useBulkDeleteBatches() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.batch.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete batches");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.batch.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.batch.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// BATCH QUERIES
// ============================================================================

/**
 * Hook for listing batches with filters
 */
export function useBatches() {
  const trpc = useTRPC();
  const [filters] = useBatchFilters();
  return useQuery({
    ...trpc.batch.list.queryOptions(filters),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting a batch by ID
 */
export function useBatchById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.batch.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting a batch by ID
 */
export function useBatchDetails(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.batch.getDetails.queryOptions(id),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting batch statistics
 */
export function useBatchStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.batch.getStats.queryOptions(),
    select: (data) => data.data,
  });
}
export function useBatchesForSelection() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.batch.forSelection.queryOptions(),
    select: (data) => data.data,
  });
}

export function useBatchByYearClassId(
  academicYearId?: string,
  academicClassId?: string,
) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.batch.getByYearClassId.queryOptions({
      academicYearId,
      academicClassId,
    }),
    select: (data) => data.data,
  });
}
