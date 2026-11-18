import type { Metadata } from 'next';
import DuckPortal from '@/components/portals/duck/DuckPortal';

export const metadata: Metadata = {
  title: 'DUCK STUDIO | Producción musical',
  description: 'Producción musical, beat sequencer y catálogo de DUCK STUDIO.',
};

export const dynamic = 'force-dynamic';

export default function DuckPage() {
  return <DuckPortal />;
}
