import { Metadata } from "next";
import { SearchParams } from "nuqs";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { AcademicYearListView } from "@/modules/academic-year/ui/views/academic-year-list-view";
import { academicYearLoader } from "@workspace/api-client/filters-server";

export const metadata: Metadata = {
  title: "Academic Years",
  description: "Academic Years",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const AcademicYears = async ({ searchParams }: Props) => {
  const params = await academicYearLoader(searchParams);

  prefetch(trpc.academicYear.getTimeline.queryOptions());
  prefetch(trpc.academicYear.list.queryOptions(params));

  return (
    <HydrateClient>
      <AcademicYearListView />
    </HydrateClient>
  );
};

export default AcademicYears;
