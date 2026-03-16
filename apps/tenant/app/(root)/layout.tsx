import { DashboardLayout } from "@/modules/layout/ui/layout/dashboard-layout";
import { getTenantContext } from "@workspace/auth";
import { headers } from "next/headers";
import { AlertCircle } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

interface RootLayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: RootLayoutProps) => {
  const reqHeaders = await headers();
  const context = await getTenantContext(reqHeaders);

  // No tenant or active membership found
  if (!context?.tenant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">No Active Organization</h1>
        <p className="text-muted-foreground max-w-sm mb-6">
          You don&apos;t have an active membership to any organization, or your access has been revoked. 
          Please contact support.
        </p>
        <Link href="/auth/sign-in">
          <Button variant="default">Return to Sign In</Button>
        </Link>
      </div>
    );
  }

  // Tenant exists but is deactivated or suspended
  if (!context.tenant.isActive || context.tenant.isSuspended) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Organization Unavailable</h1>
        <p className="text-muted-foreground max-w-sm mb-6">
          The organization &quot;{context.tenant.name}&quot; is currently inactive or has been suspended.
        </p>
        <Link href="/auth/sign-in">
          <Button variant="default">Return to Sign In</Button>
        </Link>
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
