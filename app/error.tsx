'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Keep production diagnostics free of user content and credentials.
    console.error('Belentani route error', { digest: error.digest });
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-void px-6 text-center text-ink">
      <section aria-labelledby="error-title" className="max-w-xl">
        <p className="font-mono text-sm uppercase tracking-[0.35em] text-red">Belentani // Error</p>
        <h1 id="error-title" className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">
          La escena no pudo cargarse.
        </h1>
        <p className="mt-5 text-sm text-mute">
          Puedes reintentarlo sin perder tu recorrido.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 inline-flex min-h-11 items-center justify-center border border-red px-6 py-3 font-mono text-sm uppercase tracking-[0.2em] text-red transition hover:bg-red hover:text-void focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
        >
          Reintentar
        </button>
      </section>
    </main>
  );
}
