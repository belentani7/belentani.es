import type { Metadata } from 'next';
import NoiacoreConsultancy from '@/components/noiacore/NoiacoreConsultancy';

export const metadata: Metadata = {
  title: 'NOIACORE | Creative Intelligence Lab',
  description: 'Creative Intelligence Lab de Pedro Belentani: consultoria de IA, terminal, SaaS y diseño de sistemas.',
  alternates: { canonical: '/noiacore' },
};

export default function NoiacorePage() {
  return <NoiacoreConsultancy entry="noiacore" />;
}
