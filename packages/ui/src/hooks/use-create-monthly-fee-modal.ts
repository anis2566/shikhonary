import { create } from "zustand";

interface CreateMonthlyFeeModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreateMonthlyFeeModal = create<CreateMonthlyFeeModalStore>(
  (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  }),
);
