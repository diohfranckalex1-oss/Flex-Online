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
  Smartphone, 
  Lock, 
  CheckCircle2, 
  Languages,
  Check,
  ChevronRight,
  UserCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { FlexLogo } from '../common/FlexLogo';

interface FlexCommercialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type SupportedLanguage = 'fr' | 'ci' | 'en' | 'es' | 'ar' | 'de' | 'pt' | 'it' | 'zh' | 'sw';

interface LangOption {
  code: SupportedLanguage;
  speechCode: string;
  name: string;
  flag: string;
}

export const COMMERCIAL_LANGUAGES: LangOption[] = [
  { code: 'fr', speechCode: 'fr-FR', name: 'Français (Franck Alex)', flag: '🇫🇷' },
  { code: 'ci', speechCode: 'fr-CI', name: 'Nouchi & Baoulé (Côte d\'Ivoire)', flag: '🇨🇮' },
  { code: 'en', speechCode: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'es', speechCode: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', speechCode: 'ar-SA', name: 'العربية', flag: '🇸🇦' },
  { code: 'de', speechCode: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', speechCode: 'pt-BR', name: 'Português', flag: '🇧🇷' },
  { code: 'it', speechCode: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', speechCode: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'sw', speechCode: 'sw-KE', name: 'Kiswahili', flag: '🇰🇪' },
];

interface SceneData {
  title: string;
  voiceover: string;
  subtitle: string;
}

interface Scene {
  id: number;
  duration: number; // in seconds
  themeGlow: string;
  image: string;
  translations: Record<SupportedLanguage, SceneData>;
}

const TOTAL_DURATION = 30; // 30 seconds clean presentation

export const FlexCommercialModal: React.FC<FlexCommercialModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('fr');
  const [showSubtitles, setShowSubtitles] = useState(true);
  
  // Available natural male voices found in browser
  const [availableMaleVoices, setAvailableMaleVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);

  // Franck Alex Photos
  const franckStudioImage = '/src/assets/images/franck_alex_dioh_presenter_1790753795291.jpg';
  const franckCloseupImage = '/src/assets/images/franck_alex_portrait_closeup_1790753805266.jpg';
  const securityImage = '/src/assets/images/flex_promo_security_1790247772202.jpg';

  const scenes: Scene[] = [
    {
      id: 1,
      duration: 7,
      themeGlow: 'from-teal-900/60 via-black to-emerald-950/60',
      image: franckStudioImage,
      translations: {
        fr: {
          title: "BIENVENUE SUR FLEX ONLINE",
          voiceover: "Salut ! C'est Franck Alex, j'ai 21 ans et j'ai créé Flex Online. J'en avais marre des réseaux lents, intrusifs et pleins de pubs. J'ai donc conçu une application moderne, ultra rapide et qui respecte vraiment votre vie privée.",
          subtitle: "👋 Salut, c'est Franck Alex (21 ans), créateur de Flex Online. Bienvenue sur la nouvelle version travaillée !"
        },
        ci: {
          title: "BIENVENUE SUR FLEX ONLINE",
          voiceover: "Salut la famille ! C'est Franck Alex, 21 ans, le créateur de Flex Online. Les réseaux qui coupent et qui vendent nos données là, c'est terminé ! J'ai travaillé une nouvelle version propre, rapide et sans drap.",
          subtitle: "🇨🇮 Salut la famille, c'est Franck Alex ! Découvrez la nouvelle version travaillée de Flex Online."
        },
        en: {
          title: "WELCOME TO FLEX ONLINE",
          voiceover: "Hey everyone! I'm Franck Alex, 21 years old and creator of Flex Online. Tired of slow networks packed with ads and trackers? I built a clean, ultra-fast and private social app for you.",
          subtitle: "👋 Hi, I'm Franck Alex (21 yo), creator of Flex Online. Welcome to the refined new version!"
        },
        es: {
          title: "BIENVENIDOS A FLEX ONLINE",
          voiceover: "¡Hola a todos! Soy Franck Alex, tengo 21 años y creé Flex Online. Cansado de redes lentas con publicidad, desarrollé una aplicación rápida, elegante y 100% privada.",
          subtitle: "👋 ¡Hola! Soy Franck Alex (21 años), creador de Flex Online. ¡Bienvenidos a la nueva versión!"
        },
        ar: {
          title: "مرحباً بكم في فليكس أونلاين",
          voiceover: "مرحباً بكم جميعاً! أنا فرانك أليكس، عمري 21 عاماً ومؤسس فليكس أونلاين. صممت لكم تطبيقاً سريعاً وخاصاً يحمي بياناتكم بالكامل.",
          subtitle: "👋 مرحباً، أنا فرانك أليكس (21 عاماً). مرحباً بكم في الإصدار الجديد المتطور من فليكس أونلاين!"
        },
        de: {
          title: "WILLKOMMEN BEI FLEX ONLINE",
          voiceover: "Hallo zusammen! Ich bin Franck Alex, 21 Jahre alt, Gründer von Flex Online. Ich habe eine saubere, blitzschnelle und private App entwickelt.",
          subtitle: "👋 Hallo! Ich bin Franck Alex (21 Jahre), Gründer von Flex Online."
        },
        pt: {
          title: "BEM-VINDO AO FLEX ONLINE",
          voiceover: "Olá a todos! Sou Franck Alex, 21 anos, criador do Flex Online. Desenvolvi um aplicativo moderno, ultrarrápido e focado em total privacidade.",
          subtitle: "👋 Olá, sou Franck Alex (21 anos). Bem-vindo à nova versão do Flex Online!"
        },
        it: {
          title: "BENVENUTI SU FLEX ONLINE",
          voiceover: "Ciao a tutti! Sono Franck Alex, 21 anni, creatore di Flex Online. Ho sviluppato un'app veloce, moderna e totalmente rispettosa della vostra privacy.",
          subtitle: "👋 Ciao! Sono Franck Alex (21 anni). Benvenuti nella nuova versione di Flex Online!"
        },
        zh: {
          title: "欢迎来到 FLEX ONLINE",
          voiceover: "大家好！我是弗兰克·亚历克斯，今年21岁，Flex Online 的创作者。我为你们精心打造了这款极速、纯净且真正保护隐私的全新应用。",
          subtitle: "👋 大家好！我是 Franck Alex（21岁），Flex Online 创作者。欢迎体验全新打磨的版本！"
        },
        sw: {
          title: "KARIBU FLEX ONLINE",
          voiceover: "Habari za leo! Mimi ni Franck Alex, miaka 21, mtengenezaji wa Flex Online. Nimeunda programu ya haraka, ya kisasa na salama kabisa kwa ajili yako.",
          subtitle: "👋 Habari! Mimi ni Franck Alex (miaka 21), mtengenezaji wa Flex Online."
        }
      }
    },
    {
      id: 2,
      duration: 8,
      themeGlow: 'from-emerald-950/60 via-black to-teal-900/60',
      image: franckCloseupImage,
      translations: {
        fr: {
          title: "INSCRIPTION EN 30 SECONDES",
          voiceover: "Première nouveauté majeure : l'inscription se fait en 30 secondes chrono ! Votre nom, votre pays, votre numéro de téléphone et un code SMS immédiat. Zéro formulaire compliqué, vous y êtes direct !",
          subtitle: "⚡ Inscription en 30 secondes chrono : Nom, pays, numéro et code SMS instantané."
        },
        ci: {
          title: "INSCRIPTION EN 30 SECONDES CHRONO",
          voiceover: "Côté inscription, c'est même pas 30 secondes ! Tu mets ton nom, ton pays, ton numéro et le code SMS tombe sur le champ. C'est calé net !",
          subtitle: "⚡ En 30 secondes c'est calé ! Nom, pays, numéro et code SMS direct."
        },
        en: {
          title: "SIGN UP IN 30 SECONDS",
          voiceover: "First major improvement: sign up takes just thirty seconds flat! Name, country, phone number, and an instant SMS code. No complicated passwords or endless forms!",
          subtitle: "⚡ Sign up in 30 seconds flat: Name, country, phone and instant SMS code."
        },
        es: {
          title: "REGISTRO EN 30 SEGUNDOS",
          voiceover: "¡El registro es instantáneo en 30 segundos! Ingresas tu nombre, país, número y código SMS inmediato. ¡Sin trámites molestos!",
          subtitle: "⚡ Registro en 30 segundos: Nombre, país, teléfono y código SMS inmediato."
        },
        ar: {
          title: "تسجيل فوري خلال 30 ثانية",
          voiceover: "التسجيل أسرع من أي وقت مضى في 30 ثانية فقط! اسمك، دولتك، رقمك ورمز التحقق الفوري.",
          subtitle: "⚡ تسجيل فوري خلال 30 ثانية: اسمك، دولتك، رقمك ورمز التأكيد."
        },
        de: {
          title: "ANMELDUNG IN 30 SEKUNDEN",
          voiceover: "Die Anmeldung dauert exakt 30 Sekunden! Name, Land, Telefonnummer und sofortiger Bestätigungscode.",
          subtitle: "⚡ Anmeldung in 30 Sekunden: Name, Land, Handynummer und SMS-Code."
        },
        pt: {
          title: "CADASTRO EM 30 SEGUNDOS",
          voiceover: "O cadastro leva exatamente 30 segundos! Nome, país, telefone e código SMS instantâneo.",
          subtitle: "⚡ Cadastro em 30 segundos: Nome, país, telefone e código SMS imediato."
        },
        it: {
          title: "REGISTRAZIONE IN 30 SECONDI",
          voiceover: "Registrazione lampo in 30 secondi! Nome, paese, numero e codice SMS immediato.",
          subtitle: "⚡ Registrazione in 30 secondi: Nome, paese, numero e codice SMS immediato."
        },
        zh: {
          title: "30秒极速注册",
          voiceover: "30秒极速注册体验！输入姓名、国家与手机号，验证码秒级到达，无需繁琐表格！",
          subtitle: "⚡ 30秒极速注册：姓名、国家、手机号及即时短信验证码。"
        },
        sw: {
          title: "KUJIANDIKISHA KWA SEKUNDE 30",
          voiceover: "Kujiandikisha ndani ya sekunde thelathini tu! Jina, nchi, nambari ya simu na msimbo wa SMS.",
          subtitle: "⚡ Kujiandikisha kwa sekunde 30 tu: Jina, nchi, simu na msimbo wa SMS."
        }
      }
    },
    {
      id: 3,
      duration: 8,
      themeGlow: 'from-teal-950/80 via-black to-emerald-900/60',
      image: securityImage,
      translations: {
        fr: {
          title: "SÉCURITÉ BLINDÉE ANTI-PIRATAGE",
          voiceover: "Pour la sécurité, j'ai blindé le système : chiffrement total de bout en bout, code PIN 4 chiffres secret et clé de secours unique. Personne ne peut pirater ou intercepter vos conversations.",
          subtitle: "🔒 Sécurité blindée : Chiffrement militaire de bout en bout, code PIN secret et clé de secours."
        },
        ci: {
          title: "SÉCURITÉ BLINDÉE ANTI-PIRATAGE",
          voiceover: "Au niveau de la sécurité, j'ai blindé ça cadeau ! Chiffrement complet, code secret, protection SIM. Aucun pirate ne peut mettre la main sur tes causeries !",
          subtitle: "🔒 Sécurité blindée cadeau : Chiffrement total, code secret, protection SIM."
        },
        en: {
          title: "BULLETPROOF ANTI-HACK SECURITY",
          voiceover: "On the security front, it's bulletproof: full end-to-end encryption, secret 4-digit PIN, and unique recovery key. Your conversations are strictly confidential.",
          subtitle: "🔒 Bulletproof security: Full end-to-end encryption, secret PIN, and master recovery key."
        },
        es: {
          title: "SEGURIDAD BLINDADA TOTAL",
          voiceover: "En seguridad, está blindado: cifrado completo de extremo a extremo, PIN secreto y clave única de recuperación.",
          subtitle: "🔒 Seguridad blindada: Cifrado de extremo a extremo, PIN secreto y clave única."
        },
        ar: {
          title: "أمان عسكري منيع ضد الاختراق",
          voiceover: "أمان متطور لا يُخترق: تشفير طرف لطرف، رمز PIN سري ومفتاح استرجاع فريد لضمان حماية محادثاتك.",
          subtitle: "🔒 أمان مشدد: تشفير طرف لطرف، رمز PIN سري ومفتاح استرجاع فريد."
        },
        de: {
          title: "KUGELSICHERE SICHERHEIT",
          voiceover: "Absolute Sicherheit: Ende-zu-Ende-Verschlüsselung, geheimer PIN-Code und einzigartiger Wiederherstellungsschlüssel.",
          subtitle: "🔒 Kugelsichere Sicherheit: Ende-zu-Ende-Verschlüsselung und geheimer PIN-Code."
        },
        pt: {
          title: "SEGURANÇA BLINDADA ANTI-HACK",
          voiceover: "Segurança de ponta: criptografia total de ponta a ponta, PIN secreto e chave única de recuperação.",
          subtitle: "🔒 Segurança blindada: Criptografia de ponta a ponta e PIN secreto."
        },
        it: {
          title: "SICUREZZA BLINDATA TOTALE",
          voiceover: "Sicurezza impenetrabile: crittografia end-to-end, PIN segreto e chiave di recupero unica.",
          subtitle: "🔒 Sicurezza blindata: Crittografia end-to-end e PIN segreto."
        },
        zh: {
          title: "银行级防黑客安全防护",
          voiceover: "在安全方面我做了全面加固：端到端全程加密、四位私密PIN码与离线恢复密钥，杜绝黑客窥探！",
          subtitle: "🔒 银行级防护：端到端加密、私密PIN码与独立恢复密钥。"
        },
        sw: {
          title: "USALAMA DINI DHIDI YA WADUKUZI",
          voiceover: "Usalama wa kiwango cha juu: usimbaji fiche wa mwanzo hadi mwisho, PIN ya siri na ufunguo wa kipekee.",
          subtitle: "🔒 Usalama wa kiwango cha juu: Usimbaji fiche na PIN ya siri."
        }
      }
    },
    {
      id: 4,
      duration: 7,
      themeGlow: 'from-[#0F6E56]/70 via-black to-teal-900/60',
      image: franckStudioImage,
      translations: {
        fr: {
          title: "APPELS HD, 2 COMPTES & 100% GRATUIT",
          voiceover: "Et enfin : des appels vidéo haute définition sans coupure, et le mode 2 comptes sur le même smartphone. C'est 100% gratuit et sans aucune pub. Rejoignez-nous dès maintenant sur Flex !",
          subtitle: "🚀 Appels vidéo HD, mode 2 comptes sur un smartphone, 100% gratuit et sans pub. Rejoignez Flex !"
        },
        ci: {
          title: "APPELS HD & 2 COMPTES DEDANS !",
          voiceover: "Et pour finir : les appels vidéo sont super clairs sans coupure, et tu peux gérer deux comptes sur le même phone. C'est cadeau, zéro pub ! Rejoins-nous dès aujourd'hui sur Flex !",
          subtitle: "🚀 Appels vidéo HD, mode 2 comptes sur un phone, 100% gratuit. On est ensemble !"
        },
        en: {
          title: "HD CALLS, DUAL ACCOUNTS & 100% FREE",
          voiceover: "And finally: crystal-clear HD video calls and dual-account mode on the same phone. 100% free and zero ads. Join us today on Flex Online!",
          subtitle: "🚀 Crystal HD calls, dual accounts on one phone, 100% free with no ads. Join Flex today!"
        },
        es: {
          title: "LLAMADAS HD, 2 CUENTAS Y 100% GRATIS",
          voiceover: "Y por último: videollamadas HD nítidas y modo 2 cuentas en el mismo móvil. 100% gratis y sin anuncios. ¡Únete ya a Flex Online!",
          subtitle: "🚀 Videollamadas HD, 2 cuentas en un teléfono, 100% gratis y sin anuncios."
        },
        ar: {
          title: "مكالمات HD وحسابان ومجاني 100%",
          voiceover: "وأخيراً: مكالمات فيديو فائقة الوضوح وخاصية حسابين على نفس الهاتف. مجاني 100% وبدون إعلانات. انضموا إلينا الآن!",
          subtitle: "🚀 مكالمات فيديو HD وحسابان على نفس الهاتف، مجاني 100% وبدون إعلانات."
        },
        de: {
          title: "HD-ANRUFE, 2 KONTEN & 100% KOSTENLOS",
          voiceover: "Und schließlich: Glasklare HD-Videoanrufe und 2 Konten auf einem Smartphone. 100% kostenlos und werbefrei. Kommen Sie zu Flex Online!",
          subtitle: "🚀 Kristallklare HD-Anrufe, 2 Konten auf einem Handy, 100% kostenlos und werbefrei."
        },
        pt: {
          title: "CHAMADAS HD, 2 CONTAS E 100% GRÁTIS",
          voiceover: "E por fim: chamadas em HD perfeitas e 2 contas no mesmo smartphone. 100% gratuito e sem anúncios. Junte-se ao Flex Online!",
          subtitle: "🚀 Chamadas HD, 2 contas no mesmo smartphone, 100% gratuito e sem anúncios."
        },
        it: {
          title: "CHIAMATE HD, 2 ACCOUNT E 100% GRATIS",
          voiceover: "E infine: videochiamate HD nitidissime e modalità 2 account sullo stesso telefono. 100% gratis e senza pubblicità. Vi aspetto su Flex!",
          subtitle: "🚀 Videochiamate HD, 2 account su un telefono, 100% gratis e senza pubblicità."
        },
        zh: {
          title: "高清视讯 • 双账号 • 纯净无广告",
          voiceover: "最后：超清稳定无延迟的视频通话、同部手机双账号畅快切换。完全免费、零广告打扰！现在就加入我们，尽享 Flex Online！",
          subtitle: "🚀 超清通话、单机双账号切换，永久免费、零广告。立即加入 Flex Online！"
        },
        sw: {
          title: "SIMU ZA HD, AKAUNTI 2 NA BURE 100%",
          voiceover: "Na hatimaye: simu za video za HD na akaunti 2 kwenye simu moja. Ni bure 100% bila matangazo. Karibu sana Flex Online!",
          subtitle: "🚀 Simu za HD, akaunti 2 kwenye simu moja, bure 100% bila matangazo. Karibu Flex!"
        }
      }
    }
  ];

  // Calculate current scene index based on currentTime
  let accumulatedTime = 0;
  let currentSceneIndex = 0;
  for (let i = 0; i < scenes.length; i++) {
    if (currentTime >= accumulatedTime && currentTime < accumulatedTime + scenes[i].duration) {
      currentSceneIndex = i;
      break;
    }
    accumulatedTime += scenes[i].duration;
  }
  if (currentTime >= TOTAL_DURATION) {
    currentSceneIndex = scenes.length - 1;
  }

  const currentScene = scenes[currentSceneIndex];
  const currentLangObj = COMMERCIAL_LANGUAGES.find(l => l.code === selectedLang) || COMMERCIAL_LANGUAGES[0];
  const currentSceneData = currentScene.translations[selectedLang] || currentScene.translations.fr;

  // Load natural male voices from browser SpeechSynthesis
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices || allVoices.length === 0) return;

      const langPrefix = currentLangObj.speechCode.split('-')[0].toLowerCase();

      // Find male voices matching language or natural
      const femaleNames = ['denise', 'julie', 'celine', 'hortense', 'zira', 'female', 'femme', 'elsa', 'victoria', 'samantha', 'karen', 'monica', 'alice', 'sara'];
      const maleVoices = allVoices.filter(v => {
        const name = v.name.toLowerCase();
        const matchesLang = v.lang.toLowerCase().startsWith(langPrefix);
        const isNotFemale = !femaleNames.some(f => name.includes(f));
        return matchesLang && isNotFemale;
      });

      // Priority for Neural, Natural, Google or high quality
      maleVoices.sort((a, b) => {
        const aScore = (a.name.includes('Natural') ? 10 : 0) + (a.name.includes('Google') ? 5 : 0) + (a.name.includes('Henri') || a.name.includes('Thomas') || a.name.includes('Paul') || a.name.includes('Ryan') ? 8 : 0);
        const bScore = (b.name.includes('Natural') ? 10 : 0) + (b.name.includes('Google') ? 5 : 0) + (b.name.includes('Henri') || b.name.includes('Thomas') || b.name.includes('Paul') || b.name.includes('Ryan') ? 8 : 0);
        return bScore - aScore;
      });

      if (maleVoices.length > 0) {
        setAvailableMaleVoices(maleVoices);
        setSelectedVoiceIndex(0);
      } else {
        // Fallback to any voice matching language
        const fallback = allVoices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));
        setAvailableMaleVoices(fallback);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, [currentLangObj.speechCode]);

  // Animation ticker for video playback
  useEffect(() => {
    let interval: any;
    if (isOpen && isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL_DURATION) {
            return 0; // Loop cleanly
          }
          return Math.min(prev + 0.1, TOTAL_DURATION);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  // Audio Speech Synthesizer for genuine human 21-year-old male voice
  const speakTimeoutRef = useRef<any>(null);
  const lastSpokenSceneRef = useRef<number>(-1);
  const lastSpokenLangRef = useRef<string>('');

  useEffect(() => {
    if (!isOpen || isMuted || !isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    const shouldSpeak = currentSceneIndex !== lastSpokenSceneRef.current || selectedLang !== lastSpokenLangRef.current;
    
    if (shouldSpeak) {
      lastSpokenSceneRef.current = currentSceneIndex;
      lastSpokenLangRef.current = selectedLang;

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        clearTimeout(speakTimeoutRef.current);

        speakTimeoutRef.current = setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(currentSceneData.voiceover);
          utterance.lang = currentLangObj.speechCode;
          
          // Young 21-year-old dynamic male voice parameters:
          // Slightly higher pitch (1.02) than deep bass, natural energetic speed (1.02)
          utterance.pitch = 1.02;
          utterance.rate = 1.02;

          if (availableMaleVoices.length > 0 && availableMaleVoices[selectedVoiceIndex]) {
            utterance.voice = availableMaleVoices[selectedVoiceIndex];
          }

          window.speechSynthesis.speak(utterance);
        }, 100);
      }
    }
  }, [isOpen, isPlaying, isMuted, currentSceneIndex, selectedLang, currentSceneData.voiceover, currentLangObj.speechCode, availableMaleVoices, selectedVoiceIndex]);

  // Reset when opening / closing
  useEffect(() => {
    if (isOpen) {
      setCurrentTime(0);
      setIsPlaying(true);
      lastSpokenSceneRef.current = -1;
      lastSpokenLangRef.current = '';
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const progressPercentage = (currentTime / TOTAL_DURATION) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-2 sm:p-4 select-none animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-neutral-950 border border-teal-700/60 rounded-3xl shadow-2xl shadow-teal-950/90 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* ========================================================================= */}
        {/* CLEAN MINIMALIST HEADER : FRANCK ALEX (CRÉATEUR 21 ANS) */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-teal-950/80 bg-neutral-950">
          
          {/* Franck Alex Profile Tag */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-teal-500 shadow-md shrink-0">
              <img 
                src={franckCloseupImage} 
                alt="Franck Alex Dioh (21 ans) - Créateur de Flex Online" 
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-black" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>Franck Alex Dioh</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 fill-teal-400/20" />
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Créateur • 21 ans
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Présentation officielle • Nouvelle version travaillée</p>
            </div>
          </div>

          {/* Right: Language Switcher & Close */}
          <div className="flex items-center gap-2">
            
            {/* Minimalist Language Switcher */}
            <div className="relative inline-flex items-center">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value as SupportedLanguage)}
                className="text-xs font-bold py-1.5 pl-6 pr-6 rounded-xl bg-neutral-900 border border-teal-700/50 text-teal-200 hover:border-teal-400 focus:outline-none cursor-pointer appearance-none shadow-sm"
                title="Choisir la langue de la voix"
              >
                {COMMERCIAL_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-neutral-900 text-white">
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
              <Languages className="w-3.5 h-3.5 absolute left-1.5 text-teal-400 pointer-events-none" />
              <ChevronRight className="w-3.5 h-3.5 absolute right-1.5 text-teal-400 pointer-events-none rotate-90" />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl border border-neutral-800 transition cursor-pointer"
              title="Fermer la présentation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIDEO STAGE : REAL FRANCK ALEX CINEMATIC 16:9 VIEWPORT */}
        {/* ========================================================================= */}
        <div className="relative w-full aspect-video sm:min-h-[300px] bg-neutral-950 overflow-hidden flex items-center justify-center">
          
          {/* Real Photo of Franck Alex presenting Flex */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-102"
            style={{ 
              backgroundImage: `url(${currentScene.image})`,
              filter: 'brightness(0.92) contrast(1.05)'
            }}
          />

          {/* Vignette & Ambient Glow */}
          <div className={`absolute inset-0 bg-gradient-to-t ${currentScene.themeGlow} opacity-35 mix-blend-screen pointer-events-none transition-all duration-700`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/30 pointer-events-none" />

          {/* Top Indicators */}
          <div className="absolute top-3 left-4 z-20 flex items-center gap-2 pointer-events-none">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono font-bold shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>FRANCK ALEX (21 ANS) EN DIRECT</span>
            </div>
          </div>

          {/* Audio toggle button top right */}
          <div className="absolute top-3 right-4 z-20">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/90 border border-white/20 text-white text-xs font-bold transition shadow-lg cursor-pointer"
              title={isMuted ? "Activer la voix de Franck" : "Couper le son"}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-[11px]">Son coupé</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                  <span className="text-[11px] font-bold">Voix de Franck ({currentLangObj.flag})</span>
                </>
              )}
            </button>
          </div>

          {/* Center Title & Scene Info */}
          <div className="relative z-10 max-w-lg text-center px-4 py-2 flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-teal-500/40 backdrop-blur-md mb-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-300">
                SCÈNE {currentSceneIndex + 1}/4
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight uppercase drop-shadow-lg mb-1">
              {currentSceneData.title}
            </h2>
          </div>

          {/* Clean Subtitles Overlay at bottom */}
          {showSubtitles && (
            <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none">
              <div className="max-w-xl mx-auto py-2 px-4 bg-black/80 backdrop-blur-md rounded-xl border border-teal-500/30 text-center shadow-xl">
                <p className="text-xs sm:text-sm text-neutral-100 font-medium tracking-wide">
                  {currentSceneData.subtitle}
                </p>
              </div>
            </div>
          )}

          {/* Live Waveform Indicator when Franck speaks */}
          {!isMuted && isPlaying && (
            <div className="absolute bottom-14 left-4 z-20 hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-teal-500/30 text-teal-300">
              <div className="w-1 h-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-4 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
              <div className="w-1 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
              <div className="w-1 h-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '50ms' }} />
              <span className="text-[10px] font-bold ml-1">Voix humaine (21 ans)</span>
            </div>
          )}
        </div>

        {/* Video Scrubber & Playback Bar */}
        <div className="px-4 py-2.5 border-t border-teal-950/80 bg-neutral-950">
          <div 
            className="relative mb-2 group cursor-pointer" 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              setCurrentTime(pos * TOTAL_DURATION);
            }}
          >
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#0F6E56] via-teal-500 to-[#1D9E75] transition-all duration-100"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition active:scale-95 cursor-pointer"
                title={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentTime(0);
                  setIsPlaying(true);
                }}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-800 transition cursor-pointer"
                title="Recommencer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <span className="text-[11px] font-mono text-neutral-400">
                <strong className="text-white">{Math.floor(currentTime)}s</strong> / {TOTAL_DURATION}s
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-black border transition cursor-pointer ${
                  showSubtitles ? 'bg-teal-600/30 text-teal-300 border-teal-500/40' : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                }`}
                title="Afficher/Masquer les sous-titres"
              >
                Sous-titres CC
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FICHE ESSENTIELLE : LES 4 PILIERS TRAVAILLÉS DE LA NOUVELLE VERSION */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-t border-teal-950/80 overflow-y-auto space-y-4">
          
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Les 4 Essentiels de la Nouvelle Version Travaillée</span>
            </h4>
            <span className="text-[10px] text-neutral-500 font-mono">v2.5 Stable & Chiffrée</span>
          </div>

          {/* 4 Clean Minimalist Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            
            {/* 1. Inscription 30s */}
            <div className="p-3 bg-neutral-900/80 border border-teal-900/40 rounded-2xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h5 className="text-xs font-black text-white">Inscription Éclair en 30s</h5>
                <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                  Votre nom, votre pays, votre numéro et réception directe du code SMS. Zéro formulaire interminable.
                </p>
              </div>
            </div>

            {/* 2. Sécurité blindée */}
            <div className="p-3 bg-neutral-900/80 border border-teal-900/40 rounded-2xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h5 className="text-xs font-black text-white">Sécurité Blindée Anti-Piratage</h5>
                <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                  Chiffrement bout en bout militaire, code PIN secret 4 chiffres et clé de récupération unique.
                </p>
              </div>
            </div>

            {/* 3. Appels HD & 2 Comptes */}
            <div className="p-3 bg-neutral-900/80 border border-teal-900/40 rounded-2xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4 text-teal-300" />
              </div>
              <div>
                <h5 className="text-xs font-black text-white">Appels Vidéo HD & 2 Comptes</h5>
                <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                  Deux comptes distincts sur le même smartphone et appels vidéo d'une netteté parfaite sans coupure.
                </p>
              </div>
            </div>

            {/* 4. 100% Gratuit & Respect */}
            <div className="p-3 bg-neutral-900/80 border border-teal-900/40 rounded-2xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-teal-300" />
              </div>
              <div>
                <h5 className="text-xs font-black text-white">100% Gratuit & Respect Privé</h5>
                <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                  Aucune publicité intrusive, aucune revente de données personnelles. Créé avec passion pour vous.
                </p>
              </div>
            </div>

          </div>

          {/* Action button */}
          <div className="pt-1 flex items-center justify-between gap-3">
            <span className="text-[11px] text-neutral-400">
              Conçu & développé par <strong>Dioh Franck Alex (21 ans)</strong>
            </span>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:opacity-90 text-white text-xs font-black rounded-xl shadow-lg shadow-teal-950/40 transition active:scale-95 cursor-pointer"
            >
              <span>Accéder à mes discussions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
