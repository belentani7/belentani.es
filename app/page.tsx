import type { Metadata } from 'next';
import LegacyHub from '@/components/legacy/LegacyHub';

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default function Home() {
  return <LegacyHub />;
}
