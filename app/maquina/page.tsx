import type { Metadata } from 'next';
import ConsciousMachine from '@/components/machine/ConsciousMachine';

export const metadata: Metadata = {
  title: 'ANTIGRAVITY · ALIVE MACHINE — BELENTANI',
  description: 'Terminal narrativa interactiva de BELENTANI: el Eco, las Cuerdas, la galaxia guardada y el atlas de mundos.',
  alternates: { canonical: '/maquina' },
};

/** Terminal narrativa, atlas y mito interactivo. */
export default function MaquinaPage() {
  return <ConsciousMachine />;
}
