import { Metadata } from "next";
import { HydrateClient } from "@/trpc/server";

import { CQResourceView } from "@/modules/question-paper-builder/ui/views/cq-resource-view";

export const metadata: Metadata = {
  title: "CQ Resource",
  description: "CQ Resource",
};

interface Props {
  params: Promise<{ id: string; questionTypeId: string }>;
  searchParams: Promise<{ subjectId: string; distributionId: string }>;
}

const CQResource = async ({ params, searchParams }: Props) => {
  const { questionTypeId } = await params;
  const { subjectId, distributionId } = await searchParams;

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <CQResourceView
          questionTypeId={questionTypeId}
          subjectId={subjectId}
          distributionId={distributionId}
        />
      </div>
    </HydrateClient>
  );
};

export default CQResource;
