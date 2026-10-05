import { useRef, useState, useEffect } from 'react';

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

  const play = (src: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = src;
    } else {
      audioRef.current = new Audio(src);
    }
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {});
      setPlaying(true);
      audioRef.current.onended = () => setPlaying(false);
    }
  };

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setPlaying(!playing);
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  return { play, toggle, playing, volume, setVolume };
}