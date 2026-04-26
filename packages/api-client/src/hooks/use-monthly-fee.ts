"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useMonthlyFeeFilters } from "../filters/client";

// ============================================================================
// MONTHLY FEE MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating a monthly fee
 */
export function useCreateMonthlyFee() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.monthlyFee.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create monthly fee");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.monthlyFee.list.queryKey(),
        });
      } else {
        toast.error(data.message || "Failed to create monthly fee");
      }
    },
  });
}

/**
 * Mutation hook for updating a monthly fee
 */
export function useUpdateMonthlyFee() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.monthlyFee.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update monthly fee");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.monthlyFee.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.monthlyFee.getById.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message || "Failed to update monthly fee");
      }
    },
  });
}

/**
 * Mutation hook for deleting a monthly fee
 */
export function useDeleteMonthlyFee() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.monthlyFee.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete monthly fee");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.monthlyFee.list.queryKey(),
        });
      } else {
        toast.error(data.message || "Failed to delete monthly fee");
      }
    },
  });
}

// ============================================================================
// MONTHLY FEE QUERIES
// ============================================================================

/**
 * Hook for listing monthly fees with filters
 */
export function useMonthlyFees() {
  const trpc = useTRPC();
  const [filters] = useMonthlyFeeFilters();

  return useQuery({
    ...trpc.monthlyFee.list.queryOptions(filters),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting a monthly fee by ID
 */
export function useMonthlyFeeById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.monthlyFee.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

export function useMonthlyFeeByYearClassId(
  academicYearId?: string,
  academicClassId?: string,
) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.monthlyFee.getByYearClassId.queryOptions({
      academicYearId,
      academicClassId,
    }),
    select: (data) => data.data,
  });
}
