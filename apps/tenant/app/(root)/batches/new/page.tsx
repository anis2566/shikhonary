import { Metadata } from "next";

import { HydrateClient } from "@/trpc/server";

import { NewBatchView } from "@/modules/batch/ui/views/new-batch-view";

export const metadata: Metadata = {
  title: "New Batch",
  description: "New Batch",
};

const NewBatch = async () => {
  return (
    <HydrateClient>
      <NewBatchView />
    </HydrateClient>
  );
};

export default NewBatch;
