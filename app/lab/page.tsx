'use client';

import dynamic from 'next/dynamic';

const LabClient = dynamic(
  () => import('./LabClient').then((mod) => mod.default),
  { ssr: false }
);

export default function LabPage() {
  return <LabClient />;
}