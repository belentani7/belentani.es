/* BELENTANI Sound Lab — reduced, credential-free WebAudio core adapted from
   belentani-artista-unified/studio/studio.js (50dc183).
   No external requests, persistent data, microphone, accounts, or API keys. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const names = ['DO','DO♯','RE','RE♯','MI','FA','FA♯','SOL','SOL♯','LA','LA♯','SI'];
  const keys = ['a','w','s','e','d','f','t','g','y','h','u','j'];
  const pattern = [60, null, 67, null, 64, null, 67, null];
  const active = new Map();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let selectedNote = 60, stepIndex = 0, timer = null, context = null, master = null, analyser = null, animation = 0, lastPaint = 0;
  const status = $('lab-status'), screen = $('signal'), instrument = $('instrument'), bpm = $('bpm'), volume = $('volume');
  const say = message => { status.textContent = message; };

  function boot() {
    if (!context) {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) { say('WebAudio no disponible en este navegador.'); return null; }
      context = new Audio({ latencyHint: 'interactive' });
      master = context.createGain(); master.gain.value = Number(volume.value) / 100 * .5;
      const comp = context.createDynamicsCompressor();
      comp.threshold.value = -9; comp.knee.value = 7; comp.ratio.value = 10;
      analyser = context.createAnalyser(); analyser.fftSize = 1024;
      master.connect(comp); comp.connect(analyser); analyser.connect(context.destination);
      $('power').textContent = 'AUDIO ACTIVO';
      $('power').setAttribute('aria-pressed', 'true');
      requestAnimationFrame(paint);
    }
    if (context.state === 'suspended') void context.resume();
    say('Audio listo · Sonido generado en este navegador');
    return context;
  }

  function createVoice(midi) {
    const ac = boot();
    if (!ac) return () => {};
    const now = ac.currentTime;
    const oscillator = ac.createOscillator();
    const gain = ac.createGain();
    const filter = ac.createBiquadFilter();
    const preset = instrument.value;
    const frequency = 440 * Math.pow(2, (midi - 69) / 12);
    oscillator.type = preset === 'crystal' ? 'triangle' : preset === 'pulse' ? 'sawtooth' : 'sine';
    oscillator.frequency.setValueAtTime(preset === 'sub' ? frequency / 2 : frequency, now);
    filter.type = 'lowpass';
    filter.frequency.value = preset === 'pulse' ? 1900 : preset === 'crystal' ? 2800 : 760;
    filter.Q.value = preset === 'pulse' ? 3 : 1;
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(preset === 'sub' ? .34 : .2, now + .035);
    oscillator.connect(filter); filter.connect(gain); gain.connect(master);
    oscillator.start(now);
    let released = false;
    return () => {
      if (released) return;
      released = true;
      const t = ac.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setTargetAtTime(.0001, t, preset === 'crystal' ? .16 : .055);
      oscillator.stop(t + .65);
    };
  }
  function noteOn(midi) {
    if (active.has(midi)) return;
    selectedNote = midi;
    active.set(midi, createVoice(midi));
    document.querySelectorAll('[data-note]').forEach(k => k.classList.toggle('is-pressed',Number(k.dataset.note) === midi));
    say('Nota ' + names[midi % 12] + String(Math.floor(midi / 12) - 1) + ' · ' + instrument.selectedOptions[0].textContent);
  }
  function noteOff(midi) {
    const release = active.get(midi);
    if (release) release();
    active.delete(midi);
    document.querySelectorAll('[data-note]').forEach(k => {
      if (Number(k.dataset.note) === midi) k.classList.remove('is-pressed');
    });
  }
  function shortNote(midi,duration) {
    const release = createVoice(midi);
    setTimeout(release, Math.max(80,duration));
  }
  function makeKeyboard() {
    const root = $('keyboard');
    for (let i=0;i<12;i++) {
      const midi = 60 + i;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'key ' + ([1,3,6,8,10].includes(i) ? 'dark-key' : 'light-key');
      button.dataset.note = String(midi);
      button.setAttribute('aria-label',names[i] + '4');
      const noteName = document.createElement('span'); noteName.textContent = names[i];
      const shortcut = document.createElement('kbd'); shortcut.textContent = keys[i].toUpperCase();
      button.append(noteName, shortcut);
      button.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        button.setPointerCapture(event.pointerId);
        noteOn(midi);
      });
      button.addEventListener('pointerup', () => noteOff(midi));
      button.addEventListener('pointercancel', () => noteOff(midi));
      button.addEventListener('lostpointercapture', () => noteOff(midi));
      button.addEventListener('click', event => { if (event.detail === 0) shortNote(midi,350); });
      root.append(button);
    }
  }
  function makeSteps() {
    const root = $('steps');
    pattern.forEach((note,i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'step';
      button.dataset.step = String(i);
      button.addEventListener('click', () => {
        pattern[i] = pattern[i] === null ? selectedNote : null;
        renderSteps();
      });
      root.append(button);
    });
    renderSteps();
  }
  function renderSteps() {
    for (const button of $('steps').children) {
      const i = Number(button.dataset.step), n = pattern[i];
      button.classList.toggle('is-on',n !== null);
      button.classList.toggle('is-current',timer !== null && i === stepIndex);
      button.setAttribute('aria-pressed',String(n !== null));
      button.setAttribute('aria-label','Paso ' + (i+1) + (n === null ? ', silencio' : ', nota '+names[n%12]));
      button.textContent = n === null ? '—' : names[n%12];
    }
  }
  function tick() {
    const current = stepIndex;
    if (pattern[current] !== null) shortNote(pattern[current], Math.min(600, 26000 / Number(bpm.value)));
    stepIndex = (stepIndex + 1) % pattern.length;
    renderSteps();
  }
  function stop() {
    if (timer !== null) clearInterval(timer);
    timer = null; stepIndex = 0; renderSteps();
    $('transport').textContent = 'INICIAR SECUENCIA';
    $('transport').setAttribute('aria-pressed','false');
  }
  function transport() {
    if (timer !== null) { stop(); return; }
    if (!boot()) return;
    stepIndex = 0;
    tick();
    timer = setInterval(tick,Math.round(60000 / Number(bpm.value) / 2));
    renderSteps();
    $('transport').textContent = 'DETENER SECUENCIA';
    $('transport').setAttribute('aria-pressed','true');
  }
  function paint(ms) {
    if (!analyser || !screen) return;
    if (document.visibilityState !== 'visible') {animation = requestAnimationFrame(paint); return;}
    if (ms-lastPaint < 42) {animation = requestAnimationFrame(paint); return;}
    lastPaint = ms;
    const dpr = Math.min(1.5,devicePixelRatio || 1);
    const width = Math.max(10,Math.floor(screen.clientWidth * dpr));
    const height = Math.max(10,Math.floor(screen.clientHeight * dpr));
    if (screen.width !== width || screen.height !== height) {screen.width = width; screen.height = height;}
    const canvas = screen.getContext('2d');
    if (!canvas) return;
    const waveform = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(waveform);
    canvas.clearRect(0,0,width,height);
    canvas.strokeStyle = '#ff7ca6'; canvas.shadowColor = '#ff365e'; canvas.shadowBlur = 10 * dpr; canvas.lineWidth = 1.6 * dpr;
    canvas.beginPath();
    for (let i=0;i<waveform.length;i++) {
      const x = i / (waveform.length-1) * width;
      const y = waveform[i] / 255 * height;
      if (i===0) canvas.moveTo(x,y); else canvas.lineTo(x,y);
    }
    canvas.stroke();
    if (!reduced) animation = requestAnimationFrame(paint);
  }
  $('power').addEventListener('click',boot);
  $('transport').addEventListener('click',transport);
  $('clear').addEventListener('click',()=>{for(let i=0;i<pattern.length;i++)pattern[i]=null;renderSteps();say('Secuencia vacía');});
  bpm.addEventListener('input',()=>{$('bpm-value').textContent=bpm.value+' BPM';if(timer!==null){stop();transport();}});
  volume.addEventListener('input',()=>{if(master)master.gain.value=Number(volume.value)/100*.5;});
  document.addEventListener('keydown',event=>{
    if(event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input,select,textarea'))return;
    const i=keys.indexOf(event.key.toLowerCase());
    if(i<0)return;
    event.preventDefault();noteOn(60+i);
  });
  document.addEventListener('keyup',event=>{const i=keys.indexOf(event.key.toLowerCase());if(i>=0)noteOff(60+i);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();active.forEach(fn=>fn());active.clear();}});
  window.addEventListener('pagehide',()=>{stop();cancelAnimationFrame(animation);if(context)void context.close();});
  makeKeyboard(); makeSteps();
  $('bpm-value').textContent=bpm.value+' BPM';
  say('Apagado · Enciende el motor para escuchar');
})();