import { create } from "zustand";

interface EditCounterModalState {
  isOpen: boolean;
  counterId: string | null;
  initialData: {
    academicYearId: string;
    academicClassId: string;
    name: string;
    value: number;
  };
  onOpen: (
    counterId: string,
    initialData: {
      academicYearId: string;
      academicClassId: string;
      name: string;
      value: number;
    },
  ) => void;
  onClose: () => void;
}

export const useEditCounterModal = create<EditCounterModalState>((set) => ({
  isOpen: false,
  counterId: null,
  initialData: {
    academicYearId: "",
    academicClassId: "",
    name: "",
    value: 0,
  },
  onOpen: (counterId, initialData) =>
    set({
      isOpen: true,
      counterId,
      initialData,
    }),
  onClose: () =>
    set({
      isOpen: false,
      counterId: null,
      initialData: {
        academicYearId: "",
        academicClassId: "",
        name: "",
        value: 0,
      },
    }),
}));
