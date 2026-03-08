"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Hook for listing all question papers
 */
export function useQuestionPapers(filters?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.questionPaper.list.queryOptions({
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 20,
      search: filters?.search,
      status: filters?.status,
    }),
    select: (data: any) => data.data,
  });
}

/**
 * Hook for getting a single question paper with all its MCQs resolved
 */
export function useQuestionPaperById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.questionPaper.getById.queryOptions({ id }),
    select: (data: any) => data.data,
    enabled: !!id,
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Create a new question paper (metadata only — no questions yet)
 */
export function useCreateQuestionPaper() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionPaper.create.mutationOptions(),
    onError: (error: any) => {
      toast.error(error.message || "Failed to create question paper");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.questionPaper.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Update question paper metadata (title, examName, className, etc.)
 */
export function useUpdateQuestionPaper() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionPaper.update.mutationOptions(),
    onError: (error: any) => {
      toast.error(error.message || "Failed to update question paper");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.questionPaper.list.queryKey(),
        });
        if (data.data?.id) {
          await queryClient.invalidateQueries({
            queryKey: trpc.questionPaper.getById.queryKey({ id: data.data.id }),
          });
        }
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Persist the builder's PaperSettings JSON to the database (debounce in the calling component)
 */
export function useUpdateQuestionPaperSettings() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionPaper.updateSettings.mutationOptions(),
    onError: (error: any) => {
      toast.error(error.message || "Failed to save settings");
    },
    onSuccess: async (data: any) => {
      if (data.success && data.data?.id) {
        await queryClient.invalidateQueries({
          queryKey: trpc.questionPaper.getById.queryKey({
            id: data.data.id,
          }),
        });
      }
    },
  });
}

/**
 * Delete (soft) a question paper
 */
export function useDeleteQuestionPaper() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionPaper.delete.mutationOptions(),
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete question paper");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.questionPaper.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Assign an MCQ from the bank to the paper
 */
export function useAssignMcqToQuestionPaper() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionPaper.assignMcq.mutationOptions(),
    onError: (error: any) => {
      toast.error(error.message || "Failed to assign question");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        // Invalidate the specific paper so the builder refreshes
        const paperId = data.data?.questionPaperId;
        if (paperId) {
          await queryClient.invalidateQueries({
            queryKey: trpc.questionPaper.getById.queryKey({ id: paperId }),
          });
        }
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Remove an assigned MCQ from the paper
 */
export function useRemoveMcqFromQuestionPaper() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionPaper.removeMcq.mutationOptions(),
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove question");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        // Targeted invalidation using the paperId from the deleted record
        const paperId = data.data?.questionPaperId;
        if (paperId) {
          await queryClient.invalidateQueries({
            queryKey: trpc.questionPaper.getById.queryKey({ id: paperId }),
          });
        } else {
          // Fallback: invalidate all getById queries
          await queryClient.invalidateQueries({
            queryKey: trpc.questionPaper.getById.queryKey(),
          });
        }
        // Also refresh the list to update question counts
        await queryClient.invalidateQueries({
          queryKey: trpc.questionPaper.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Reorder the questions within a paper
 */
export function useReorderQuestionPaperQuestions() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionPaper.reorderQuestions.mutationOptions(),
    onError: (error: any) => {
      toast.error(error.message || "Failed to reorder questions");
    },
    onSuccess: async (data: any, variables: any) => {
      if (data.success) {
        await queryClient.invalidateQueries({
          queryKey: trpc.questionPaper.getById.queryKey({
            id: variables.questionPaperId,
          }),
        });
      }
    },
  });
}

/**
 * Update per-question style overrides
 */
export function useUpdateQuestionOverrides() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionPaper.updateQuestionOverrides.mutationOptions(),
    onError: (error: any) => {
      toast.error(error.message || "Failed to update question style");
    },
    onSuccess: async (data: any) => {
      if (data.success && data.data?.questionPaperId) {
        await queryClient.invalidateQueries({
          queryKey: trpc.questionPaper.getById.queryKey({
            id: data.data.questionPaperId,
          }),
        });
      }
    },
  });
}
