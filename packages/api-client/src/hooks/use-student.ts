"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useStudentFilters } from "../filters/client";

// ============================================================================
// STUDENT MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating a student
 */
export function useCreateStudent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.student.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create student");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.student.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating a student
 */
export function useUpdateStudent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.student.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update student");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.student.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting a student
 */
export function useDeleteStudent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.student.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete student");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.student.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk importing students
 */
export function useBulkImportStudents() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.student.bulkImport.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to import students");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.student.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for toggling student active status
 */
export function useToggleStudentActive() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.student.toggleActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to toggle student status");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.student.list.queryKey(),
        });
        await queryClient.invalidateQueries({
          queryKey: trpc.student.getStats.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// STUDENT QUERIES
// ============================================================================

/**
 * Hook for listing students with filters
 */
export function useStudents() {
  const trpc = useTRPC();
  const [filters] = useStudentFilters();
  return useQuery({
    ...trpc.student.list.queryOptions(filters),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting student stats
 */
export function useStudentStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.student.getStats.queryOptions(),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting a student by ID
 */
export function useStudentById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.student.getById.queryOptions(id),
    select: (data) => data.data,
  });
}
/**
 * Hook for getting student details by ID
 */
export function useStudentDetails(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.student.getDetails.queryOptions(id),
    select: (data) => data.data,
  });
}
