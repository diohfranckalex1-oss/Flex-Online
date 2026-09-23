import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneOff, 
  Phone,
  PhoneCall,
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX, 
  ShieldCheck,
  Sparkles,
  Radio,
  Timer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { callSounds } from '../../utils/callSounds';

export const CallModal: React.FC = () => {
  const { activeCall, endCall, currentUser, answerCall } = useApp();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [ringTimeRemaining, setRingTimeRemaining] = useState(40); // 40 seconds timeout line
  const [mediaPermissionState, setMediaPermissionState] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const ringTimerRef = useRef<any>(null);
  const callTimerRef = useRef<any>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const isIncoming = activeCall ? activeCall.recipient.id === currentUser.id : false;
  const partner = activeCall ? (isIncoming ? activeCall.caller : activeCall.recipient) : null;
  const isVideo = activeCall ? activeCall.type === 'video' : false;
  const isRinging = activeCall?.status === 'ringing';
  const isConnected = activeCall?.status === 'connected';

  // Request actual phone Microphone & Camera permissions
  useEffect(() => {
    if (!activeCall) return;

    let isMounted = true;
    setMediaPermissionState('requesting');
    setPermissionError(null);

    const constraints: MediaStreamConstraints = {
      audio: true,
      video: isVideo ? { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } : false,
    };

    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          if (!isMounted) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          localStreamRef.current = stream;
          setMediaPermissionState('granted');

          if (localVideoRef.current && isVideo) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn('Microphone / Camera access denied or unavailable:', err);
          if (!isMounted) return;
          setMediaPermissionState('denied');
          setPermissionError(
            isVideo
              ? "Autorisation micro et caméra requise sur votre téléphone"
              : "Autorisation microphone requise sur votre téléphone"
          );
        });
    } else {
      setMediaPermissionState('denied');
      setPermissionError("Périphérique média non supporté par ce navigateur");
    }

    return () => {
      isMounted = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
  }, [activeCall?.id, isVideo]);

  // Keep local video element synced to active camera stream
  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current && isVideo && !isVideoOff) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [mediaPermissionState, isVideo, isVideoOff, isConnected]);

  // Manage Sound and 40s Timer on Ringing State
  useEffect(() => {
    if (!activeCall) {
      callSounds.stopAll();
      setCallDuration(0);
      setRingTimeRemaining(40);
      if (ringTimerRef.current) clearInterval(ringTimerRef.current);
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      return;
    }

    if (activeCall.status === 'ringing') {
      // Start Ringing Sounds
      if (isIncoming) {
        callSounds.startIncomingRingtone();
      } else {
        callSounds.startOutgoingRing();
      }

      setRingTimeRemaining(40);
      // 40 seconds timeout line
      ringTimerRef.current = setInterval(() => {
        setRingTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(ringTimerRef.current);
            callSounds.stopAll();
            callSounds.playEndedTone();
            endCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } else if (activeCall.status === 'connected') {
      // Stop ringing and play connected chime
      callSounds.playConnectedChime();
      if (ringTimerRef.current) clearInterval(ringTimerRef.current);

      // Start duration timer
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      callSounds.stopAll();
      if (ringTimerRef.current) clearInterval(ringTimerRef.current);
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [activeCall?.id, activeCall?.status, isIncoming]);

  if (!activeCall || !partner) return null;

  const handleToggleSpeaker = () => {
    const nextState = !isSpeakerOn;
    setIsSpeakerOn(nextState);
    callSounds.setSpeaker(nextState);
  };

  const handleToggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = !nextState;
      });
    }
  };

  const handleToggleVideo = () => {
    const nextState = !isVideoOff;
    setIsVideoOff(nextState);
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = !nextState;
      });
    }
  };

  const handleAnswer = () => {
    callSounds.stopAll();
    answerCall();
  };

  const handleHangup = () => {
    callSounds.stopAll();
    callSounds.playEndedTone();
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    endCall();
  };

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div id="call-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-md sm:max-w-lg bg-neutral-900/95 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col items-center justify-between min-h-[520px] p-6 text-white text-center">
        
        {/* Top Header Status Bar */}
        <div className="w-full flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400 animate-ping'
            }`} />
            <span className={`font-bold ${isConnected ? 'text-emerald-400' : 'text-cyan-300'}`}>
              {isConnected 
                ? 'Appel en direct (Chiffré P2P)' 
                : isIncoming 
                ? 'Appel entrant...' 
                : 'Sonnerie en cours...'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-neutral-300 bg-neutral-950 px-2.5 py-1 rounded-xl border border-neutral-800">
            {isConnected ? (
              <span>{formatTime(callDuration)}</span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1 text-[11px]" title="Ligne d'attente maximale">
                <Timer className="w-3 h-3" />
                0:{ringTimeRemaining < 10 ? `0${ringTimeRemaining}` : ringTimeRemaining}
              </span>
            )}
          </div>
        </div>

        {/* Permission status warning or badge */}
        {permissionError && (
          <div className="w-full my-2 px-3 py-1.5 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center justify-center gap-2">
            <span>⚠️ {permissionError}</span>
          </div>
        )}
        {mediaPermissionState === 'granted' && (
          <div className="my-1 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isVideo ? 'Microphone & Caméra activés' : 'Microphone activé'}</span>
          </div>
        )}

        {/* Center Screen: Video or Avatar */}
        <div className="flex-1 w-full flex flex-col items-center justify-center my-4">
          {isVideo && !isVideoOff && isConnected ? (
            <div className="relative w-full max-w-sm h-72 sm:h-80 rounded-3xl overflow-hidden border border-neutral-700 bg-neutral-950 shadow-2xl">
              <img
                src={partner.avatar}
                alt={partner.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              
              <div className="absolute bottom-3 left-4 text-left">
                <p className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>{partner.name}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </p>
                <p className="text-[11px] text-emerald-300">Vidéo HD fluide • 1080p</p>
              </div>

              {/* PiP of Current User with real live camera stream */}
              <div className="absolute top-3 right-3 w-22 h-30 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-xl bg-black">
                {mediaPermissionState === 'granted' ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                  />
                ) : (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-1 right-1 px-1 rounded bg-black/60 text-[9px] text-white">
                  Moi
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {/* Pulsing Avatar Halo */}
              <div className="relative mb-5">
                <div className={`absolute inset-0 rounded-full blur-xl transition-all ${
                  isConnected 
                    ? 'bg-emerald-500/30' 
                    : isIncoming 
                    ? 'bg-emerald-500/40 animate-ping' 
                    : 'bg-cyan-500/30 animate-pulse'
                }`} />

                <div className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 shadow-2xl transition-all ${
                  isConnected 
                    ? 'ring-emerald-500' 
                    : isIncoming 
                    ? 'ring-emerald-400 scale-105' 
                    : 'ring-cyan-400'
                }`}>
                  <img
                    src={partner.avatar}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
                {partner.name}
              </h2>
              <p className="text-xs text-neutral-400 font-mono mb-2">
                {partner.phone || 'Appel Flex Online'}
              </p>

              {/* Audio Waveform Effect when Connected */}
              {isConnected && (
                <div className="flex items-center gap-1 mt-2 px-3 py-1.5 rounded-full bg-neutral-950 border border-neutral-800">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-400">Ligne active</span>
                  <div className="flex items-center gap-0.5 ml-2">
                    <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                  </div>
                </div>
              )}

              {/* Test / Simulate Answer Button during Outgoing Ringing */}
              {!isIncoming && isRinging && (
                <div className="mt-4 animate-fade-in">
                  <button
                    onClick={handleAnswer}
                    className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    title="Simuler le décrochage du destinataire"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Décrocher (Simuler réponse du contact)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Call Controls */}
        <div className="w-full pt-4 border-t border-neutral-800/80">
          
          {/* Incoming Call: Big GREEN to Answer & Big RED to Reject */}
          {isIncoming && isRinging ? (
            <div className="flex items-center justify-around w-full max-w-xs mx-auto animate-bounce-subtle">
              {/* Red Hangup/Reject Button */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  id="btn-call-reject"
                  onClick={handleHangup}
                  className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition active:scale-90"
                  title="Refuser l'appel"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
                <span className="text-xs font-bold text-rose-400">Raccrocher</span>
              </div>

              {/* Green Answer Button */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  id="btn-call-accept"
                  onClick={handleAnswer}
                  className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/50 transition active:scale-90 animate-pulse ring-4 ring-emerald-500/30"
                  title="Décrocher l'appel"
                >
                  <Phone className="w-7 h-7" />
                </button>
                <span className="text-xs font-bold text-emerald-400">Décrocher</span>
              </div>
            </div>
          ) : (
            /* Connected or Outgoing Call Controls */
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              {/* Mute Button */}
              <button
                id="btn-call-toggle-mute"
                onClick={handleToggleMute}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${
                  isMuted 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-inner' 
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
                title={isMuted ? 'Activer le micro' : 'Couper le micro'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Video Toggle Button */}
              {isVideo && (
                <button
                  id="btn-call-toggle-video"
                  onClick={handleToggleVideo}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${
                    isVideoOff 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50' 
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                  }`}
                  title={isVideoOff ? 'Allumer la caméra' : 'Éteindre la caméra'}
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>
              )}

              {/* Speaker Button (Haut-parleur) */}
              <button
                id="btn-call-toggle-speaker"
                onClick={handleToggleSpeaker}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${
                  isSpeakerOn 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-xs' 
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
                title={isSpeakerOn ? 'Haut-parleur actif' : 'Écouteur normal'}
              >
                {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              {/* End Call (Raccrocher en Rouge) */}
              <button
                id="btn-end-call"
                onClick={handleHangup}
                className="w-14 h-14 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition active:scale-95 ml-2"
                title="Raccrocher"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          )}

          <div className="mt-3 text-[10px] text-neutral-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Sécurité Flex • Ligne d’attente limitée à 40 secondes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
