import Link from 'next/link';
import { notFound } from 'next/navigation';
import { VOYAGE_PLACES } from '@/lib/voyage-places';

export function AtlasPlanetPage({ id }: { id: string }) {
  const place = VOYAGE_PLACES.find((item) => item.id === id);
  if (!place) notFound();

  return (
    <main className="min-h-screen bg-void text-ink">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20">
        <p className="font-mono text-xs tracking-[.32em]" style={{ color: place.accent }}>
          ATLAS BELENTANI / SISTEMA CURADO
        </p>
        <h1 className="mt-5 font-display text-5xl font-black tracking-[-.07em] md:text-7xl">
          {place.title}
        </h1>
        <p className="mt-6 max-w-3xl text-2xl leading-9 text-mute">{place.tagline}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-border bg-white/[.025] p-5">
            <p className="font-mono text-[10px] tracking-[.26em] text-gold">ORIGEN</p>
            <p className="mt-3 text-lg leading-7 text-mute">{place.sourceRepo}</p>
          </article>
          <article className="rounded-2xl border border-border bg-white/[.025] p-5">
            <p className="font-mono text-[10px] tracking-[.26em]" style={{ color: place.accent }}>USO EN LA GALAXIA</p>
            <p className="mt-3 text-lg leading-7 text-mute">{place.assetNote}</p>
          </article>
        </div>
        <div className="mt-10 flex flex-wrap gap-4 font-mono text-xs tracking-[.18em]">
          <Link className="border border-red bg-red px-5 py-3 text-void transition hover:bg-gold hover:border-gold" href="/galaxia">VOLVER A LA GALAXIA ↗</Link>
          <Link className="border border-border px-5 py-3 text-red transition hover:border-gold hover:text-gold" href="/">OBRA PRINCIPAL ↗</Link>
        </div>
      </section>
    </main>
  );
}
