"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";

// ============================================================================
// CQ MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating a CQ
 */
export function useCreateCQ() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.cq.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create CQ");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.cq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating a CQ
 */
export function useUpdateCQ() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.cq.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update CQ");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.cq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting a CQ
 */
export function useDeleteCQ() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.cq.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete CQ");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.cq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deleting CQs
 */
export function useBulkDeleteCQs() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.cq.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to bulk delete CQs");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.cq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// CQ QUERIES
// ============================================================================

/**
 * Hook for listing CQs with filters
 */
export function useCQs(filters: any) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.cq.list.queryOptions(filters),
    select: (data: any) => data.data,
  });
}

/**
 * Hook for getting a CQ by ID
 */
export function useCQById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.cq.getById.queryOptions({ id }),
    select: (data: any) => data.data,
  });
}

/**
 * Hook for getting CQ statistics
 */
export function useCQStats(chapterId?: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.cq.getStats.queryOptions({ chapterId }),
    select: (data: any) => data.data,
  });
}
