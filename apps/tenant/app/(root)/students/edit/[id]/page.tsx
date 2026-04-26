import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { EditStudentView } from "@/modules/student/ui/views/edit-student-view";

export const metadata: Metadata = {
  title: "Edit Student",
  description: "Edit student profile and details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditStudentPage = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.student.getById.queryOptions(id));

  return (
    <HydrateClient>
      <div className="min-h-screen bg-[#F8FAFC]">
        <EditStudentView studentId={id} />
      </div>
    </HydrateClient>
  );
};

export default EditStudentPage;
