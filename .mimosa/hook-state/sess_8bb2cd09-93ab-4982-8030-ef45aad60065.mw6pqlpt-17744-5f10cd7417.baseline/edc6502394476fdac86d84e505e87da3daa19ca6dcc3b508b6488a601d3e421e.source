'use client';
import { useState } from 'react';

const chapters = [
  ['01','GÉNESIS','Antes del nombre hubo un cuerpo sin voz. El primer código fue aprender a convertir presión en respiración.'],
  ['02','LA INVITACIÓN','El sexto piso no es un lugar: es el umbral donde la noche adquiere arquitectura.'],
  ['03','EL EXCESO','La cera conserva la forma de lo que ardió. La polilla sigue la luz aunque la luz conozca su nombre.'],
  ['04','LA TRAICIÓN','Judas es una fuerza de fricción. El beso separa las versiones que fingían ser una sola.'],
  ['05','LA DEUDA','La llave no representa posesión. Representa decisión: entrar, salir o romper el mecanismo.'],
  ['06','LA REDENCIÓN','Ser muchos para seguir siendo uno. Las cinco firmas vuelven a integrarse en el humano.'],
];

export function LorePanel() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="pointer-events-auto fixed right-4 bottom-4 z-[30] rounded-xl border border-red/30 bg-void/75 px-4 py-2 font-mono text-[10px] tracking-[.2em] text-white backdrop-blur-xl hover:border-gold hover:text-gold"
      >
        ⌬ ABRIR CÓDICE
      </button>
      {open && (
        <aside className="pointer-events-auto fixed inset-3 z-[50] overflow-hidden rounded-2xl border border-red/25 bg-[#050007]/90 shadow-2xl backdrop-blur-2xl md:inset-8">
          <header className="flex items-start justify-between gap-5 border-b border-red/15 bg-gradient-to-b from-red/10 to-transparent p-5 md:p-7">
            <div>
              <div className="font-mono text-[9px] tracking-[.32em] text-red">BELENTANI // LORE ENGINE</div>
              <h2 className="mt-1 font-display text-xl font-black tracking-[.14em] text-white md:text-3xl">CÓDICE DE LA GALAXIA</h2>
              <p className="mt-1 max-w-2xl font-mono text-xs text-mute">La galaxia no es un menú. Cada mundo contiene una consecuencia.</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Cerrar códice" className="h-9 w-9 rounded-lg border border-border text-mute hover:border-red hover:text-white">✕</button>
          </header>
          <div className="h-[calc(100%-112px)] overflow-y-auto p-4 md:p-7">
            <div className="mx-auto max-w-5xl">
              <div className="mb-5 border-l-2 border-red bg-red/5 p-4 font-mono text-xs leading-6 text-mute">
                <b className="text-gold">REGLA DE ORO</b><br />
                El Lore manda. Música, 3D, código y herramientas son satélites del mito.
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {chapters.map(([n, title, text]) => (
                  <article key={n} className="group rounded-xl border border-red/15 bg-white/[.025] p-4 transition hover:-translate-y-1 hover:border-red/45">
                    <div className="font-display text-3xl font-black text-white/10">{n}</div>
                    <div className="font-mono text-[9px] tracking-[.24em] text-red">{title}</div>
                    <p className="mt-2 font-mono text-[11px] leading-6 text-mute">{text}</p>
                  </article>
                ))}
              </div>
              <div className="mt-6 border-t border-red/15 pt-5">
                <div className="font-mono text-[9px] tracking-[.28em] text-gold">WEB ATLAS // TEXTURA & ESCENA</div>
                <p className="mt-2 font-mono text-[10px] leading-5 text-mute">Referencias públicas investigadas para mejorar PBR, exportación GLB y narrativa visual. No se copian assets propietarios.</p>
                <div className="mt-3 grid gap-2 md:grid-cols-3">
                  <a className="rounded-lg border border-border p-3 text-xs text-white hover:border-gold" href="https://www.meshy.ai/tutorials/gpt-astra-meshy-3d-workflow" target="_blank" rel="noreferrer">Astra / PBR & remesh</a>
                  <a className="rounded-lg border border-border p-3 text-xs text-white hover:border-gold" href="https://www.xdreality.ai/blog/gpt-astra-blender-tutorial" target="_blank" rel="noreferrer">Astra / GLB & materiales</a>
                  <a className="rounded-lg border border-border p-3 text-xs text-white hover:border-gold" href="https://frontiermodels.cc/video/build-a-10k-website-with-gpt-astra-no-code-full-tutorial/" target="_blank" rel="noreferrer">Astra / visual storytelling</a>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
