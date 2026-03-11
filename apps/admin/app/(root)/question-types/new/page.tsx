import { Metadata } from "next";

import { HydrateClient } from "@/trpc/server";

import { NewQuestionTypeView } from "@/modules/question-type/ui/views/new-question-type-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";

export const metadata: Metadata = {
  title: "New Question Type",
  description: "New Question Type",
};

const NewQuestionType = () => {
  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="New Question Type"
          subtitle="Create a new question type"
        />
        <NewQuestionTypeView />
      </div>
    </HydrateClient>
  );
};

export default NewQuestionType;
