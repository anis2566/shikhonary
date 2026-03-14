"use client";

import React from "react";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const MCQSkeleton = () => {
  return (
    <>
      {Array(9)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="bg-card/30 border border-border/50 rounded-[2rem] p-6 space-y-4"
          >
            <Skeleton className="h-4 w-3/4 rounded-full" />
            <Skeleton className="h-4 w-1/2 rounded-full" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-8 rounded-xl" />
              <Skeleton className="h-8 rounded-xl" />
            </div>
            <Skeleton className="h-10 w-full rounded-2xl" />
          </div>
        ))}
    </>
  );
};
