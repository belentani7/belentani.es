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
  travelTo: (id) => set((s) => !galaxySystems.some(system => system.id === id) || s.current === id ? s : ({ current: id, history: [...s.history.slice(-49), id] })),
  goBack: () => set((s) => { if (s.history.length < 2) return s; const h = s.history.slice(0, -1); return { current: h[h.length - 1], history: h }; }),
}));
