'use client';
import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function getInitial(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(QUERY).matches;
}

/**
 * Reactive, SSR-safe indicator of the user's `prefers-reduced-motion` setting.
 * Returns `false` on the server and updates on client mount + change events.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia(QUERY);
    setReduced(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
