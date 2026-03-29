import { Suspense } from "react";
import { AcceptInvitationView } from "@/modules/invitation/ui/views/accept-invitation-view";

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading validation...</div>}>
      <AcceptInvitationView />
    </Suspense>
  );
}
