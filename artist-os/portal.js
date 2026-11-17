/* BELENTANI PENTADA: five doors adapted from OMEGA portal gem mechanic.
   No THREE, GSAP, Tone, storage, trackers or external resources. */
(() => {
  'use strict';
  const gates = Object.freeze([
    { name: 'ORIGEN', title: 'LA VOZ', description: 'La música es el principio: una voz, canciones, fechas y ediciones que anteceden a todos los mundos.', coordinate: 'CANAL 01 · MÚSICA / DISCOGRAFÍA', href: '../musica', action: 'ENTRAR EN LA MÚSICA', color: '#ff769a' },
    { name: 'FUEGO', title: 'JUDAS', description: 'El fuego de una era. Música oscura, símbolos y un relato que se cuenta a través de distintas estancias.', coordinate: 'CANAL 02 · JUDAS / EXPERIENCIA', href: '../judas', action: 'ATRAVESAR JUDAS', color: '#ff3b59' },
    { name: 'VUELO', title: 'OMEGA', description: 'La obra deja el suelo: planeta, diamante, luz y movimiento en el universo inmersivo.', coordinate: 'CANAL 03 · OMEGA / ESCENA', href: '../omega-cosmos.html', action: 'VIAJAR A OMEGA', color: '#7be3e9' },
    { name: 'ECO', title: 'STUDIO', description: 'Una máquina que responde al tacto. Experimenta con la síntesis sonora y compón una pequeña secuencia.', coordinate: 'CANAL 04 · STUDIO / SOUND LAB', href: './lab.html', action: 'ABRIR SOUND LAB', color: '#e2b869' },
    { name: 'MEMORIA', title: 'ARCHIVO', description: 'Las primeras canciones, los escenarios y las ideas que todavía esperan su edición. El pasado no desaparece.', coordinate: 'CANAL 05 · ARCHIVO / EDICIONES', href: '../archivo', action: 'ENTRAR EN EL ARCHIVO', color: '#d9bbf6' }
  ]);
  const buttons = [...document.querySelectorAll('[data-gem]')];
  const serial = document.getElementById('readout-serial');
  const title = document.getElementById('detail-title');
  const description = document.getElementById('detail-description');
  const coordinate = document.getElementById('detail-coordinate');
  const link = document.getElementById('detail-link');
  const progress = document.getElementById('progress-count');
  const bar = document.getElementById('progress-bar');
  const message = document.getElementById('progress-message');
  if (buttons.length !== gates.length || !link || !title || !description || !progress) return;
  const visited = new Set();
  let selected = 0;

  function select(index, moveFocus = false) {
    if (!Number.isInteger(index) || index < 0 || index >= gates.length) return;
    const gate = gates[index];
    selected = index;
    visited.add(index);
    document.documentElement.style.setProperty('--active', gate.color);
    buttons.forEach((button, i) => {
      const isSelected = i === index;
      button.classList.toggle('is-selected', isSelected);
      button.classList.toggle('is-discovered', visited.has(i));
      button.setAttribute('aria-pressed', String(isSelected));
      if (isSelected && moveFocus) button.focus();
    });
    serial.textContent = 'GEMA ' + String(index + 1).padStart(2, '0') + ' / 05';
    title.textContent = gate.name + ' / ' + gate.title;
    description.textContent = gate.description;
    coordinate.textContent = gate.coordinate;
    link.href = gate.href;
    link.firstChild.textContent = gate.action + ' ';
    progress.textContent = visited.size + ' / ' + gates.length;
    bar.style.width = visited.size * 20 + '%';
    message.textContent = visited.size === gates.length
      ? 'PENTADA COMPLETA · Las cinco puertas han respondido. Puedes recorrerlas en cualquier orden.'
      : 'Gema ' + (index + 1) + ' activada. Las cinco puertas siguen disponibles.';
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', event => {
      let next = -1;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % gates.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + gates.length - 1) % gates.length;
      if (next < 0) return;
      event.preventDefault();
      select(next, true);
    });
  });
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    if (event.target instanceof HTMLElement && event.target.closest('input,textarea,select,[contenteditable]')) return;
    if (/^[1-5]$/.test(event.key)) {
      event.preventDefault();
      select(Number(event.key) - 1, true);
    }
  });
  // The first gate is highlighted, but nothing is counted until visitors activate it.
  document.documentElement.style.setProperty('--active', gates[0].color);
})();