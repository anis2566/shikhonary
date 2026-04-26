import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { BatchView } from "@/modules/batch/ui/views/batch-view";

export const metadata: Metadata = {
  title: "Batch Details",
  description: "Batch details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const BatchDetails = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.batch.getDetails.queryOptions(id));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <BatchView id={id} />
      </div>
    </HydrateClient>
  );
};

export default BatchDetails;
