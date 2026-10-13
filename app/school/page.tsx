import type { Metadata } from 'next';
import SchoolPortal from '@/components/portals/school/SchoolPortal';

export const metadata: Metadata = {
  title: 'Open School | Educación abierta',
  description: 'Explora Open School, LinguaForge y Manos Abiertas desde el universo Belentani.',
};

export default function SchoolPage() {
  return <main><a href="/" style={{ position: 'absolute', zIndex: 5, top: 16, left: 16, padding: '8px 12px', background: '#141024', color: '#f6ebdc' }}>← Universo Belentani</a><SchoolPortal /></main>;
}
