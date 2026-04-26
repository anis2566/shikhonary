import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { StudentView } from "@/modules/student/ui/views/student-view";

export const metadata: Metadata = {
  title: "Student Profile",
  description: "Student profile details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const StudentProfilePage = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.student.getDetails.queryOptions(id));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <StudentView id={id} />
      </div>
    </HydrateClient>
  );
};

export default StudentProfilePage;
