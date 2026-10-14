import type { Metadata } from 'next';
import NoiacoreConsultancy from '@/components/noiacore/NoiacoreConsultancy';

export const metadata: Metadata = {
  title: 'NOIACORE Consultoria | Belentani Agency',
  description: 'Consultoria premium de IA, SaaS, terminales y sistemas noir de Pedro Belentani.',
};

export default function AgencyPage() {
  return <NoiacoreConsultancy entry="agency" />;
}
