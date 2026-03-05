import { Metadata } from "next";
import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { QuestionPapersView } from "@/modules/question-paper-builder/ui/views/question-papers-view";

export const metadata: Metadata = {
  title: "Question Papers",
  description: "Create and manage your question papers",
};

const QuestionPapersPage = async () => {
  prefetch(trpc.questionPaper.list.queryOptions({ page: 1, limit: 20 }));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Question Papers"
          subtitle="Build, manage and export question papers"
        />
        <Suspense>
          <QuestionPapersView />
        </Suspense>
      </div>
    </HydrateClient>
  );
};

export default QuestionPapersPage;
