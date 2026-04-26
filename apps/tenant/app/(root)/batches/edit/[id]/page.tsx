import { Metadata } from "next";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { EditBatchView } from "@/modules/batch/ui/views/edit-batch-view";

export const metadata: Metadata = {
  title: "Edit Batch",
  description: "Edit batch details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditBatch = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.batch.getById.queryOptions(id));

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <EditBatchView batchId={id} />
      </div>
    </HydrateClient>
  );
};

export default EditBatch;
