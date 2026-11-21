import type { Metadata } from 'next';
import HomeClient from './home-client';

export const metadata: Metadata = { alternates: { canonical: '/' } };

export const dynamic = 'force-dynamic';

export default function Home() {
  return <HomeClient />;
}
