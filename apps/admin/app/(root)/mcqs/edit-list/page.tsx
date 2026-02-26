import { Metadata } from "next";
import { SearchParams } from "nuqs";
import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { EditMcqInlineView } from "@/modules/mcq/ui/views/edit-mcq-inline-view";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { mcqLoader } from "@workspace/api-client/filters-server";

export const metadata: Metadata = {
  title: "Edit MCQs",
  description: "Browse and inline-edit your MCQ question bank",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const EditMcqsPage = async ({ searchParams }: Props) => {
  const params = await mcqLoader(searchParams);

  prefetch(trpc.mcq.list.queryOptions(params));
  prefetch(trpc.mcq.getStats.queryOptions({}));
  prefetch(trpc.academicSubject.forSelection.queryOptions({}));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <DashboardHeader
          title="Edit MCQs"
          subtitle="Browse and inline-edit — double-click any field to modify"
        />
        <Suspense>
          <EditMcqInlineView />
        </Suspense>
      </div>
    </HydrateClient>
  );
};

export default EditMcqsPage;
