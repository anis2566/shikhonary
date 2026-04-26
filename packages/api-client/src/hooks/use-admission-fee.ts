"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useAdmissionFeeFilters } from "../filters/client";

// ============================================================================
// ADMISSION FEE MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating an admission fee
 */
export function useCreateAdmissionFee() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.admissionFee.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create admission fee");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.admissionFee.list.queryKey(),
        });
      } else {
        toast.error(data.message || "Failed to create admission fee");
      }
    },
  });
}

/**
 * Mutation hook for updating an admission fee
 */
export function useUpdateAdmissionFee() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.admissionFee.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update admission fee");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.admissionFee.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.admissionFee.getById.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message || "Failed to update admission fee");
      }
    },
  });
}

/**
 * Mutation hook for deleting an admission fee
 */
export function useDeleteAdmissionFee() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.admissionFee.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete admission fee");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.admissionFee.list.queryKey(),
        });
      } else {
        toast.error(data.message || "Failed to delete admission fee");
      }
    },
  });
}

// ============================================================================
// ADMISSION FEE QUERIES
// ============================================================================

/**
 * Hook for listing admission fees with filters
 */
export function useAdmissionFees() {
  const trpc = useTRPC();
  const [filters] = useAdmissionFeeFilters();

  return useQuery({
    ...trpc.admissionFee.list.queryOptions(filters),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting an admission fee by ID
 */
export function useAdmissionFeeById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.admissionFee.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

export function useAdmissionFeeByYearClassId(
  academicYearId?: string,
  academicClassId?: string,
) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.admissionFee.getByYearClassId.queryOptions({
      academicYearId,
      academicClassId,
    }),
    select: (data) => data.data,
  });
}
