"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";

// ============================================================================
// ACADEMIC YEAR MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating an academic year
 */
export function useCreateAcademicYear() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicYear.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create academic year");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicYear.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicYear.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicYear.getCurrent.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message || "Failed to create academic year");
      }
    },
  });
}

/**
 * Mutation hook for updating an academic year
 */
export function useUpdateAcademicYear() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicYear.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update academic year");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicYear.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicYear.getById.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicYear.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicYear.getCurrent.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message || "Failed to update academic year");
      }
    },
  });
}

/**
 * Mutation hook for deleting an academic year
 */
export function useDeleteAcademicYear() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.academicYear.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete academic year");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.academicYear.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicYear.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.academicYear.getCurrent.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message || "Failed to delete academic year");
      }
    },
  });
}

// ============================================================================
// ACADEMIC YEAR QUERIES
// ============================================================================

/**
 * Hook for listing academic years
 */
export function useAcademicYears(
  filters: {
    page: number;
    limit: number;
    search?: string;
    isActive: boolean | null;
    isCurrent: boolean | null;
  } = { page: 1, limit: 100 },
) {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.academicYear.list.queryOptions(filters));
}

/**
 * Hook for getting an academic year by ID
 */
export function useAcademicYearById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.academicYear.getById.queryOptions({ id }));
}

/**
 * Hook for getting academic year stats
 */
export function useAcademicYearStats() {
  const trpc = useTRPC();
  return useQuery(trpc.academicYear.getStats.queryOptions());
}

/**
 * Hook for getting current academic year
 */
export function useCurrentAcademicYear() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.academicYear.getCurrent.queryOptions());
}
