import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-void px-6 text-center text-ink">
      <section aria-labelledby="not-found-title" className="max-w-xl">
        <p className="font-mono text-sm uppercase tracking-[0.35em] text-red">Belentani // 404</p>
        <h1 id="not-found-title" className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
          Esta coordenada no existe.
        </h1>
        <p className="mt-5 text-lg text-mute">
          La ruta que buscas no forma parte de la experiencia publicada.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center justify-center border border-red px-6 py-3 font-mono text-sm uppercase tracking-[0.2em] text-red transition hover:bg-red hover:text-void focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
