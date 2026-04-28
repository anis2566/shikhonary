export enum ADMISSION_PAYMENT_STATUS {
  PENDING = "pending",
  PAID = "paid",
  PARTIALLY_PAID = "partiallyPaid",
  UNPAID = "unpaid",
}

export enum ADMISSION_PAYMENT_METHOD {
  CASH = "cash",
  CARD = "card",
  BANK_TRANSFER = "bankTransfer",
  CHEQUE = "cheque",
  ONLINE = "online",
}

export const admissionPaymentMethods = Object.values(
  ADMISSION_PAYMENT_METHOD,
).map((item) => ({ value: item, label: item }));
export const admissionPaymentStatuses = Object.values(
  ADMISSION_PAYMENT_STATUS,
).map((item) => ({ value: item, label: item }));
