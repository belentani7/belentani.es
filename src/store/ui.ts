import { create } from 'zustand';

interface ModalContent {
  type: string;
  subtitle?: string;
  content: React.ReactNode;
}

interface UIState {
  modalOpen: boolean;
  modalContent: ModalContent | null;
  openModal: (content: ModalContent) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  modalOpen: false,
  modalContent: null,
  openModal: (content) => set({ modalOpen: true, modalContent: content }),
  closeModal: () => set({ modalOpen: false, modalContent: null }),
}));