"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useAdmissionPaymentFilters } from "../filters/client";

// ============================================================================
// ADMISSION PAYMENT MUTATIONS
// ============================================================================

/**
 * Mutation hook for recording an admission payment
 */
export function useCreateAdmissionPayment() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.admissionPayment.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to record admission payment");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.admissionPayment.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating an admission payment
 */
export function useUpdateAdmissionPayment() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.admissionPayment.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update admission payment");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.admissionPayment.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting an admission payment
 */
export function useDeleteAdmissionPayment() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.admissionPayment.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete admission payment");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.admissionPayment.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deleting admission payments
 */
export function useBulkDeleteAdmissionPayments() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.admissionPayment.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete admission payments");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.admissionPayment.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// ADMISSION PAYMENT QUERIES
// ============================================================================

/**
 * Hook for listing admission payments with filters
 */
export function useAdmissionPayments() {
  const trpc = useTRPC();
  const [filters] = useAdmissionPaymentFilters();
  return useQuery({
    ...trpc.admissionPayment.list.queryOptions(filters),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting an admission payment by ID
 */
export function useAdmissionPaymentById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.admissionPayment.getById.queryOptions(id),
    select: (data) => data.data,
  });
}
