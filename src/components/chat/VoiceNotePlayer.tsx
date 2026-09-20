import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface VoiceNotePlayerProps {
  duration?: number;
  isSelf?: boolean;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({ duration = 15, isSelf = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<any>(null);

  // Generate deterministic wave heights
  const bars = [14, 22, 35, 18, 28, 40, 32, 20, 16, 38, 24, 18, 30, 42, 26, 15, 20, 36, 28, 16];

  useEffect(() => {
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
  }, [isPlaying, duration]);

  const togglePlay = () => {
    if (progress >= 100) setProgress(0);
    setIsPlaying(!isPlaying);
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
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 ${
          isSelf
            ? 'bg-white text-emerald-700 shadow-sm'
            : 'bg-emerald-600 text-white shadow-sm'
        }`}
        aria-label={isPlaying ? 'Mettre en pause' : 'Écouter le message vocal'}
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
      </button>

      <div className="flex-1 flex flex-col justify-center gap-1.5">
        <div className="flex items-center gap-0.5 h-7">
          {bars.map((height, idx) => {
            const barProgress = (idx / bars.length) * 100;
            const isPlayed = progress >= barProgress;
            return (
              <div
                key={idx}
                className="flex-1 rounded-full transition-colors duration-100"
                style={{
                  height: `${height}px`,
                  backgroundColor: isPlayed
                    ? isSelf ? '#ffffff' : '#059669'
                    : isSelf ? 'rgba(255, 255, 255, 0.4)' : '#d1d5db',
                }}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs font-medium">
          <span className={isSelf ? 'text-emerald-100' : 'text-neutral-500'}>
            {isPlaying ? formatTime(currentSeconds) : formatTime(duration)}
          </span>
          <Volume2 className={`w-3.5 h-3.5 ${isSelf ? 'text-emerald-200' : 'text-neutral-400'}`} />
        </div>
      </div>
    </div>
  );
};
