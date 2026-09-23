import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface VoiceNotePlayerProps {
  duration?: number;
  isSelf?: boolean;
  mediaUrl?: string;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({ duration = 15, isSelf = false, mediaUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate deterministic wave heights
  const bars = [14, 22, 35, 18, 28, 40, 32, 20, 16, 38, 24, 18, 30, 42, 26, 15, 20, 36, 28, 16];

  useEffect(() => {
    if (mediaUrl) {
      const audio = new Audio(mediaUrl);
      audioRef.current = audio;

      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      return () => {
        audio.pause();
        audioRef.current = null;
      };
    }
  }, [mediaUrl]);

  useEffect(() => {
    if (!mediaUrl) {
      if (isPlaying) {
        intervalRef.current = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              setIsPlaying(false);
              return 0;
            }
            return prev + (100 / (duration * 10));
          });
        }, 100);
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isPlaying, duration, mediaUrl]);

  const togglePlay = () => {
    if (mediaUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((e) => console.warn('Audio play error:', e));
        setIsPlaying(true);
      }
    } else {
      if (progress >= 100) setProgress(0);
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentSeconds = (progress / 100) * duration;

  return (
    <div id="voice-note-player" className="flex items-center gap-3 py-1 px-1 min-w-[220px] max-w-[280px]">
      <button
        id="btn-voice-play-toggle"
        onClick={togglePlay}
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md ${
          isSelf
            ? 'bg-white text-emerald-900 shadow-black/20'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
        }`}
        aria-label={isPlaying ? 'Mettre en pause' : 'Écouter le message vocal'}
      >
        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>

      {/* Waveform Bars */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-0.75 h-7">
          {bars.map((height, i) => {
            const barProgress = (i / bars.length) * 100;
            const isPlayed = progress >= barProgress;

            return (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isPlayed
                    ? isSelf
                      ? 'bg-emerald-200'
                      : 'bg-emerald-400'
                    : isSelf
                    ? 'bg-white/30'
                    : 'bg-neutral-700'
                }`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] mt-1 font-mono">
          <span className={isSelf ? 'text-emerald-100' : 'text-neutral-400'}>
            {formatTime(isPlaying ? currentSeconds : duration)}
          </span>
          <Volume2 className={`w-3 h-3 ${isSelf ? 'text-emerald-100' : 'text-neutral-500'}`} />
        </div>
      </div>
    </div>
  );
};
