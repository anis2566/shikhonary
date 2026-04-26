import { create } from "zustand";

export type DeleteEntityType =
  | "user"
  | "class"
  | "subject"
  | "chapter"
  | "topic"
  | "subtopic"
  | "mcq"
  | "tenant"
  | "subscriptionPlan"
  | "subscription"
  | "mcq"
  | "academicYear"
  | "batch"
  | "counter"
  | "admissionFee"
  | "monthlyFee"
  | "student";

interface DeleteModalState {
  isOpen: boolean;
  entityId: string | null;
  entityType: DeleteEntityType | null;
  entityName: string | null;
  onConfirmCallback: ((id: string) => void) | null;
  openDeleteModal: (params: {
    entityId: string;
    entityType: DeleteEntityType;
    entityName?: string;
    onConfirm?: (id: string) => void;
  }) => void;
  closeDeleteModal: () => void;
}

export const useDeleteModal = create<DeleteModalState>((set) => ({
  isOpen: false,
  entityId: null,
  entityType: null,
  entityName: null,
  onConfirmCallback: null,
  openDeleteModal: ({ entityId, entityType, entityName, onConfirm }) =>
    set({
      isOpen: true,
      entityId,
      entityType,
      entityName: entityName || null,
      onConfirmCallback: onConfirm || null,
    }),
  closeDeleteModal: () =>
    set({
      isOpen: false,
      entityId: null,
      entityType: null,
      entityName: null,
      onConfirmCallback: null,
    }),
}));
