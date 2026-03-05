import { Metadata } from "next";
import { Suspense } from "react";
import { HydrateClient } from "@/trpc/server";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { BookDetailView } from "@/modules/book/ui/views/book-detail-view";

export const metadata: Metadata = {
  title: "Book Details",
};

const BookDetailPage = () => (
  <HydrateClient>
    <div className="min-h-screen">
      <DashboardHeader
        title="Book Details"
        subtitle="Chapters &amp; extraction progress"
      />
      <Suspense>
        <BookDetailView />
      </Suspense>
    </div>
  </HydrateClient>
);

export default BookDetailPage;
