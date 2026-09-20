import React, { useState, useEffect } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CallModal: React.FC = () => {
  const { activeCall, endCall, currentUser } = useApp();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let timer: any = null;
    if (activeCall) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeCall]);

  if (!activeCall) return null;

  const isIncoming = activeCall.recipient.id === currentUser.id;
  const partner = isIncoming ? activeCall.caller : activeCall.recipient;
  const isVideo = activeCall.type === 'video';

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div id="call-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col items-center justify-between min-h-[500px] p-6 text-white text-center">
        {/* Call status banner */}
        <div className="w-full flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {callDuration > 2 ? 'Appel en cours' : 'Connexion...'}
          </span>
          <span className="font-mono">{formatTime(callDuration)}</span>
        </div>

        {/* Center Screen: Video or Avatar */}
        <div className="flex-1 flex flex-col items-center justify-center my-6">
          {isVideo && !isVideoOff ? (
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border border-neutral-700 bg-neutral-800 shadow-xl">
              <img
                src={partner.avatar}
                alt={partner.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 text-left">
                <p className="font-bold text-sm text-white">{partner.name}</p>
                <p className="text-[11px] text-emerald-300">Caméra active (HD)</p>
              </div>

              {/* Small PiP of current user */}
              <div className="absolute top-3 right-3 w-20 h-24 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-lg bg-black">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-emerald-500/80 shadow-2xl animate-pulse">
                  <img
                    src={partner.avatar}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {partner.name}
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                {partner.phone || 'Appel vocal sécurisé'}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Call Controls */}
        <div className="w-full flex items-center justify-center gap-4 pt-4 border-t border-neutral-800">
          {/* Mute Button */}
          <button
            id="btn-call-toggle-mute"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
            }`}
            title={isMuted ? 'Activer le micro' : 'Couper le micro'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video Toggle Button */}
          {isVideo && (
            <button
              id="btn-call-toggle-video"
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isVideoOff ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
              }`}
              title={isVideoOff ? 'Allumer la caméra' : 'Éteindre la caméra'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}

          {/* Speaker Button */}
          <button
            id="btn-call-toggle-speaker"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              !isSpeakerOn ? 'bg-neutral-800 text-neutral-500' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
            }`}
            title="Haut-parleur"
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            id="btn-end-call"
            onClick={endCall}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
            title="Raccrocher"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
