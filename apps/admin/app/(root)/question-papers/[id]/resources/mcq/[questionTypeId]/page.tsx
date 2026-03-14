import { Metadata } from "next";
import { HydrateClient } from "@/trpc/server";

import { MCQResourceView } from "@/modules/question-paper-builder/ui/views/mcq-resource-view";

export const metadata: Metadata = {
  title: "MCq Resource",
  description: "MCq Resource",
};

interface Props {
  params: Promise<{ questionTypeId: string }>;
  searchParams: Promise<{ subjectId: string; distributionId: string }>;
}

const MCQResource = async ({ params, searchParams }: Props) => {
  const { questionTypeId } = await params;
  const { subjectId, distributionId } = await searchParams;

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <MCQResourceView
          questionTypeId={questionTypeId}
          subjectId={subjectId}
          distributionId={distributionId}
        />
      </div>
    </HydrateClient>
  );
};

export default MCQResource;
