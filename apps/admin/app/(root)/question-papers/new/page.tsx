import { Metadata } from "next";

import { HydrateClient } from "@/trpc/server";

import { NewQuestionPaperView } from "@/modules/question-paper-builder/ui/views/new-question-paper-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "New Question Paper",
  description: "New Question Paper",
};

const NewQuestionPaper = () => {
  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="New Question Paper"
          subtitle="Create a new question paper"
        />
        <NewQuestionPaperView />
      </div>
    </HydrateClient>
  );
};

export default NewQuestionPaper;
