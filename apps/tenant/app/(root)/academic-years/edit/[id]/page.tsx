import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { EditAcademicYearView } from "@/modules/academic-year/ui/views/edit-academic-year-view";

export const metadata: Metadata = {
  title: "Edit Academic Year",
  description: "Edit academic year details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditAcademicYear = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.academicYear.getById.queryOptions(id));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <EditAcademicYearView academicYearId={id} />
      </div>
    </HydrateClient>
  );
};

export default EditAcademicYear;
