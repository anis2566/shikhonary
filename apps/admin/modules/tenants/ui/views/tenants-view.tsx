"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import {
  useTenants,
  useActivateTenant,
  useDeactivateTenant,
  useBulkActivateTenants,
  useBulkDeactivateTenants,
  useBulkDeleteTenants,
  useDeleteTenant,
} from "@workspace/api-client";

import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

import { BulkActions } from "../components/bulk-actions";
import { Pagination } from "../components/pagination";
import { Filter } from "../components/filter";
import { TenantListStat } from "../components/tenant-list-stat";
import { TenantList } from "../components/tenant-list";
import { InviteTenantAdminDialog } from "../modal/tenant-invitation-modal";
import { useInvitationModal } from "@workspace/ui/hooks/use-invitation-modal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const TenantsView = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { openDeleteModal } = useDeleteModal();
  const { onOpen: openInvitationModal } = useInvitationModal();

  const { data: tenantsData } = useTenants();
  const { mutateAsync: bulkActivateTenants, isPending: isBulkActivating } =
    useBulkActivateTenants();
  const { mutateAsync: bulkDeactivateTenants, isPending: isBulkDeactivating } =
    useBulkDeactivateTenants();
  const { mutateAsync: bulkDeleteTenants, isPending: isBulkDeleting } =
    useBulkDeleteTenants();
  const { mutateAsync: activateTenant, isPending: isActivating } =
    useActivateTenant();
  const { mutateAsync: deactivateTenant, isPending: isDeactivating } =
    useDeactivateTenant();
  const { mutate: deleteTenant, isPending: isDeleting } = useDeleteTenant();

  const onBulkActivate = async () => {
    await bulkActivateTenants({ ids: selectedIds })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const onBulkDeactivate = async () => {
    await bulkDeactivateTenants({ ids: selectedIds })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const onBulkDelete = async () => {
    await bulkDeleteTenants({ ids: selectedIds })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const onActivate = async (id: string) => {
    await activateTenant({ id })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const onDeactivate = async (id: string) => {
    await deactivateTenant({ id })
      .then(() => setSelectedIds([]))
      .catch((error) => console.error(error));
  };

  const isLoading =
    isBulkActivating ||
    isBulkDeactivating ||
    isBulkDeleting ||
    isActivating ||
    isDeactivating ||
    isDeleting;

  const handleDeleteTenant = (tenantId: string, tenantName: string) => {
    openDeleteModal({
      entityId: tenantId,
      entityType: "tenant",
      entityName: tenantName,
      onConfirm: (id) => {
        deleteTenant({ id });
      },
    });
  };

  const handleInviteAdmin = (tenantId: string, tenantName: string) => {
    openInvitationModal(tenantId, tenantName);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-4 lg:p-6 space-y-8"
    >
      <InviteTenantAdminDialog />
      {/* Stats Section */}
      <motion.div variants={itemVariants}>
        <TenantListStat />
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col gap-4">
          <Filter isLoading={isLoading} />

          <BulkActions
            selectedCount={selectedIds.length}
            setSelectedIds={setSelectedIds}
            onBulkActivate={onBulkActivate}
            onBulkDeactivate={onBulkDeactivate}
            onBulkDelete={onBulkDelete}
            isLoading={isLoading}
          />
        </div>

        {/* List Section */}
        <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden shadow-sm">
          <TenantList
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onActive={onActivate}
            onDeactivate={onDeactivate}
            isLoading={isLoading}
            handleDelete={handleDeleteTenant}
            onInviteAdmin={handleInviteAdmin}
          />
        </div>

        {/* Footer actions / Pagination */}
        <div className="flex justify-between items-center px-2">
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {tenantsData?.items.length ?? 0}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {tenantsData?.meta.total ?? 0}
            </span>{" "}
            tenants
          </p>
          <Pagination totalItem={tenantsData?.meta.total ?? 0} />
        </div>
      </motion.div>
    </motion.div>
  );
};
