import { create } from "zustand";

interface EditAdmissionFeeModalState {
  isOpen: boolean;
  admissionFeeId: string | null;
  initialData: {
    academicYearId: string;
    academicClassId: string;
    amount: number;
  };
  onOpen: (
    admissionFeeId: string,
    initialData: {
      academicYearId: string;
      academicClassId: string;
      amount: number;
    },
  ) => void;
  onClose: () => void;
}

export const useEditAdmissionFeeModal = create<EditAdmissionFeeModalState>((set) => ({
  isOpen: false,
  admissionFeeId: null,
  initialData: {
    academicYearId: "",
    academicClassId: "",
    amount: 0,
  },
  onOpen: (admissionFeeId, initialData) =>
    set({
      isOpen: true,
      admissionFeeId,
      initialData,
    }),
  onClose: () =>
    set({
      isOpen: false,
      admissionFeeId: null,
      initialData: {
        academicYearId: "",
        academicClassId: "",
        amount: 0,
      },
    }),
}));
