import { create } from "zustand";

interface MonthlyFeeData {
  academicYearId: string;
  academicClassId: string;
  amount: number;
}

interface EditMonthlyFeeModalStore {
  isOpen: boolean;
  monthlyFeeId: string | null;
  initialData: MonthlyFeeData | null;
  onOpen: (monthlyFeeId: string, initialData: MonthlyFeeData) => void;
  onClose: () => void;
}

export const useEditMonthlyFeeModal = create<EditMonthlyFeeModalStore>((set) => ({
  isOpen: false,
  monthlyFeeId: null,
  initialData: null,
  onOpen: (monthlyFeeId, initialData) => set({ isOpen: true, monthlyFeeId, initialData }),
  onClose: () => set({ isOpen: false, monthlyFeeId: null, initialData: null }),
}));
