import { EditAdmissionPaymentView } from "@/modules/admission-payment/ui/views/edit-admission-payment-view";

interface EditAdmissionPaymentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAdmissionPaymentPage({
  params,
}: EditAdmissionPaymentPageProps) {
  const { id } = await params;

  return <EditAdmissionPaymentView paymentId={id} />;
}
