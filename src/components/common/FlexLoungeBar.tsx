import React, { useState } from 'react';
import { Headphones, Radio, Volume2, Mic, Users, Sparkles, X, Play, Pause } from 'lucide-react';
import { AUDIO_LOUNGES } from '../../data/themeAndLounges';
import { useApp } from '../../context/AppContext';

export const FlexLoungeBar: React.FC = () => {
  const { currentUser, users } = useApp();
  const [activeLoungeId, setActiveLoungeId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentLounge = AUDIO_LOUNGES.find((l) => l.id === activeLoungeId);

  return (
    <div id="flex-lounges-widget" className="mb-4">
      {/* Active in-lounge sticky banner */}
      {currentLounge && (
        <div className="mb-3 p-3.5 bg-gradient-to-r from-violet-900/90 via-indigo-900/90 to-neutral-900 border border-indigo-500/30 rounded-2xl text-white shadow-xl shadow-indigo-950/40 backdrop-blur-md animate-scale-in flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Radio className="w-5 h-5 animate-pulse text-cyan-300" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-neutral-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  En Direct
                </span>
                <h4 className="text-sm font-bold text-white">{currentLounge.name}</h4>
              </div>
              <p className="text-xs text-neutral-300 flex items-center gap-1.5 mt-0.5">
                <span>{currentLounge.activeListeners + 1} personnes connectées</span>
                <span>•</span>
                <span className="text-cyan-400">Audio spatial actif</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSpeaking(!isSpeaking)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isSpeaking
                  ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/30 animate-pulse'
                  : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isSpeaking ? 'Micro Ouvert' : 'Demander la parole'}</span>
            </button>

            <button
              onClick={() => setActiveLoungeId(null)}
              className="p-1.5 rounded-xl bg-neutral-800/80 hover:bg-rose-500/20 hover:text-rose-400 text-neutral-400 transition-colors"
              title="Quitter le salon"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Lounges quick access carousel */}
      {!activeLoungeId && (
        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-3.5 backdrop-blur-sm shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-neutral-200 tracking-wide">
                Salons Vocaux & Chill Flex
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full">
              Écoute libre
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {AUDIO_LOUNGES.map((lounge) => (
              <div
                key={lounge.id}
                onClick={() => setActiveLoungeId(lounge.id)}
                className="group p-3 rounded-xl bg-neutral-800/60 hover:bg-indigo-950/40 border border-neutral-700/50 hover:border-indigo-500/40 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <p className="text-xs font-bold text-neutral-100 group-hover:text-indigo-300 truncate">
                      {lounge.name}
                    </p>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate">{lounge.topic}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {lounge.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-neutral-700/60 text-neutral-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shrink-0 transition-transform group-hover:scale-105 shadow-xs shadow-indigo-600/30">
                  Rejoindre
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
