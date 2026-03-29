import { headers } from "next/headers";

import { DashboardLayout } from "@/modules/layout/ui/layout/dashboard-layout";
import { TenantStatusScreen } from "@/modules/layout/ui/components/tenant-status-screen";
import { getTenantContext } from "@workspace/auth";

interface RootLayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: RootLayoutProps) => {
  const reqHeaders = await headers();
  const context = await getTenantContext(reqHeaders);

  // No session or no membership found
  if (!context?.tenant) {
    return <TenantStatusScreen type="no-membership" />;
  }

  // Tenant is suspended — highest priority
  if (context.tenant.isSuspended) {
    return (
      <TenantStatusScreen type="suspended" tenantName={context.tenant.name} />
    );
  }

  // Tenant exists but has been deactivated by an admin
  if (!context.tenant.isActive) {
    return (
      <TenantStatusScreen type="inactive" tenantName={context.tenant.name} />
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
