import { Metadata } from "next";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { BatchesView } from "@/modules/batch/ui/views/batches-view";

export const metadata: Metadata = {
  title: "Batches",
  description: "Batches",
};

const Batches = async () => {
  prefetch(trpc.batch.getStats.queryOptions());

  return (
    <HydrateClient>
      <BatchesView />
    </HydrateClient>
  );
};

export default Batches;
