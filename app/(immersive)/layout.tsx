'use client';
import { Providers } from '@/components/Providers';
import { useEffect } from 'react';

export default function ImmersiveLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-expect-error - webkitAudioContext exists in some browsers
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
    }
  }, []);
  return (
    <Providers>
      {children}
    </Providers>
  );
}
