'use client';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface AudioPlayerProps {
  src: string;
  title: string;
  variant?: 'ambient' | 'chapter' | 'stem';
  autoPlay?: boolean;
}

export function AudioPlayer({ src, title, variant = 'chapter', autoPlay = false, className }: AudioPlayerProps & { className?: string }) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.src = src;
    audioRef.current.load();
    const handleCanPlay = () => setLoaded(true);
    const handleError = () => setError(true);
    const handleEnded = () => setPlaying(false);
    audioRef.current.addEventListener('canplay', handleCanPlay);
    audioRef.current.addEventListener('error', handleError);
    audioRef.current.addEventListener('ended', handleEnded);
    if (autoPlay) {
      audioRef.current.play().catch(() => {});
    }
    return () => {
      if (!audioRef.current) return;
      audioRef.current.removeEventListener('canplay', handleCanPlay);
      audioRef.current.removeEventListener('error', handleError);
      audioRef.current.removeEventListener('ended', handleEnded);
    };
  }, [src, volume, autoPlay]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  if (variant === 'ambient') {
    return (
      <div
        id="ambient-player"
        className={cn(
          'fixed bottom-4 right-4 z-[110] flex items-center gap-3',
          'bg-voidElevated/92 border border-red/35 backdrop-blur-md p-2 pr-4',
          'shadow-[0_0_24px_rgba(255,7,58,.12)] transition-opacity',
          'max-w-[280px] text-xs tracking-normal text-mute'
        )}
        onMouseEnter={(e) => e.currentTarget.classList.add('hover')}
        onMouseLeave={(e) => e.currentTarget.classList.remove('hover')}
      >
        <button
          className="ap-btn flex items-center justify-center w-7 h-7 border border-red/40 text-red transition-all"
          onClick={toggle}
          aria-label={playing ? 'Pausar' : 'Reproducir'}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <span className="ap-track truncate text-[9px] tracking-wider text-mute/70">{title}</span>
        <input
          type="range"
          className="ap-vol w-12 h-0.5 appearance-none bg-voidElevated outline-none cursor-pointer"
          min="0" max="1" step="0.01" value={volume}
          onChange={handleVolumeChange}
          aria-label="Volumen"
        />
        <audio ref={audioRef} style={{ display: 'none' }} />
      </div>
    );
  }

  return (
    <div className={cn('w-full mt-4', className)}>
      <audio ref={audioRef} controls className="w-full accent-red" />
      {error && <p className="text-red text-xs mt-1">Error cargando audio</p>}
    </div>
  );
}