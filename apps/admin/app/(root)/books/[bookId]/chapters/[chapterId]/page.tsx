import { Metadata } from "next";
import { Suspense } from "react";
import { HydrateClient } from "@/trpc/server";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { ChapterContentView } from "@/modules/book/ui/views/chapter-content-view";

export const metadata: Metadata = {
  title: "Chapter Content",
  description: "Browse and edit extracted content blocks",
};

const ChapterPage = () => (
  <HydrateClient>
    <div className="min-h-screen">
      <DashboardHeader
        title="Chapter Content"
        subtitle="Digital Textbook Reader · inline editing"
      />
      <Suspense>
        <ChapterContentView />
      </Suspense>
    </div>
  </HydrateClient>
);

export default ChapterPage;
