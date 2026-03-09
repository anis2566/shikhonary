"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useQuestionTypeFilters } from "../filters/client";

// ============================================================================
// QUESTION TYPE MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating a question type
 */
export function useCreateQuestionType() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionType.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create question type");
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: trpc.questionType.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating a question type
 */
export function useUpdateQuestionType() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionType.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update question type");
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: trpc.questionType.list.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.questionType.getById.queryKey({ id: variables.id }),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting a question type
 */
export function useDeleteQuestionType() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionType.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete question type");
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: trpc.questionType.list.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.questionType.getById.queryKey({ id: variables.id }),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk activating question types
 */
export function useBulkActiveQuestionTypes() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionType.bulkActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate question types");
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: trpc.questionType.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deactivating question types
 */
export function useBulkDeactivateQuestionTypes() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionType.bulkDeactive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate question types");
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: trpc.questionType.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deleting question types
 */
export function useBulkDeleteQuestionTypes() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionType.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete question types");
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: trpc.questionType.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for activating a single question type
 */
export function useActiveQuestionType() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.questionType.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate question type");
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Question type activated successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.questionType.list.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.questionType.getById.queryKey({ id: variables.id }),
        });
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
 * Mutation hook for deactivating a single question type
 */
export function useDeactivateQuestionType() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.questionType.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate question type");
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Question type deactivated successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.questionType.list.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.questionType.getById.queryKey({ id: variables.id }),
        });
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
// QUESTION TYPE QUERIES
// ============================================================================

/**
 * Hook for listing question types with filters
 */
export function useQuestionTypes() {
  const trpc = useTRPC();
  const [filters] = useQuestionTypeFilters();

  const input = {
    ...filters,
    isActive:
      filters.isActive === "ACTIVE"
        ? true
        : filters.isActive === "INACTIVE"
          ? false
          : undefined,
  };

  return useQuery({
    ...trpc.questionType.list.queryOptions(input),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting a question type by ID
 */
export function useQuestionTypeById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.questionType.getById.queryOptions({ id }),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting question types for selection
 */
export function useQuestionTypesForSelection(subjectId?: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.questionType.forSelection.queryOptions({ subjectId }),
    select: (data) => data.data,
  });
}
