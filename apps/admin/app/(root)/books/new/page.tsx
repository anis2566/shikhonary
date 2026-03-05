import { Metadata } from "next";
import DashboardHeader from "@/modules/layout/ui/layout/dashboard-header";
import { BookUploadView } from "@/modules/book/ui/views/book-upload-view";

export const metadata: Metadata = {
  title: "Upload PDF",
  description: "Upload an NCTB PDF to start the AI extraction pipeline",
};

const BookUploadPage = () => (
  <div className="min-h-screen">
    <DashboardHeader
      title="Upload Textbook PDF"
      subtitle="Powered by Gemini · Inngest pipeline"
    />
    <BookUploadView />
  </div>
);

export default BookUploadPage;
