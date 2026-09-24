import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  X, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Smartphone, 
  Lock, 
  CheckCircle2, 
  Copy, 
  Film, 
  Share2, 
  Layers, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { FlexLogo } from '../common/FlexLogo';

interface FlexCommercialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Scene {
  id: number;
  duration: number; // in seconds
  title: string;
  tagline: string;
  voiceover: string;
  subtitles: string;
  themeColor: string;
  accentBadge: string;
}

const COMMERCIAL_SCENES: Scene[] = [
  {
    id: 1,
    duration: 7,
    title: "VOTRE VIE PRIVÉE MÉRITE MIEUX",
    tagline: "Fatigué des réseaux lents, intrusifs et saturés de pubs ?",
    voiceover: "Et si votre réseau social respectait enfin votre vie privée tout en étant dix fois plus rapide ?",
    subtitles: "⚡ Découvrez une nouvelle ère de communication instantanée.",
    themeColor: "from-violet-600 via-indigo-600 to-purple-800",
    accentBadge: "NOUVELLE GÉNÉRATION"
  },
  {
    id: 2,
    duration: 7,
    title: "SIMPLICITÉ ABSOLUE",
    tagline: "Inscription en 30 secondes. Zéro prise de tête.",
    voiceover: "Flex Online se configure en un clin d’œil : votre nom, votre pays, votre numéro, et un code de confirmation immédiat par SMS ou email. Vous y êtes !",
    subtitles: "📲 Accès instantané dans tous les pays du monde avec indicatif automatique.",
    themeColor: "from-blue-600 via-indigo-600 to-violet-700",
    accentBadge: "FACILITÉ DÉCONCERTANTE"
  },
  {
    id: 3,
    duration: 8,
    title: "SÉCURITÉ BLINDÉE",
    tagline: "Chiffrement de bout en bout & Protection SIM.",
    voiceover: "Vos messages et vos appels sont entièrement chiffrés. Code PIN secret, protection contre les intrusions et clé de récupération unique.",
    subtitles: "🔒 Vos conversations restent strictement entre vous et vos proches.",
    themeColor: "from-emerald-600 via-teal-600 to-indigo-800",
    accentBadge: "100% CONFIDENTIEL"
  },
  {
    id: 4,
    duration: 7,
    title: "TOUT-EN-UN SURPUISSANT",
    tagline: "Chat HD, Appels vidéo limpides, Fil d'actualité & Stories.",
    voiceover: "Partagez des stories vibrantes, discutez en groupe, passez des appels haute fidélité et basculez entre 2 comptes sur le même téléphone.",
    subtitles: "🚀 Synchronisation instantanée Mobile et PC Windows sans perte de qualité.",
    themeColor: "from-fuchsia-600 via-purple-600 to-indigo-800",
    accentBadge: "EXPÉRIENCE 5 ÉTOILES"
  },
  {
    id: 5,
    duration: 6,
    title: "REJOIGNEZ FLEX ONLINE",
    tagline: "La liberté de communiquer sans compromis.",
    voiceover: "Téléchargez Flex Online dès aujourd'hui. Simple, rapide, ultra-sécurisé. Flex Online, connectez-vous au futur !",
    subtitles: "✨ Disponible dès maintenant sur Web, Mobile et PC.",
    themeColor: "from-violet-600 via-indigo-500 to-fuchsia-600",
    accentBadge: "REJOIGNEZ-NOUS"
  }
];

const TOTAL_DURATION = COMMERCIAL_SCENES.reduce((acc, s) => acc + s.duration, 0); // 35 seconds

export const FlexCommercialModal: React.FC<FlexCommercialModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'video' | 'script'>('video');
  const [copiedScript, setCopiedScript] = useState(false);

  const heroImage = '/src/assets/images/flex_promo_hero_1790247752884.jpg';
  const securityImage = '/src/assets/images/flex_promo_security_1790247772202.jpg';

  // Calculate current scene based on currentTime
  let accumulatedTime = 0;
  let currentSceneIndex = 0;
  for (let i = 0; i < COMMERCIAL_SCENES.length; i++) {
    if (currentTime >= accumulatedTime && currentTime < accumulatedTime + COMMERCIAL_SCENES[i].duration) {
      currentSceneIndex = i;
      break;
    }
    accumulatedTime += COMMERCIAL_SCENES[i].duration;
  }
  if (currentTime >= TOTAL_DURATION) {
    currentSceneIndex = COMMERCIAL_SCENES.length - 1;
  }
  const currentScene = COMMERCIAL_SCENES[currentSceneIndex];

  // Animation ticker for video playback
  useEffect(() => {
    let interval: any;
    if (isOpen && isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL_DURATION) {
            return 0; // Loop or restart
          }
          return Math.min(prev + 0.1, TOTAL_DURATION);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  // Audio Speech Synthesizer for realistic voiceover when not muted
  const speakTimeoutRef = useRef<any>(null);
  const lastSpokenSceneRef = useRef<number>(-1);

  useEffect(() => {
    if (!isOpen || isMuted || !isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (currentSceneIndex !== lastSpokenSceneRef.current) {
      lastSpokenSceneRef.current = currentSceneIndex;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        clearTimeout(speakTimeoutRef.current);
        speakTimeoutRef.current = setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(currentScene.voiceover);
          utterance.lang = 'fr-FR';
          utterance.rate = 1.05;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        }, 150);
      }
    }
  }, [isOpen, isPlaying, isMuted, currentSceneIndex, currentScene.voiceover]);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentTime(0);
      setIsPlaying(true);
      lastSpokenSceneRef.current = -1;
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyScript = () => {
    const fullScript = `🎬 VIDÉO PUBLICITAIRE OFFICIELLE - FLEX ONLINE (35 SECONDES)
============================================================
STYLE : Dynamique, Futuriste, Épuré, Premium, Voix-off percutante
CIBLE : Utilisateurs de WhatsApp, Facebook, Telegram, grand public & professionnels.

--- SCÈNE 1 (0:00 - 0:07) : L'ACCROCHE & LE PROBLÈME ---
VISUEL : Écran noir avec pulsations néon violettes. Un smartphone s'illumine. Textes cinématiques.
VOIX OFF : "Et si votre réseau social respectait enfin votre vie privée tout en étant dix fois plus rapide ?"
SOUS-TITRES : ⚡ Découvrez une nouvelle ère de communication instantanée.
SOUND DESIGN : Montée de nappe électro synthwave avec impact puissant (Whoosh + Drop).

--- SCÈNE 2 (0:07 - 0:14) : LA FACILITÉ DÉCONCERTANTE ---
VISUEL : Démonstration éclair de l'inscription. Saisie du nom, pays avec drapeau, numéro, réception immédiate du code à 6 chiffres par SMS/email en 1 clic.
VOIX OFF : "Flex Online se configure en un clin d’œil : votre nom, votre pays, votre numéro, et un code de confirmation immédiat par SMS ou email. Vous y êtes !"
SOUS-TITRES : 📲 Accès instantané dans tous les pays du monde avec indicatif automatique.
SOUND DESIGN : Bips digitaux feutrés, confirmation 'Ding' de validation gratifiante.

--- SCÈNE 3 (0:14 - 0:22) : LA SÉCURITÉ BLINDÉE ---
VISUEL : Bouclier 3D émeraude et violet holographique. Animation de chiffrement de bout en bout et cadenas biométrique PIN.
VOIX OFF : "Vos messages et vos appels sont entièrement chiffrés. Code PIN secret, protection contre les intrusions et clé de récupération unique."
SOUS-TITRES : 🔒 Vos conversations restent strictement entre vous et vos proches.
SOUND DESIGN : Bruit mécanique de coffre-fort futuriste haute technologie.

--- SCÈNE 4 (0:22 - 0:29) : L'EXPÉRIENCE COMPLÈTE TOUT-EN-UN ---
VISUEL : Mosaïque fluide montrant les discussions instantanées, les appels vidéo HD sans coupure, le fil d'actualités communautaire et le mode 2 comptes sur le même téléphone.
VOIX OFF : "Partagez des stories vibrantes, discutez en groupe, passez des appels haute fidélité et basculez entre 2 comptes sur le même téléphone."
SOUS-TITRES : 🚀 Synchronisation instantanée Mobile et PC Windows sans perte de qualité.
SOUND DESIGN : Rythme entraînant, transition dynamique et fluide.

--- SCÈNE 5 (0:29 - 0:35) : LE CALL TO ACTION FINAL ---
VISUEL : Logo étincelant FLEX ONLINE en 3D avec aura néon violette. Badges "100% Gratuit & Sécurisé" et lien vers l'application.
VOIX OFF : "Téléchargez Flex Online dès aujourd'hui. Simple, rapide, ultra-sécurisé. Flex Online, connectez-vous au futur !"
SOUS-TITRES : ✨ Disponible dès maintenant sur Web, Mobile et PC.
SOUND DESIGN : Accord final triomphant et résonance stellaire.
============================================================`;

    navigator.clipboard.writeText(fullScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const progressPercentage = (currentTime / TOTAL_DURATION) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-3 sm:p-6 select-none animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-violet-900/50 rounded-3xl shadow-2xl shadow-violet-950/80 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-violet-950/60 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>Spot Publicitaire Officiel - Flex Online</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-widest">
                  35s 4K
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">Présentation spectaculaire de la facilité et de la sécurité</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex p-0.5 bg-neutral-900 rounded-xl border border-neutral-800">
              <button
                type="button"
                onClick={() => setActiveTab('video')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  activeTab === 'video'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Vidéo Spot
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('script')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  activeTab === 'script'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Storyboard & Script
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl border border-neutral-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Video Reel Simulator */}
        {activeTab === 'video' && (
          <div className="relative flex-1 flex flex-col bg-neutral-950 overflow-hidden">
            {/* Main Video Viewport (16:9 ratio style) */}
            <div className="relative w-full aspect-video sm:min-h-[380px] bg-gradient-to-br from-neutral-950 via-neutral-900 to-black overflow-hidden flex items-center justify-center">
              {/* Dynamic Background Image Layers with Parallax Zoom */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 opacity-35"
                style={{ 
                  backgroundImage: `url(${currentSceneIndex === 2 ? securityImage : heroImage})`,
                  filter: 'blur(2px)'
                }}
              />

              {/* Dynamic Atmospheric Glows matching scene theme */}
              <div 
                className={`absolute inset-0 bg-gradient-to-t ${currentScene.themeColor} opacity-25 mix-blend-screen transition-all duration-1000 pointer-events-none`} 
              />
              <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black pointer-events-none" />

              {/* Central Dynamic Stage */}
              <div className="relative z-10 max-w-xl text-center px-6 py-8 flex flex-col items-center">
                {/* Scene Indicator Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-violet-400/40 backdrop-blur-md mb-4 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-violet-300">
                    {currentScene.accentBadge} • SCÈNE {currentSceneIndex + 1}/5
                  </span>
                </div>

                {/* Main Dynamic Headline */}
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase drop-shadow-md mb-3 transition-all duration-500">
                  {currentScene.title}
                </h1>

                {/* Tagline */}
                <p className="text-sm sm:text-base font-semibold text-neutral-200 max-w-md drop-shadow mb-6">
                  {currentScene.tagline}
                </p>

                {/* Interactive Scene Specific Visual Elements */}
                {currentSceneIndex === 0 && (
                  <div className="flex items-center justify-center gap-3 animate-bounce">
                    <FlexLogo size="lg" />
                    <span className="text-lg font-black bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
                      FLEX ONLINE
                    </span>
                  </div>
                )}

                {currentSceneIndex === 1 && (
                  <div className="p-3 bg-neutral-900/90 border border-violet-500/40 rounded-2xl shadow-xl flex items-center gap-3 max-w-sm text-left">
                    <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-white block">Inscription en 30s</span>
                      <span className="text-[11px] text-neutral-400 block">Nom, Pays, Numéro et Code SIM immédiat.</span>
                    </div>
                  </div>
                )}

                {currentSceneIndex === 2 && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl shadow-xl flex items-center gap-3 max-w-sm text-left">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-emerald-200 block">Chiffrement Bout-en-Bout</span>
                      <span className="text-[11px] text-emerald-300/80 block">Code PIN 4 chiffres & Clé de secours inviolable.</span>
                    </div>
                  </div>
                )}

                {currentSceneIndex === 3 && (
                  <div className="grid grid-cols-3 gap-2 max-w-md">
                    <div className="p-2.5 bg-neutral-900/80 border border-violet-500/30 rounded-xl text-center">
                      <Smartphone className="w-5 h-5 mx-auto text-violet-400 mb-1" />
                      <span className="text-[10px] font-bold text-white block">2 Comptes</span>
                    </div>
                    <div className="p-2.5 bg-neutral-900/80 border border-violet-500/30 rounded-xl text-center">
                      <Sparkles className="w-5 h-5 mx-auto text-violet-400 mb-1" />
                      <span className="text-[10px] font-bold text-white block">Appels HD</span>
                    </div>
                    <div className="p-2.5 bg-neutral-900/80 border border-violet-500/30 rounded-xl text-center">
                      <Layers className="w-5 h-5 mx-auto text-violet-400 mb-1" />
                      <span className="text-[10px] font-bold text-white block">PC Windows</span>
                    </div>
                  </div>
                )}

                {currentSceneIndex === 4 && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl shadow-violet-900/60 text-white font-black text-xs sm:text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>100% Gratuit, Moderne & Indépendant</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">www.flexonline.network</span>
                  </div>
                )}
              </div>

              {/* Subtitles Overlay Bar at the bottom of the video */}
              <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
                <div className="max-w-xl mx-auto py-2 px-4 bg-black/75 backdrop-blur-md rounded-xl border border-white/10 text-center shadow-lg">
                  <p className="text-xs sm:text-sm text-neutral-100 font-medium tracking-wide">
                    {currentScene.subtitles}
                  </p>
                </div>
              </div>

              {/* Sound Status Pill in top right of video */}
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-white text-xs font-bold transition shadow-lg"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    <span>Son coupé</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Voix-off active</span>
                  </>
                )}
              </button>
            </div>

            {/* Video Controls & Progress Bar */}
            <div className="p-4 border-t border-violet-950/60 bg-neutral-950">
              {/* Progress Bar with Scene Markers */}
              <div className="relative mb-3 group cursor-pointer" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setCurrentTime(pos * TOTAL_DURATION);
              }}>
                <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 transition-all duration-100"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                {/* Scene markers */}
                <div className="absolute top-0 left-0 right-0 h-2.5 flex justify-between pointer-events-none px-0.5">
                  {COMMERCIAL_SCENES.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-0.5 h-full ${i <= currentSceneIndex ? 'bg-white/40' : 'bg-neutral-600/60'}`} 
                    />
                  ))}
                </div>
              </div>

              {/* Playback Buttons & Scene Selectors */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-md shadow-violet-900/40 transition active:scale-95"
                    title={isPlaying ? 'Pause' : 'Lecture'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTime(0);
                      setIsPlaying(true);
                    }}
                    className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl border border-neutral-800 transition"
                    title="Recommencer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <div className="text-xs font-mono text-neutral-400 pl-2">
                    <strong className="text-white">{Math.floor(currentTime)}s</strong> / {TOTAL_DURATION}s
                  </div>
                </div>

                {/* Quick Scene Jump Buttons */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {COMMERCIAL_SCENES.map((scene, idx) => (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => {
                        let t = 0;
                        for (let j = 0; j < idx; j++) t += COMMERCIAL_SCENES[j].duration;
                        setCurrentTime(t);
                        setIsPlaying(true);
                      }}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition ${
                        idx === currentSceneIndex
                          ? 'bg-violet-600 border-violet-400 text-white shadow-sm'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {idx + 1}. {scene.title.split(' ')[0]}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-neutral-200 rounded-xl transition"
                  >
                    <Copy className="w-3.5 h-3.5 text-violet-400" />
                    <span>{copiedScript ? 'Copié !' : 'Copier le script'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Storyboard & Voiceover Studio Guide */}
        {activeTab === 'script' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-neutral-950 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-violet-950/40 border border-violet-800/60 rounded-2xl">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-violet-400" />
                  <span>Guide de Tournage & Script Officiel (35 secondes)</span>
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Conçu pour TikTok, Instagram Reels, YouTube Shorts, télévision et pitch investisseurs.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyScript}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-violet-900/40 shrink-0"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedScript ? 'Texte copié !' : 'Copier tout le Script'}</span>
              </button>
            </div>

            {/* Scenes Breakdown Cards */}
            <div className="space-y-4">
              {COMMERCIAL_SCENES.map((scene, idx) => (
                <div 
                  key={scene.id} 
                  className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl hover:border-violet-800/80 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-violet-400 uppercase tracking-wider">
                      Scène {idx + 1} : {scene.title} ({scene.duration} secondes)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded-full border border-neutral-700">
                      {scene.accentBadge}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/60">
                      <span className="text-[10px] text-violet-400 uppercase font-bold block mb-1">
                        🎙️ Voix-Off (Ton dynamique, rassurant et énergique) :
                      </span>
                      <p className="text-white italic text-xs leading-relaxed">
                        « {scene.voiceover} »
                      </p>
                    </div>

                    <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/60">
                      <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">
                        🎬 Visuel & Action à l'écran :
                      </span>
                      <p className="text-neutral-300 leading-relaxed">
                        {scene.subtitles}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Production Recommendations */}
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-xs space-y-2 text-neutral-300">
              <h5 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>Conseils de montage pour un impact 5/5 :</span>
              </h5>
              <ul className="list-disc list-inside space-y-1 text-neutral-400 text-xs">
                <li><strong className="text-neutral-200">Rythme :</strong> Coupes rapides toutes les 1,5 à 2 secondes pour maintenir l'attention maximale sur TikTok et Instagram.</li>
                <li><strong className="text-neutral-200">Musique :</strong> Beat électro / trap futuriste moderne avec montée progressive et arrêt sec sur le slogan final.</li>
                <li><strong className="text-neutral-200">Éléments clés :</strong> Mettre en valeur la rapidité de confirmation (code SMS/mail) et l'icône de cadenas sécurisé.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
