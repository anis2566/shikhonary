import { create } from "zustand";

interface CreateAdmissionFeeModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreateAdmissionFeeModal = create<CreateAdmissionFeeModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
