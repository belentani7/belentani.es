'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MythLang } from '@/lib/mythos';

export type VoiceMode = 'natural' | 'browser';

export interface VoiceNarratorState {
  lang: MythLang;
  mode: VoiceMode;
  speaking: boolean;
  supported: boolean;
  voicesReady: boolean;
  naturalReady: boolean;
  setLang: (lang: MythLang) => void;
  setMode: (mode: VoiceMode) => void;
  speak: (text: string, langOverride?: MythLang) => Promise<boolean>;
  stop: () => void;
}

const LANG_BCP47: Record<MythLang, string> = {
  es: 'es-ES',
  en: 'en-US',
  pt: 'pt-BR',
};

/** Rechaza voces Microsoft / Zira / robóticas viejas */
function isBannedVoice(name: string) {
  return /microsoft|zira|david|sabina|helena|pablo|hortense|hazel|susan|mark|desktop|mobile/i.test(name);
}

function pickNaturalBrowserVoice(voices: SpeechSynthesisVoice[], lang: MythLang): SpeechSynthesisVoice | null {
  const want = LANG_BCP47[lang].toLowerCase();
  const prefix = lang === 'pt' ? 'pt' : lang;
  const scored = voices
    .filter((v) => !isBannedVoice(v.name))
    .map((v) => {
      const tag = (v.lang || '').toLowerCase();
      let score = 0;
      if (tag === want) score += 12;
      if (tag.startsWith(prefix)) score += 6;
      if (lang === 'pt' && tag.includes('br')) score += 5;
      if (/google|premium|enhanced|natural|neural|eloquence/i.test(v.name)) score += 8;
      if (/male|jorge|diego|daniel|thomas|matthew|james|alex/i.test(v.name)) score += 3;
      if (/female|mujer|zira|susan|samantha|karen|moira/i.test(v.name)) score -= 4;
      return { v, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored[0]?.v ?? null;
}

/**
 * Voz natural primero (ElevenLabs vía /api/voice/speak).
 * Browser solo como respaldo y NUNCA Microsoft.
 */
export function useVoiceNarrator(initial: MythLang = 'es'): VoiceNarratorState {
  const [lang, setLang] = useState<MythLang>(initial);
  const [mode, setMode] = useState<VoiceMode>('natural');
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const [naturalReady, setNaturalReady] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const cancelPlaybackRef = useRef<(() => void) | null>(null);
  const generationRef = useRef(0);

  useEffect(() => {
    const ok = typeof window !== 'undefined' && 'speechSynthesis' in window;
    setSupported(ok);
    const controller = new AbortController();
    const endpoint = process.env.NEXT_PUBLIC_VOICE_CLONE_ENDPOINT || '/api/voice/speak';
    void fetch(endpoint, { signal: controller.signal, cache: 'no-store' })
      .then(async (res) => res.ok && (await res.json()).available === true)
      .then((ready) => { if (!controller.signal.aborted) setNaturalReady(ready); })
      .catch(() => { if (!controller.signal.aborted) setNaturalReady(false); });
    if (!ok) return () => controller.abort();
    const load = () => {
      voicesRef.current = window.speechSynthesis.getVoices().filter((v) => !isBannedVoice(v.name));
      setVoicesReady(voicesRef.current.length > 0);
    };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => {
      controller.abort();
      window.speechSynthesis.removeEventListener('voiceschanged', load);
    };
  }, []);

  const stop = useCallback(() => {
    generationRef.current += 1;
    requestRef.current?.abort();
    requestRef.current = null;
    cancelPlaybackRef.current?.();
    cancelPlaybackRef.current = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setSpeaking(false);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const speakBrowser = useCallback(
    (text: string, useLang: MythLang, generation: number) =>
      new Promise<void>((resolve, reject) => {
        if (!supported) {
          reject(new Error('no speech'));
          return;
        }
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = LANG_BCP47[useLang];
        u.rate = 0.94;
        u.pitch = 0.92;
        const voice = pickNaturalBrowserVoice(voicesRef.current, useLang);
        if (!voice) {
          reject(new Error('solo voces Microsoft disponibles — bloqueadas'));
          return;
        }
        u.voice = voice;
        u.onstart = () => { if (generation === generationRef.current) setSpeaking(true); };
        cancelPlaybackRef.current = () => reject(new Error('speech cancelled'));
        u.onend = () => {
          if (generation === generationRef.current) {
            cancelPlaybackRef.current = null;
            setSpeaking(false);
          }
          resolve();
        };
        u.onerror = () => {
          if (generation === generationRef.current) {
            cancelPlaybackRef.current = null;
            setSpeaking(false);
          }
          reject(new Error('speech failed'));
        };
        window.speechSynthesis.speak(u);
      }),
    [supported]
  );

  const speakNatural = useCallback(async (text: string, useLang: MythLang, generation: number) => {
    const endpoint = process.env.NEXT_PUBLIC_VOICE_CLONE_ENDPOINT || '/api/voice/speak';
    const controller = new AbortController();
    requestRef.current = controller;
    let url: string | undefined;
    setSpeaking(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          text,
          lang: LANG_BCP47[useLang],
          voiceId: process.env.NEXT_PUBLIC_VOICE_CLONE_ID,
        }),
      });
      if (!res.ok) throw new Error(`voice HTTP ${res.status}`);
      const type = res.headers.get('Content-Type') || '';
      if (!type.startsWith('audio/') && !type.includes('octet-stream')) throw new Error('audio required');
      const blob = await res.blob();
      if (controller.signal.aborted || generation !== generationRef.current) throw new Error('speech cancelled');
      url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      await new Promise<void>((resolve, reject) => {
        cancelPlaybackRef.current = () => reject(new Error('speech cancelled'));
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('playback failed'));
        void audio.play().catch(reject);
      });
    } finally {
      if (url) URL.revokeObjectURL(url);
      if (generation === generationRef.current) {
        audioRef.current = null;
        requestRef.current = null;
        cancelPlaybackRef.current = null;
        setSpeaking(false);
      }
    }
  }, []);

  const speak = useCallback(
    async (text: string, langOverride?: MythLang) => {
      const useLang = langOverride ?? lang;
      stop();
      const generation = generationRef.current;
      try {
        if (mode === 'natural') {
          await speakNatural(text, useLang, generation);
          return true;
        }
        await speakBrowser(text, useLang, generation);
        return true;
      } catch {
        // Natural fallido: NO caer a Microsoft. Silencio.
        if (generation === generationRef.current) setSpeaking(false);
        return false;
      }
    },
    [lang, mode, stop, speakNatural, speakBrowser]
  );

  return {
    lang,
    mode,
    speaking,
    supported,
    voicesReady,
    naturalReady,
    setLang,
    setMode,
    speak,
    stop,
  };
}
