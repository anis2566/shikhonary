import { Metadata } from "next";
import { Suspense } from "react";
import { HydrateClient } from "@/trpc/server";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { BooksListView } from "@/modules/book/ui/views/books-list-view";

export const metadata: Metadata = {
  title: "Digital Library",
  description: "Manage uploaded NCTB textbooks and extraction jobs",
};

const BooksPage = () => (
  <HydrateClient>
    <div className="min-h-screen">
      <DashboardHeader
        title="Digital Library"
        subtitle="NCTB textbooks · PDF extraction pipeline"
      />
      <Suspense>
        <BooksListView />
      </Suspense>
    </div>
  </HydrateClient>
);

export default BooksPage;
