"use client";

import React from "react";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const CQSkeleton = () => {
  return (
    <>
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="bg-card/30 border border-border/50 rounded-[2.5rem] p-8 space-y-6"
          >
            <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-xl" />
                <Skeleton className="h-6 w-20 rounded-xl" />
            </div>
            <Skeleton className="h-24 w-full rounded-3xl" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </div>
        ))}
    </>
  );
};
