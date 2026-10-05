import { create } from 'zustand';
import { galaxySystems } from '@/lib/galaxy-data';

interface GalaxyState {
  current: string;
  history: string[];
  travelTo: (id: string) => void;
  goBack: () => void;
}

export const useGalaxyStore = create<GalaxyState>((set) => ({
  current: 'belentani',
  history: ['belentani'],
  travelTo: (id) => set((s) => ({ current: id, history: [...s.history, id] })),
  goBack: () => set((s) => { const h = [...s.history]; h.pop(); return { current: h[h.length - 1], history: h }; }),
}));