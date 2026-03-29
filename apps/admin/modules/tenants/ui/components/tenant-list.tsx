"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  Edit,
  Eye,
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  Trash2,
  ExternalLink,
  UsersRound,
  Building,
  Database,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@workspace/ui/components/badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";

import { cn } from "@workspace/ui/lib/utils";

import { useTenants } from "@workspace/api-client";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  hideOnMobile?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface TenantWithCounts {
  id: string;
  name: string;
  slug: string;
  type: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  subdomain?: string | null | undefined;
  customDomain?: string | null | undefined;
  isActive: boolean;
  isSuspended: boolean;
  databaseStatus?: string | null;
  subscription?: {
    status: string;
    plan: {
      name: string;
    };
  } | null;
  _count: {
    members: number;
  };
}

const columns: Column<TenantWithCounts>[] = [
  {
    key: "name",
    header: "Tenant Details",
    render: (tenant) => (
      <div className="flex flex-col gap-1">
        <p className="font-bold text-foreground tracking-tight text-sm leading-none">
          {tenant.name}
        </p>
        <div className="flex items-center gap-1.5 opacity-60">
          {tenant.subdomain ? (
            <div className="flex items-center gap-1 group/link">
              <span className="text-[10px] font-mono leading-none">
                {tenant.subdomain}.shikhonary.com
              </span>
              <ExternalLink className="w-2.5 h-2.5 transition-transform group-hover/link:translate-x-0.5" />
            </div>
          ) : tenant.customDomain ? (
            <div className="flex items-center gap-1 group/link">
              <span className="text-[10px] font-mono leading-none">
                {tenant.customDomain}
              </span>
              <ExternalLink className="w-2.5 h-2.5 transition-transform group-hover/link:translate-x-0.5" />
            </div>
          ) : null}
        </div>
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    hideOnMobile: true,
    render: (tenant) => (
      <Badge
        variant="outline"
        className="bg-primary/5 text-primary border-primary/20 font-bold text-[10px] uppercase tracking-wider rounded-md h-6"
      >
        <Building className="w-3 h-3 mr-1.5" />
        {tenant.type}
      </Badge>
    ),
  },
  {
    key: "subscriptionTier",
    header: "Plan",
    hideOnMobile: true,
    render: (tenant) => (
      <SubscriptionBadge
        tier={tenant.subscription?.plan?.name ?? "FREE"}
        status={tenant.subscription?.status ?? "ACTIVE"}
      />
    ),
  },
  {
    key: "members",
    header: "Members",
    hideOnMobile: true,
    render: (tenant) => (
      <div className="flex items-center gap-2 bg-muted/30 w-fit px-2.5 py-1 rounded-lg border border-border/50">
        <UsersRound className="w-3.5 h-3.5 text-primary" />
        <p className="text-[11px] font-bold text-foreground leading-none">
          {tenant._count.members}
        </p>
      </div>
    ),
  },
  {
    key: "databaseStatus",
    header: "Database",
    hideOnMobile: true,
    render: (tenant) => (
      <DatabaseStatusBadge status={tenant.databaseStatus ?? "PENDING"} />
    ),
  },
  {
    key: "isActive",
    header: "Status",
    render: (tenant) => (
      <StatusBadge active={tenant.isActive && !tenant.isSuspended} />
    ),
  },
];

interface TenantListProps {
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  onActive: (id: string) => Promise<void>;
  onDeactivate: (id: string) => Promise<void>;
  isLoading: boolean;
  handleDelete: (id: string, name: string) => void;
  onInviteAdmin?: (id: string, name: string) => void;
}

function DatabaseStatusBadge({ status }: { status: string }) {
  const configs: Record<
    string,
    { color: string; bg: string; border: string; pulse?: boolean }
  > = {
    PENDING: {
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    PROVISIONING: {
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      pulse: true,
    },
    ACTIVE: {
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    FAILED: {
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/20",
    },
    INACTIVE: {
      color: "text-muted-foreground",
      bg: "bg-muted/50",
      border: "border-transparent",
    },
  };
  const cfg = configs[status] ?? configs.PENDING!;
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all",
        cfg.color,
        cfg.bg,
        cfg.border,
      )}
    >
      <Database className={cn("w-3 h-3", cfg.pulse && "animate-pulse")} />
      {status}
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge
      variant={active ? "default" : "secondary"}
      className={cn(
        "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg transition-all",
        active
          ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
          : "bg-muted text-muted-foreground border-transparent",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full mr-1.5 shadow-[0_0_8px_rgba(34,197,94,0.4)]",
          active ? "bg-green-500 animate-pulse" : "bg-muted-foreground",
        )}
      />
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}

function SubscriptionBadge({ tier, status }: { tier: string; status: string }) {
  const tierConfigs: Record<
    string,
    { color: string; bg: string; border: string }
  > = {
    FREE: {
      color: "text-muted-foreground",
      bg: "bg-muted/50",
      border: "border-transparent",
    },
    BASIC: {
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    PRO: {
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    ENTERPRISE: {
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  };

  const fallback = tierConfigs.FREE || {
    color: "text-muted-foreground",
    bg: "bg-muted/50",
    border: "border-transparent",
  };
  const config = tierConfigs[tier] || fallback;

  return (
    <div className="flex flex-col gap-1.5">
      <Badge
        className={cn(
          "font-black text-[10px] uppercase tracking-[0.1em] px-2.5 py-0.5 rounded-lg border h-6",
          config.color,
          config.bg,
          config.border,
          "hover:opacity-80 transition-opacity whitespace-nowrap",
        )}
      >
        {tier}
      </Badge>
      {status === "TRIAL" && (
        <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 px-1">
          Trialing
        </span>
      )}
    </div>
  );
}

export function TenantList({
  selectedIds,
  setSelectedIds,
  onActive,
  onDeactivate,
  isLoading,
  handleDelete,
  onInviteAdmin,
}: TenantListProps) {
  const { data: tenantsData } = useTenants();

  const allSelected =
    (tenantsData?.items?.length ?? 0) > 0 &&
    selectedIds.length === (tenantsData?.items?.length ?? 0);
  const someSelected =
    selectedIds.length > 0 &&
    selectedIds.length < (tenantsData?.items?.length ?? 0);

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tenantsData?.items.map((item) => item.id) ?? []);
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleToggleActiveStatus = (id: string, isActive: boolean) => {
    if (isActive) {
      onDeactivate(id);
    } else {
      onActive(id);
    }
  };

  if (!tenantsData?.items?.length) {
    return (
      <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-dashed border-border/50 p-16 text-center shadow-soft">
        <div className="size-20 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border/50">
          <Building className="size-10 text-muted-foreground/30" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No Tenants Found</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          We couldn&apos;t find any tenants matching your current filters. Try
          broadening your search parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-muted/30 border-b border-border/50">
          <tr>
            <th className="w-12 px-2 py-5 text-center">
              <div className="flex justify-center">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                  className={cn(
                    "rounded-md border-border/50 transition-all",
                    someSelected && "data-[state=checked]:bg-primary/50",
                  )}
                />
              </div>
            </th>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  "text-left text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em] px-4 py-5",
                  column.hideOnMobile && "hidden md:table-cell",
                )}
              >
                {column.header}
              </th>
            ))}
            <th className="w-20 px-4 py-5 text-right text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {tenantsData?.items.map((item) => (
            <tr
              key={item.id}
              className={cn(
                "group transition-all duration-300",
                "hover:bg-primary/[0.02]",
                selectedIds.includes(item.id)
                  ? "bg-primary/[0.04]"
                  : "hover:bg-muted/30",
              )}
            >
              <td className="px-2 py-4 text-center">
                <div className="flex justify-center">
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={() => handleSelectItem(item.id)}
                    aria-label={`Select item ${item.id}`}
                    className="rounded-md border-border/50 transition-all"
                  />
                </div>
              </td>
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={cn(
                    "px-4 py-4 align-middle",
                    column.hideOnMobile && "hidden md:table-cell",
                  )}
                >
                  {column.render ? column.render(item) : ""}
                </td>
              ))}
              <td className="px-4 py-4 text-right align-middle">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
                      disabled={isLoading}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-52 bg-card/90 backdrop-blur-xl border border-border/50 shadow-2xl z-50 rounded-2xl p-2 animate-in fade-in zoom-in-95 duration-200"
                  >
                    <DropdownMenuItem
                      className="cursor-pointer rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-primary/10 focus:text-primary"
                      asChild
                    >
                      <Link href={`/tenants/${item.id}`}>
                        <Eye className="h-4 w-4" />
                        <span>View Insights</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-primary/10 focus:text-primary"
                      asChild
                    >
                      <Link href={`/tenants/edit/${item.id}`}>
                        <Edit className="h-4 w-4" />
                        <span>Configure</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-primary/10 focus:text-primary"
                      onClick={() =>
                        onInviteAdmin && onInviteAdmin(item.id, item.name)
                      }
                    >
                      <UsersRound className="h-4 w-4" />
                      <span>Invite Admin</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50 my-1.5" />
                    <DropdownMenuItem
                      className="cursor-pointer rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-primary/10 focus:text-primary"
                      onClick={() =>
                        handleToggleActiveStatus(item.id, item.isActive)
                      }
                    >
                      {item.isActive ? (
                        <>
                          <ToggleLeft className="h-4 w-4 text-amber-500" />
                          <span>Suspend Tenant</span>
                        </>
                      ) : (
                        <>
                          <ToggleRight className="h-4 w-4 text-green-500" />
                          <span>Reactivate</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50 my-1.5" />
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive rounded-xl font-bold text-sm gap-2.5 p-2.5 transition-colors focus:bg-destructive/10"
                      onClick={() => handleDelete(item.id, item.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Purge Records</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
