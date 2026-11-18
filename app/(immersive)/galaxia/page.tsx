import GalaxyVoyage from '@/components/voyage/GalaxyVoyage';

export const metadata = {
  alternates: { canonical: '/galaxia' },
  title: 'Galaxia navegable | BELENTANI',
  description: 'Recorre la galaxia de JUDAS, la música y los mundos de Pedro Belentani.',
};

export const dynamic = 'force-dynamic';

export default function GalaxiaPage() {
  return <GalaxyVoyage />;
}
