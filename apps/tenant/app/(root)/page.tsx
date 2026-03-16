import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { ShikhonaryLoader } from "@workspace/ui/shared/shikhonary-loader";

export default async function Page() {
  return (
    <div className="min-h-screen">
      <DashboardHeader title="Dashboard" subtitle="Welcome to your dashboard" />
      <ShikhonaryLoader />
    </div>
  );
}
