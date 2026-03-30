import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { EditAcademicYearView } from "@/modules/academic-year/ui/views/edit-academic-year-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "Edit Academic Year",
  description: "Form to edit an existing Academic Year",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditAcademicYear = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.academicYear.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Edit Academic Year"
          subtitle="Customize academic year"
        />
        <EditAcademicYearView academicYearId={id} />
      </div>
    </HydrateClient>
  );
};

export default EditAcademicYear;
