'use client';

import dynamic from 'next/dynamic';

const AiLabClient = dynamic(
  () => import('./AiLabClient').then((mod) => mod.default),
  { ssr: false }
);

export default function AiLabPage() {
  return <AiLabClient />;
}