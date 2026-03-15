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

/**
 * Hook for fetching all subject mark distributions for a paper.
 * Returns subjects with their ordered distribution rows — used in the
 * customize / builder page to render the mark breakdown panel.
 */
export function useQuestionPaperMarkDistributions(paperId: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.questionPaper.getMarkDistributions.queryOptions({ id: paperId }),
    select: (data: any) => data.data,
    enabled: !!paperId,
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Create a new question paper together with its subject rows and optional
 * mark-distribution breakdown for each subject.
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
 * Persist the builder's PaperSettings JSON to the database
 * (debounce in the calling component)
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
 * Assign a CQ from the bank to the paper
 */
export function useAssignCqToQuestionPaper() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionPaper.assignCq.mutationOptions(),
    onError: (error: any) => {
      toast.error(error.message || "Failed to assign question");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
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
        const paperId = data.data?.questionPaperId;
        if (paperId) {
          await queryClient.invalidateQueries({
            queryKey: trpc.questionPaper.getById.queryKey({ id: paperId }),
          });
        } else {
          // Fallback: bust all cached paper detail queries
          await queryClient.invalidateQueries({
            queryKey: trpc.questionPaper.getById.queryKey(),
          });
        }
        // Also refresh the list to keep question counts in sync
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
 * Bulk assign MCQs to a paper
 */
export function useBulkAssignMcqToQuestionPaper() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionPaper.bulkAssignMcq.mutationOptions(),
    onError: (error: any) => {
      toast.error(error.message || "Failed to assign questions");
    },
    onSuccess: async (data: any, variables: any) => {
      if (data.success) {
        toast.success(data.message);
        if (variables.questionPaperId) {
          await queryClient.invalidateQueries({
            queryKey: trpc.questionPaper.getById.queryKey({
              id: variables.questionPaperId,
            }),
          });
        }
      }
    },
  });
}

/**
 * Bulk assign CQs to a paper
 */
export function useBulkAssignCqToQuestionPaper() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionPaper.bulkAssignCq.mutationOptions(),
    onError: (error: any) => {
      toast.error(error.message || "Failed to assign questions");
    },
    onSuccess: async (data: any, variables: any) => {
      if (data.success) {
        toast.success(data.message);
        if (variables.questionPaperId) {
          await queryClient.invalidateQueries({
            queryKey: trpc.questionPaper.getById.queryKey({
              id: variables.questionPaperId,
            }),
          });
        }
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Bulk remove MCQs from a paper
 */
export function useBulkRemoveMcqFromQuestionPaper() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionPaper.bulkRemoveMcq.mutationOptions(),
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove questions");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        // Bust all paper details
        await queryClient.invalidateQueries({
          queryKey: trpc.questionPaper.getById.queryKey(),
        });
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

/**
 * Replace the mark-distribution rows for a single (paper × subject) record.
 *
 * The service atomically:
 *   1. Wipes & re-creates the distribution rows
 *   2. Updates the subject-level `subjectTotal`
 *   3. Re-aggregates and updates the paper-level `total`
 *
 * So on success we invalidate both the paper detail cache (which carries the
 * updated `total`) and the dedicated distributions cache.
 *
 * The caller must pass `paperId` alongside `paperSubjectId` so we can do a
 * targeted invalidation instead of busting every cached paper.
 */
export function useUpdateMarkDistribution() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.questionPaper.updateMarkDistribution.mutationOptions(),
    onError: (error: any) => {
      toast.error(error.message || "Failed to update mark distribution");
    },
    onSuccess: async (data: any, variables: any) => {
      if (data.success) {
        toast.success(data.message ?? "Mark distribution updated");

        // `variables.paperId` must be passed by the caller — see JSDoc above.
        const paperId: string | undefined = variables?.paperId;

        if (paperId) {
          await Promise.all([
            // Bust the full paper detail (carries updated `total`)
            queryClient.invalidateQueries({
              queryKey: trpc.questionPaper.getById.queryKey({ id: paperId }),
            }),
            // Bust the dedicated distributions query
            queryClient.invalidateQueries({
              queryKey: trpc.questionPaper.getMarkDistributions.queryKey({
                id: paperId,
              }),
            }),
          ]);
        } else {
          // Fallback if caller forgot to pass paperId — bust everything
          await queryClient.invalidateQueries({
            queryKey: trpc.questionPaper.getById.queryKey(),
          });
          await queryClient.invalidateQueries({
            queryKey: trpc.questionPaper.getMarkDistributions.queryKey(),
          });
        }
      } else {
        toast.error(data.message);
      }
    },
  });
}
