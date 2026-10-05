import { useGalaxyStore } from '@/store/galaxy';
import { galaxySystems, galaxyRoutes } from '@/lib/galaxy-data';

export function useGalaxyMap() {
  const { current, history, travelTo, goBack } = useGalaxyStore();
  const currentSystem = galaxySystems.find((s) => s.id === current);
  const order = galaxySystems.map((s) => s.id);

  const navigate = (direction: 'next' | 'prev') => {
    const i = order.indexOf(current);
    if (i < 0) return;
    const next = direction === 'next'
      ? order[(i + 1) % order.length]
      : order[(i - 1 + order.length) % order.length];
    travelTo(next);
  };

  const neighbors = galaxyRoutes
    .filter(([a, b]) => a === current || b === current)
    .map(([a, b]) => (a === current ? b : a))
    .map((id) => galaxySystems.find((s) => s.id === id))
    .filter(Boolean);

  return {
    current,
    currentSystem,
    history,
    travelTo,
    goBack,
    navigate,
    neighbors,
    allSystems: galaxySystems,
  };
}