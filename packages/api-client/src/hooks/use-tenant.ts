"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useTenantFilters } from "../filters/client";

// ============================================================================
// TENANT MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating a tenant.
 * Accepts optional callbacks so the call site can drive provisioning UI.
 */
export function useCreateTenant(callbacks?: {
  onMutate?: () => void;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.tenant.create.mutationOptions(),
    onError: (error) => {
      callbacks?.onError?.(error);
      if (!callbacks?.onError) {
        toast.error(error.message || "Failed to create tenant");
      }
    },
    onSuccess: async (data) => {
      if (data.success) {
        await queryClient.invalidateQueries({
          queryKey: trpc.tenant.list.queryKey(),
        });
        callbacks?.onSuccess?.(data);
        if (!callbacks?.onSuccess) {
          toast.success(data.message);
        }
      } else {
        callbacks?.onError?.(new Error(data.message));
        if (!callbacks?.onError) {
          toast.error(data.message);
        }
      }
    },
  });

  return {
    ...mutation,
    // Wrap mutate/mutateAsync to fire onMutate callback before the request
    mutate: (...args: Parameters<typeof mutation.mutate>) => {
      callbacks?.onMutate?.();
      mutation.mutate(...args);
    },
    mutateAsync: async (...args: Parameters<typeof mutation.mutateAsync>) => {
      callbacks?.onMutate?.();
      return mutation.mutateAsync(...args);
    },
  };
}

/**
 * Mutation hook for updating a tenant
 */
export function useUpdateTenant() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tenant.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update tenant");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.tenant.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting a tenant
 */
export function useDeleteTenant() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tenant.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete tenant");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.tenant.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for toggling tenant active status
 */
export function useToggleTenantStatus() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tenant.toggleStatus.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to toggle tenant status");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.tenant.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for activating a single tenant
 */
export function useActivateTenant() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.tenant.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate tenant");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success("Tenant activated successfully");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.tenant.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.tenant.getById.queryKey({ id: variables.id }),
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
 * Mutation hook for deactivating a single tenant
 */
export function useDeactivateTenant() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.tenant.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate tenant");
    },
    onSuccess: async (data, variables) => {
      if (data.success) {
        toast.success("Tenant deactivated successfully");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.tenant.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.tenant.getById.queryKey({ id: variables.id }),
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

/**
 * Mutation hook for bulk activating tenants
 */
export function useBulkActivateTenants() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tenant.bulkActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to activate tenants");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.tenant.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deactivating tenants
 */
export function useBulkDeactivateTenants() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tenant.bulkDeactive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate tenants");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.tenant.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for bulk deleting tenants
 */
export function useBulkDeleteTenants() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tenant.bulkDelete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete tenants");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.tenant.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for sending tenant admin invitation
 */
export function useInviteTenantAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tenant.sendInvitation.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to send invitation");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        // Optionally invalidate queries if needed
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// TENANT QUERIES
// ============================================================================

/**
 * Hook for listing tenants with filters
 */
export function useTenants() {
  const trpc = useTRPC();
  const [filters, _] = useTenantFilters();
  return useSuspenseQuery(trpc.tenant.list.queryOptions(filters));
}

/**
 * Hook for getting a tenant by ID
 */
export function useTenantById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.tenant.getById.queryOptions({ id }));
}

/**
 * Hook for getting tenant statistics
 */
export function useTenantStats() {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.tenant.getStats.queryOptions(),
    select: (data) => data.data,
  });
}

/**
 * Hook for validating a tenant invitation token
 */
export function useValidateInvitation(token: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.tenant.validateInvitation.queryOptions({ token }),
    enabled: !!token,
    retry: false,
  });
}

/**
 * Hook for validating a tenant invitation token (Suspense)
 */
export function useSuspenseValidateInvitation(token: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.tenant.validateInvitation.queryOptions({ token }),
  );
}

/**
 * Mutation hook for accepting a tenant admin invitation
 */
export function useAcceptInvitation() {
  const trpc = useTRPC();

  return useMutation({
    ...trpc.tenant.acceptInvitation.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to accept invitation");
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
  });
}
