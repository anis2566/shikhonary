import { Metadata } from "next";
import { SearchParams } from "nuqs";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { AcademicYearsView } from "@/modules/academic-year/ui/views/academic-years-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { academicYearLoader } from "@workspace/api-client/filters-server";

export const metadata: Metadata = {
  title: "Academic-Years",
  description: "Academic-Years",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const AcademicYears = async ({ searchParams }: Props) => {
  const params = await academicYearLoader(searchParams);

  prefetch(trpc.academicYear.getStats.queryOptions());
  prefetch(trpc.academicYear.list.queryOptions(params));

  return (
    <HydrateClient>
      <DashboardHeader
        title="Academic-Years"
        subtitle="Manage academic-years"
      />
      <AcademicYearsView />
    </HydrateClient>
  );
};

export default AcademicYears;
