"use client";

import { NewBatchForm } from "./desktop/new-batch-form";
import { MobileNewBatchForm } from "./mobile/new-batch-form";

export const BatchForm = () => {
  return (
    <>
      <div className="md:hidden">
        <MobileNewBatchForm />
      </div>

      <div className="hidden md:block">
        <NewBatchForm />
      </div>
    </>
  );
};
