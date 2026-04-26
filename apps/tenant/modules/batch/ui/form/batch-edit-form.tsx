"use client";

import { EditBatchForm } from "./desktop/edit-batch-form";
import { TenantTypes } from "@workspace/db";
import { MobileEditBatchForm } from "./mobile/edit-batch-form";

interface BatchEditFormProps {
  batch: TenantTypes.Batch;
}

export const BatchEditForm = ({ batch }: BatchEditFormProps) => {
  return (
    <>
      <div className="md:hidden">
        <MobileEditBatchForm batch={batch} />
      </div>

      <div className="hidden md:block">
        <EditBatchForm batch={batch} />
      </div>
    </>
  );
};
