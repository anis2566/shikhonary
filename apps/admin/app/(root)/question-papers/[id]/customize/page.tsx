import { Metadata } from "next";
import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { QuestionPaperBuilderView } from "@/modules/question-paper-builder/ui/views/question-paper-builder-view";

export const metadata: Metadata = {
  title: "Question Paper Builder",
  description: "Build and customize your question paper",
};

interface Props {
  params: Promise<{ id: string }>;
}

const QuestionPaperBuilderPage = async ({ params }: Props) => {
  const { id } = await params;

  // Pre-fetch the paper (with MCQs attached) and the MCQ bank for the picker
  prefetch(trpc.questionPaper.getById.queryOptions({ id }));
  prefetch(
    trpc.mcq.list.queryOptions({ page: 1, limit: 50, sortOrder: "desc" }),
  );
  prefetch(trpc.academicSubject.forSelection.queryOptions({}));

  return (
    <HydrateClient>
      <Suspense>
        <QuestionPaperBuilderView paperId={id} />
      </Suspense>
    </HydrateClient>
  );
};

export default QuestionPaperBuilderPage;
