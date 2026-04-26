import { Metadata } from "next";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { StudentsView } from "@/modules/student/ui/views/students-view";

export const metadata: Metadata = {
  title: "Students",
  description: "Students",
};

const Students = async () => {
  prefetch(trpc.student.getStats.queryOptions());

  return (
    <HydrateClient>
      <StudentsView />
    </HydrateClient>
  );
};

export default Students;
