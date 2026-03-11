import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { EditQuestionPaperView } from "@/modules/question-paper-builder/ui/views/edit-question-paper-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "Edit Question Paper",
  description: "Form to edit an existing Question Paper",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditQuestionPaper = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.questionPaper.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Edit Question Paper"
          subtitle="Customize your exam document"
        />
        <EditQuestionPaperView paperId={id} />
      </div>
    </HydrateClient>
  );
};

export default EditQuestionPaper;
