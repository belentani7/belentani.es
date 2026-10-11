'use client';
import { useCallback, useMemo } from 'react';
import { useGalaxyStore } from '@/store/galaxy';
import { galaxySystems, galaxyRoutes, type GalaxySystem } from '@/lib/galaxy-data';

const ORDER = galaxySystems.map((s) => s.id);

function neighborsOf(current: string): string[] {
  const set = new Set<string>();
  for (const [a, b] of galaxyRoutes) {
    if (a === current) set.add(b);
    if (b === current) set.add(a);
  }
  return [...set];
}

export interface GalaxyMapApi {
  current: string;
  travelTo: (id: string) => void;
  allSystems: GalaxySystem[];
  neighbors: string[];
  navigate: (dir: 'next' | 'prev') => void;
}

export function useGalaxyMap(): GalaxyMapApi {
  const current = useGalaxyStore((s) => s.current);
  const travelTo = useGalaxyStore((s) => s.travelTo);

  const neighbors = useMemo(() => neighborsOf(current), [current]);

  const navigate = useCallback(
    (dir: 'next' | 'prev') => {
      const idx = ORDER.indexOf(current);
      if (idx === -1) return;
      const nextIdx =
        dir === 'next'
          ? (idx + 1) % ORDER.length
          : (idx - 1 + ORDER.length) % ORDER.length;
      travelTo(ORDER[nextIdx]);
    },
    [current, travelTo]
  );

  return { current, travelTo, allSystems: galaxySystems, neighbors, navigate };
}
