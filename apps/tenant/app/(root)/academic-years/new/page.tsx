import { Metadata } from "next";

import { HydrateClient } from "@/trpc/server";

import { NewAcademicYearView } from "@/modules/academic-year/ui/views/new-academic-year-view";

export const metadata: Metadata = {
  title: "New Academic Year",
  description: "New Academic Year",
};

const NewAcademicYear = async () => {
  return (
    <HydrateClient>
      <NewAcademicYearView />
    </HydrateClient>
  );
};

export default NewAcademicYear;
