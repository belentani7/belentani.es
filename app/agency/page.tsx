import type { Metadata } from 'next';
import AgencyPortal from '@/components/portals/agency/AgencyPortal';

export const metadata: Metadata = {
  title: 'Belentani Agency | IA y Trust & Safety',
  description: 'Arquitectura de agentes, Trust & Safety y evidencia de decisiones de Belentani Agency.',
};

export default function AgencyPage() {
  return <AgencyPortal />;
}
