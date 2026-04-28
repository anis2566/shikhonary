"use client";

import { TenantTypes } from "@workspace/db";
import { EditAdmissionPaymentForm } from "./desktop/edit-admission-payment-form";

interface AdmissionPaymentEditFormProps {
  payment: TenantTypes.AdmissionPayment;
}

export const AdmissionPaymentEditForm = ({
  payment,
}: AdmissionPaymentEditFormProps) => {
  return (
    <>
      {/* Mobile view could be added here later */}
      <div className="hidden md:block">
        <EditAdmissionPaymentForm payment={payment} />
      </div>

      {/* Mobile view placeholder */}
      <div className="md:hidden">
        <EditAdmissionPaymentForm payment={payment} />
      </div>
    </>
  );
};
