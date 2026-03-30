import { Metadata } from "next";

import { HydrateClient } from "@/trpc/server";

import { CreateAcademicYearView } from "@/modules/academic-year/ui/views/create-academic-year-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "New Academic Year",
  description: "New Academic Year",
};

const NewAcademicYear = () => {
  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="New Academic Year"
          subtitle="Create a new academic year"
        />
        <CreateAcademicYearView />
      </div>
    </HydrateClient>
  );
};

export default NewAcademicYear;
