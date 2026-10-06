import { create } from 'zustand';

export type Era = 'judas-era' | 'belentani-artist' | 'future-era';
export type System = 'belentani-core' | 'judas-canon' | 'cosmos-hud' | 'artist-bio';
interface ExperienceState {
  currentEra: Era;
  currentSystem: System;
  history: { era: Era; system: System }[];
  isImmersiveMode: boolean;
  travelTo: (era: Era, system: System) => void;
  goBack: () => void;
  toggleImmersiveMode: () => void;
  resetToCanon: () => void;
}
const canon = { era: 'judas-era' as Era, system: 'judas-canon' as System };
export const useExperienceStore = create<ExperienceState>((set) => ({
  currentEra: canon.era,
  currentSystem: canon.system,
  history: [canon],
  isImmersiveMode: false,
  travelTo: (era, system) => set((state) => state.currentEra === era && state.currentSystem === system ? state : ({
    currentEra: era, currentSystem: system, history: [...state.history.slice(-49), { era, system }],
  })),
  goBack: () => set((state) => {
    if (state.history.length < 2) return state;
    const history = state.history.slice(0, -1);
    const previous = history[history.length - 1];
    return { history, currentEra: previous.era, currentSystem: previous.system };
  }),
  toggleImmersiveMode: () => set((state) => ({ isImmersiveMode: !state.isImmersiveMode })),
  resetToCanon: () => set({ currentEra: canon.era, currentSystem: canon.system, history: [canon], isImmersiveMode: false }),
}));
