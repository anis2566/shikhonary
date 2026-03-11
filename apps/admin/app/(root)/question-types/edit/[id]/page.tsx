import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { EditQuestionTypeView } from "@/modules/question-type/ui/views/edit-question-type-view";

export const metadata: Metadata = {
  title: "Edit Question Type",
  description: "Form to edit an existing question type",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditQuestionType = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.questionType.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Edit Question Type"
          subtitle="Customize question type"
        />
        <EditQuestionTypeView id={id} />
      </div>
    </HydrateClient>
  );
};

export default EditQuestionType;
