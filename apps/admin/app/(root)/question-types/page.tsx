import { Metadata } from "next";
import { SearchParams } from "nuqs";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { QuestionTypesView } from "@/modules/question-type/ui/views/question-types-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { questionTypeLoader } from "@workspace/api-client/filters-server";

export const metadata: Metadata = {
  title: "Question Types",
  description: "Manage different categories of questions",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const QuestionTypes = async ({ searchParams }: Props) => {
  const filters = await questionTypeLoader(searchParams);

  prefetch(trpc.questionType.getStats.queryOptions());
  prefetch(trpc.questionType.list.queryOptions(filters));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Question Types"
          subtitle="Manage and categorize questions"
        />
        <QuestionTypesView />
      </div>
    </HydrateClient>
  );
};

export default QuestionTypes;
