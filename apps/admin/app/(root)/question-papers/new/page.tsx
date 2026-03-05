import { Metadata } from "next";
import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { NewQuestionPaperView } from "@/modules/question-paper-builder/ui/views/new-question-paper-view";

export const metadata: Metadata = {
  title: "New Question Paper",
  description: "Create a new question paper",
};

const NewQuestionPaperPage = async () => {
  // Pre-fetch subjects, classes for the form selects
  prefetch(trpc.academicSubject.forSelection.queryOptions({}));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <Suspense>
          <NewQuestionPaperView />
        </Suspense>
      </div>
    </HydrateClient>
  );
};

export default NewQuestionPaperPage;
