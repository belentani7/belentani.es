'use client';

import { useTranslation } from '@/lib/i18n';
import GalaxyVoyage from '@/components/voyage/GalaxyVoyage';

export default function HomeClient() {
  const { t } = useTranslation();
  return (
    <>
      <GalaxyVoyage />
      <section className="pt-20 pb-32 px-6 lg:px-12">
        <h2 className="text-4xl font-display font-bold tracking-tighter mb-6">{t('home.hero.title')}</h2>
        <p className="text-lg text-mute max-w-2xl mb-8">{t('home.hero.sub')}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="/musica" className="inline-flex items-center gap-2 bg-ink text-void px-6 py-3 rounded font-mono font-semibold hover:bg-red transition-colors">{t('home.listen')}</a>
          <a href="/galaxia" className="inline-flex items-center gap-2 border border-white/20 text-ink px-6 py-3 rounded font-mono font-semibold hover:bg-white/5 transition-colors">{t('home.explore')}</a>
        </div>
      </section>
    </>
  );
}
