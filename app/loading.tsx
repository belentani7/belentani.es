export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-void px-6 text-center text-ink" aria-busy="true">
      <section aria-labelledby="loading-title" className="max-w-xl">
        <p className="font-mono text-sm uppercase tracking-[0.35em] text-red">Belentani // Experience</p>
        <h1 id="loading-title" className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">
          Preparando la experiencia…
        </h1>
        <div className="mx-auto mt-8 h-1 w-40 overflow-hidden bg-border" aria-hidden="true">
          <div className="h-full w-1/2 animate-pulse bg-red" />
        </div>
        <p className="mt-5 text-sm text-mute">La escena se está ensamblando.</p>
      </section>
    </main>
  );
}
