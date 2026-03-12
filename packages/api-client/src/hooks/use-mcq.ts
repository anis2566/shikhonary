"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useMCQFilters } from "../filters/client";

// ============================================================================
// MCQ MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating an MCQ
 */
export function useCreateMCQ() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.mcq.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create MCQ");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.mcq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating an MCQ
 */
export function useUpdateMCQ() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.mcq.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update MCQ");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.mcq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting an MCQ
 */
export function useDeleteMCQ() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.mcq.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete MCQ");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.mcq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deleting MCQs
 */
export function useBulkDeleteMCQs() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.mcq.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to bulk delete MCQs");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.mcq.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk creating MCQs (import)
 */
export function useBulkCreateMCQs() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.mcq.bulkCreate.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to import MCQs");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.mcq.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.mcq.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for activating a single MCQ
 */
export function useActivateMCQ() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.mcq.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate MCQ");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success("MCQ activated successfully");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.mcq.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.mcq.getById.queryKey({ id: variables.id }),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });

  return {
    ...mutation,
    mutate: (vars: { id: string }) =>
      mutation.mutate({ id: vars.id, data: { isActive: true } }),
    mutateAsync: (vars: { id: string }) =>
      mutation.mutateAsync({ id: vars.id, data: { isActive: true } }),
  };
}

/**
 * Mutation hook for deactivating a single MCQ
 */
export function useDeactivateMCQ() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.mcq.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate MCQ");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success("MCQ deactivated successfully");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.mcq.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.mcq.getById.queryKey({ id: variables.id }),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });

  return {
    ...mutation,
    mutate: (vars: { id: string }) =>
      mutation.mutate({ id: vars.id, data: { isActive: false } }),
    mutateAsync: (vars: { id: string }) =>
      mutation.mutateAsync({ id: vars.id, data: { isActive: false } }),
  };
}

// ============================================================================
// MCQ QUERIES
// ============================================================================

/**
 * Hook for listing MCQs with filters
 */
export function useMCQs() {
  const trpc = useTRPC();
  const [filters, _] = useMCQFilters();
  return useQuery({
    ...trpc.mcq.list.queryOptions(filters),
    select: (data: any) => data.data,
  });
}

/**
 * Hook for getting an MCQ by ID
 */
export function useMCQById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.mcq.getById.queryOptions({ id }),
    select: (data: any) => data.data,
  });
}

/**
 * Hook for getting MCQ statistics
 */
export function useMCQStats(chapterId?: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.mcq.getStats.queryOptions({ chapterId }),
    select: (data: any) => data.data,
  });
}
/**
 * Hook for getting MCQs for assignment to a question paper
 */
export function useMCQsForAssignment(filters: {
  subjectId: string;
  questionTypeId: string;
  chapterId?: string;
  type?: string;
  reference?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.mcq.getForAssignment.queryOptions(filters),
    select: (data: any) => data.data,
  });
}
