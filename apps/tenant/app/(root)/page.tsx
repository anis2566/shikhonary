import BatchesView from "@/modules/batch/ui/views/batches-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export default function Page() {
  return (
    <div className="min-h-screen">
      <DashboardHeader title="Dashboard" subtitle="Welcome to your dashboard" />
      <BatchesView />
    </div>
  );
}
