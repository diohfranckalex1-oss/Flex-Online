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
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const intervalRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cycle speed: 1x -> 1.5x -> 2x -> 1x
  const cyclePlaybackRate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  // Generate deterministic wave heights
  const bars = [14, 22, 35, 18, 28, 40, 32, 20, 16, 38, 24, 18, 30, 42, 26, 15, 20, 36, 28, 16];

  useEffect(() => {
    if (mediaUrl) {
      const audio = new Audio(mediaUrl);
      audio.playbackRate = playbackRate;
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
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (!mediaUrl) {
      if (isPlaying) {
        intervalRef.current = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              setIsPlaying(false);
              return 0;
            }
            return prev + (100 / (duration * 10)) * playbackRate;
          });
        }, 100);
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isPlaying, duration, mediaUrl, playbackRate]);

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
            ? 'bg-white text-teal-950 shadow-black/20'
            : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-950/40'
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
                      ? 'bg-teal-200'
                      : 'bg-teal-400'
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
          <span className={isSelf ? 'text-teal-100 font-bold' : 'text-neutral-300 font-bold'}>
            {formatTime(isPlaying ? currentSeconds : duration)}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={cyclePlaybackRate}
              className={`px-1.5 py-0.2 rounded-md font-bold text-[9px] transition active:scale-95 ${
                playbackRate > 1
                  ? isSelf
                    ? 'bg-white text-teal-950 font-black'
                    : 'bg-teal-500 text-white font-black'
                  : isSelf
                  ? 'bg-teal-950/60 text-teal-200 hover:bg-teal-900/80'
                  : 'bg-neutral-800 text-neutral-300 hover:text-white'
              }`}
              title="Changer la vitesse d'écoute (1x / 1.5x / 2x)"
            >
              {playbackRate}x
            </button>
            <Volume2 className={`w-3 h-3 ${isSelf ? 'text-teal-200' : 'text-neutral-400'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
