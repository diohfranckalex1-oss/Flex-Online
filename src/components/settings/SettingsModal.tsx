import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Shield, 
  UserX, 
  Pin, 
  CheckCircle, 
  Laptop,
  Smartphone,
  Type,
  Users,
  Eye,
  PlusCircle,
  ArrowLeftRight,
  ShieldCheck,
  Star,
  Check,
  QrCode,
  Copy,
  Sparkles,
  UserCheck,
  BookOpen,
  Flag,
  ShieldAlert,
  Send,
  MessageSquare,
  Lock,
  Download,
  AlertTriangle,
  Sun,
  Moon,
  Palette,
  Image as ImageIcon,
  RefreshCw,
  Trash2,
  Zap,
  LogOut,
  Bell,
  Volume2,
  Globe,
  Search,
  Languages,
  Volume1
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FlexQRCodeScanner } from '../devices/FlexQRCodeScanner';
import { 
  getShieldBlockedCount, 
  isDecencyShieldEnabled, 
  setDecencyShieldEnabled 
} from '../../utils/moderationFilter';
import { DEFAULT_WALLPAPERS } from '../../utils/wallpaperPresets';
import { 
  SUPPORTED_LANGUAGES, 
  searchSupportedLanguages, 
  LanguageOption, 
  speakLanguageGreeting 
} from '../../utils/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    users, 
    conversations, 
    pinnedConversationIds, 
    blockedUserIds, 
    togglePinConversation, 
    blockUser,
    unblockUser, 
    reportUser,
    clearAllChatHistory, 
    updateSecurityPin,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    savedAccounts,
    switchAccount,
    removeLinkedAccount,
    openProfilePhotoModal,
    pairDevice,
    revokeDevice,
    setIsAuthModalOpen,
    themeMode,
    setThemeMode,
    chatWallpaper,
    setChatWallpaper,
    uploadCustomWallpaper,
    resetChatWallpaper,
    logoutUser,
    playNotificationSound,
    language,
    setLanguage,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'display' | 'languages' | 'notifications' | 'guide' | 'accounts' | 'devices' | 'security' | 'moderation' | 'chats'>('display');
  const wallpaperInputRef = React.useRef<HTMLInputElement>(null);
  const [newPin, setNewPin] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('Mon PC Windows');

  // Languages & Translation State
  const [langSearch, setLangSearch] = useState('');
  const [langCategory, setLangCategory] = useState<'all' | 'african_local' | 'international'>('all');
  const [langSuccessMsg, setLangSuccessMsg] = useState<string | null>(null);
  const [autoTranslateEnabled, setAutoTranslateEnabled] = useState(true);

  // Contact to block directly state
  const [contactToBlockId, setContactToBlockId] = useState<string>('');
  const [blockSuccessMsg, setBlockSuccessMsg] = useState<string | null>(null);

  // Report contact state
  const [reportTargetId, setReportTargetId] = useState<string>('');
  const [reportCustomTarget, setReportCustomTarget] = useState<string>('');
  const [reportReason, setReportReason] = useState<string>('spam');
  const [reportDetails, setReportDetails] = useState<string>('');
  const [reportAutoBlock, setReportAutoBlock] = useState<boolean>(true);
  const [reportSuccessMsg, setReportSuccessMsg] = useState<string | null>(null);

  // Bouclier automatique de pudeur & respect éthique
  const [shieldActive, setShieldActive] = useState<boolean>(() => isDecencyShieldEnabled());
  const [blockedCounter, setBlockedCounter] = useState<number>(() => getShieldBlockedCount());

  if (!isOpen) return null;

  const blockedUsersList = users.filter((u) => blockedUserIds.includes(u.id));
  const otherUsers = users.filter((u) => u.id !== currentUser.id && !blockedUserIds.includes(u.id));
  const pinnedConvsList = conversations.filter((c) => pinnedConversationIds.includes(c.id) || c.pinned);

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4 && /^\d+$/.test(newPin)) {
      updateSecurityPin(newPin);
      setPinSuccessMsg(true);
      setTimeout(() => setPinSuccessMsg(false), 3000);
      setNewPin('');
    }
  };

  const handleCopyRecovery = () => {
    if (currentUser.recoveryKey) {
      navigator.clipboard.writeText(currentUser.recoveryKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    }
  };

  const handlePairPc = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDeviceName.trim()) {
      pairDevice(newDeviceName.trim(), 'pc', 'Windows 11');
      setNewDeviceName('');
    }
  };

  const handleManualBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactToBlockId) {
      const target = users.find((u) => u.id === contactToBlockId);
      blockUser(contactToBlockId);
      setBlockSuccessMsg(`Le contact ${target?.name || ''} a été bloqué.`);
      setContactToBlockId('');
      setTimeout(() => setBlockSuccessMsg(null), 3000);
    }
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = reportTargetId || reportCustomTarget.trim();
    if (!targetId) return;

    reportUser(targetId, reportReason, reportDetails);
    if (reportAutoBlock && reportTargetId) {
      blockUser(reportTargetId);
    }

    setReportSuccessMsg('Signalement envoyé avec succès à l’équipe de sécurité Flex. Le compte a été neutralisé.');
    setReportTargetId('');
    setReportCustomTarget('');
    setReportDetails('');
    setTimeout(() => setReportSuccessMsg(null), 5000);
  };

  const handleForceUpdateApp = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }
    } catch (e) {
      console.warn('Error clearing caches:', e);
    }
    window.location.reload();
  };

  const handleFullResetApp = async () => {
    if (window.confirm('Voulez-vous supprimer les caches de l’ancienne version et réinitialiser l’application ? Cela rechargera la toute dernière version mise à jour.')) {
      try {
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map((name) => caches.delete(name)));
        }
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const reg of registrations) {
            await reg.unregister();
          }
        }
      } catch (e) {
        console.warn('Error clearing caches:', e);
      }
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-0 sm:p-4 sm:py-6 animate-fade-in text-neutral-100">
      <div 
        id="settings-main-modal"
        className="w-full sm:max-w-4xl lg:max-w-5xl h-[100dvh] sm:h-[90vh] bg-[#0c1614] border-0 sm:border sm:border-teal-700/60 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-teal-950/70 flex items-center justify-between bg-[#0d1f1b]/95 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#0F6E56] via-[#148366] to-[#1D9E75] text-white flex items-center justify-center shadow-lg shadow-teal-950/50 shrink-0">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                  Paramètres & Centre de Contrôle
                </h2>
                <span className="flex items-center gap-0.5 text-amber-400 text-xs font-bold bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-lg shrink-0">
                  <Star className="w-3 h-3 fill-amber-400" /> 5★
                </span>
              </div>
              <p className="text-xs text-teal-300/80 mt-1">
                Écritures, guide d'utilisation, 2 comptes, PC Windows, sécurité SIM et modération
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-neutral-400 hover:text-white rounded-2xl hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer"
            aria-label="Fermer les paramètres"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Navigation Tabs with clean breathing room and clear pills */}
        <div className="flex border-b border-teal-950/80 bg-[#0d1c18]/95 overflow-x-auto p-2.5 sm:p-3.5 gap-2 sm:gap-2.5 scrollbar-thin scrollbar-thumb-teal-900 scrollbar-track-transparent shrink-0">
          {/* Tab 1: Display & Font Size */}
          <button
            onClick={() => setActiveTab('display')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black shrink-0 transition-all cursor-pointer ${
              activeTab === 'display'
                ? 'bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white shadow-md shadow-teal-950/60 border border-teal-400/50'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Type className="w-4 h-4 text-teal-300" />
            <span>Écritures & Taille</span>
          </button>

          {/* Tab: Langues & Traduction Locale */}
          <button
            onClick={() => setActiveTab('languages')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black shrink-0 transition-all cursor-pointer ${
              activeTab === 'languages'
                ? 'bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white shadow-md shadow-teal-950/60 border border-teal-400/50'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Globe className="w-4 h-4 text-teal-300" />
            <span>Langues & Traduction</span>
          </button>

          {/* Tab: Sonnerie & Notifications */}
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black shrink-0 transition-all cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white shadow-md shadow-teal-950/60 border border-teal-400/50'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Bell className="w-4 h-4 text-teal-300" />
            <span>Sonnerie & Alertes</span>
          </button>

          {/* Tab 2: User Guide */}
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black shrink-0 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white shadow-md shadow-teal-950/60 border border-teal-400/50'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-teal-300" />
            <span>Guide d'utilisation</span>
          </button>

          {/* Tab 3: Multi-Accounts */}
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black shrink-0 transition-all cursor-pointer ${
              activeTab === 'accounts'
                ? 'bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white shadow-md shadow-teal-950/60 border border-teal-400/50'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Users className="w-4 h-4 text-teal-300" />
            <span>2 Comptes (Tél / PC)</span>
            {savedAccounts.length > 1 && (
              <span className="px-1.5 py-0.2 rounded-full bg-teal-950 text-teal-300 text-[10px] font-mono border border-teal-800">
                {savedAccounts.length}
              </span>
            )}
          </button>

          {/* Tab 4: Devices & Windows */}
          <button
            onClick={() => setActiveTab('devices')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black shrink-0 transition-all cursor-pointer ${
              activeTab === 'devices'
                ? 'bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white shadow-md shadow-teal-950/60 border border-teal-400/50'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Laptop className="w-4 h-4 text-teal-300" />
            <span>Windows & Mobile</span>
          </button>

          {/* Tab 5: Security & SIM */}
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black shrink-0 transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white shadow-md shadow-teal-950/60 border border-teal-400/50'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-teal-300" />
            <span>Sécurité Puce SIM</span>
          </button>

          {/* Tab 6: Moderation (Bloquer & Signaler) */}
          <button
            onClick={() => setActiveTab('moderation')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black shrink-0 transition-all cursor-pointer ${
              activeTab === 'moderation'
                ? 'bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white shadow-md shadow-teal-950/60 border border-teal-400/50'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Flag className="w-4 h-4 text-rose-400" />
            <span>Bloquer & Signaler</span>
            {blockedUsersList.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-950 text-rose-300 text-[10px] font-mono border border-rose-800">
                {blockedUsersList.length}
              </span>
            )}
          </button>

          {/* Tab 7: Chats & Moderation */}
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black shrink-0 transition-all cursor-pointer ${
              activeTab === 'chats'
                ? 'bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white shadow-md shadow-teal-950/60 border border-teal-400/50'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Pin className="w-4 h-4 text-teal-300" />
            <span>Discussions & Historique</span>
          </button>
        </div>

        {/* Tab Content Canvas with generous spacing and safe padding */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 pb-20 sm:pb-8">
          
          {/* ========================================================================= */}
          {/* --- TAB: DISPLAY & FONT SIZE --- */}
          {/* ========================================================================= */}
          {activeTab === 'display' && (
            <div className="space-y-6 sm:space-y-7 animate-fade-in">
              <div className="p-4 sm:p-5 bg-teal-950/30 border border-teal-900/60 rounded-3xl flex items-start gap-3.5">
                <div className="p-3 bg-teal-900/60 text-teal-300 rounded-2xl shrink-0">
                  <Type className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Taille des écritures (Plus besoin de zoomer !)
                  </h3>
                  <p className="text-xs text-teal-300/80 mt-1 leading-relaxed">
                    Ajustez directement la taille du texte de l'application selon votre confort visuel. Les messages, menus et titres s'adaptent instantanément sur tous vos écrans.
                  </p>
                </div>
              </div>

              {/* Font Size Selector Cards with spacious gap */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                {/* Normal */}
                <button
                  onClick={() => setFontSize('normal')}
                  className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
                    fontSize === 'normal'
                      ? 'bg-teal-950/60 border-teal-400 text-white ring-2 ring-teal-500/30'
                      : 'bg-[#0d1815] border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-neutral-400">Standard</span>
                    {fontSize === 'normal' && <Check className="w-4 h-4 text-teal-400" />}
                  </div>
                  <p className="text-sm font-semibold">Taille normale</p>
                  <p className="text-xs text-neutral-400 mt-1">Pour les écrans à haute résolution.</p>
                </button>

                {/* Large (Default) */}
                <button
                  onClick={() => setFontSize('large')}
                  className={`p-4 sm:p-5 rounded-2xl border text-left transition-all relative ${
                    fontSize === 'large'
                      ? 'bg-teal-950/60 border-teal-400 text-white ring-2 ring-teal-500/30'
                      : 'bg-[#0d1815] border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md">
                    Recommandé
                  </span>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-teal-300">Grand (Idéal)</span>
                    {fontSize === 'large' && <Check className="w-4 h-4 text-teal-400" />}
                  </div>
                  <p className="text-base font-bold">Écriture Grande</p>
                  <p className="text-xs text-teal-300/80 mt-1">Lecture très fluide sans aucune fatigue visuelle.</p>
                </button>

                {/* Extra Large */}
                <button
                  onClick={() => setFontSize('xlarge')}
                  className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
                    fontSize === 'xlarge'
                      ? 'bg-teal-950/60 border-teal-400 text-white ring-2 ring-teal-500/30'
                      : 'bg-[#0d1815] border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-neutral-400">Très Grand</span>
                    {fontSize === 'xlarge' && <Check className="w-4 h-4 text-teal-400" />}
                  </div>
                  <p className="text-lg font-black">Très Grande</p>
                  <p className="text-xs text-neutral-400 mt-1">Lecture maximale sans jamais zoomer.</p>
                </button>
              </div>

              {/* Interactive Live Preview */}
              <div className="p-4 sm:p-5 bg-[#0c1614] border border-teal-950/80 rounded-3xl space-y-3.5">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Aperçu en direct de vos discussions :</span>
                <div className="flex flex-col gap-2.5">
                  <div className="self-start max-w-[85%] sm:max-w-[80%] p-3.5 sm:p-4 bg-neutral-800 rounded-2xl rounded-tl-xs text-white">
                    <p className={`${fontSize === 'xlarge' ? 'text-lg' : fontSize === 'large' ? 'text-base' : 'text-sm'} font-medium`}>
                      Bonjour Franck ! Les écritures sont parfaitement lisibles et confortables.
                    </p>
                    <span className="text-[10px] text-neutral-400 block text-right mt-1">14:32</span>
                  </div>
                  <div className="self-end max-w-[85%] sm:max-w-[80%] p-3.5 sm:p-4 bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] rounded-2xl rounded-tr-xs text-white shadow-lg shadow-teal-950/40">
                    <p className={`${fontSize === 'xlarge' ? 'text-lg' : fontSize === 'large' ? 'text-base' : 'text-sm'} font-medium`}>
                      Parfait ! L'écran ne bouge pas et reste stable pendant la saisie.
                    </p>
                    <span className="text-[10px] text-teal-200 block text-right mt-1">14:33 ✓✓</span>
                  </div>
                </div>
              </div>

              {/* --- Section Caractère des écritures (Police typographique) --- */}
              <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-3xl space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-teal-900/60 text-teal-300 rounded-2xl shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      Caractère des écritures (Style & Police typographique)
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Choisissez l'ambiance et la forme des lettres : contemporaine, douce et arrondie, classique ou technologique.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                  {/* Poppins */}
                  <button
                    type="button"
                    onClick={() => setFontFamily('poppins')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      fontFamily === 'poppins'
                        ? 'bg-teal-950/60 border-teal-400 text-white ring-2 ring-teal-500/40'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wide">Moderne & Dynamique</span>
                      {fontFamily === 'poppins' && <Check className="w-4 h-4 text-teal-400" />}
                    </div>
                    <p className="text-base font-bold text-white font-['Poppins']">Poppins & Inter</p>
                    <p className="text-[11px] text-neutral-400 mt-1">Caractère équilibré, géométrique et chic.</p>
                  </button>

                  {/* Quicksand / Rounded */}
                  <button
                    type="button"
                    onClick={() => setFontFamily('rounded')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      fontFamily === 'rounded'
                        ? 'bg-teal-950/60 border-teal-400 text-white ring-2 ring-teal-500/40'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide">Douce & Conviviale</span>
                      {fontFamily === 'rounded' && <Check className="w-4 h-4 text-teal-400" />}
                    </div>
                    <p className="text-base font-bold text-white font-['Quicksand']">Quicksand Ronde</p>
                    <p className="text-[11px] text-neutral-400 mt-1">Courbes chaleureuses, reposantes et accueillantes.</p>
                  </button>

                  {/* System */}
                  <button
                    type="button"
                    onClick={() => setFontFamily('system')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      fontFamily === 'system'
                        ? 'bg-teal-950/60 border-teal-400 text-white ring-2 ring-teal-500/40'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wide">Native & Rapide</span>
                      {fontFamily === 'system' && <Check className="w-4 h-4 text-teal-400" />}
                    </div>
                    <p className="text-base font-bold text-white">Système Standard</p>
                    <p className="text-[11px] text-neutral-400 mt-1">Écriture native du téléphone ou de l'ordinateur.</p>
                  </button>

                  {/* Serif / Merriweather */}
                  <button
                    type="button"
                    onClick={() => setFontFamily('serif')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      fontFamily === 'serif'
                        ? 'bg-teal-950/60 border-teal-400 text-white ring-2 ring-teal-500/40'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">Noble & Littéraire</span>
                      {fontFamily === 'serif' && <Check className="w-4 h-4 text-teal-400" />}
                    </div>
                    <p className="text-base font-bold text-white font-serif">Merriweather Prestige</p>
                    <p className="text-[11px] text-neutral-400 mt-1">Typographie raffinée avec empattements élégants.</p>
                  </button>

                  {/* JetBrains Mono */}
                  <button
                    type="button"
                    onClick={() => setFontFamily('mono')}
                    className={`p-3.5 rounded-2xl border text-left transition-all sm:col-span-2 md:col-span-1 ${
                      fontFamily === 'mono'
                        ? 'bg-teal-950/60 border-teal-400 text-white ring-2 ring-teal-500/40'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">Tech & Code</span>
                      {fontFamily === 'mono' && <Check className="w-4 h-4 text-teal-400" />}
                    </div>
                    <p className="text-base font-bold text-white font-mono">JetBrains Tech</p>
                    <p className="text-[11px] text-neutral-400 mt-1">Monospace précis, style développeur & tech.</p>
                  </button>
                </div>
              </div>

              {/* --- Section Teint de l'écran (Noir Sombre / Blanc Lumineux) --- */}
              <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-3xl space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-teal-900/60 text-teal-300 rounded-2xl shrink-0">
                    {themeMode === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      Teint de l'écran (Mode Sombre ou Blanc)
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Basculez entre le noir profond pour préserver vos yeux la nuit ou le blanc lumineux pour un contraste éclatant le jour.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Teint Noir Sombre */}
                  <button
                    type="button"
                    onClick={() => setThemeMode('dark')}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      themeMode === 'dark'
                        ? 'bg-neutral-900 border-teal-400 ring-2 ring-teal-500/40 text-white'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-black border border-neutral-700 flex items-center justify-center text-teal-400 shadow-md">
                        <Moon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm block text-white">Teint Noir (Sombre)</span>
                        <span className="text-[11px] text-neutral-400">Élégant, OLED & reposant</span>
                      </div>
                    </div>
                    {themeMode === 'dark' && <Check className="w-5 h-5 text-teal-400" />}
                  </button>

                  {/* Teint Blanc Lumineux */}
                  <button
                    type="button"
                    onClick={() => setThemeMode('light')}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      themeMode === 'light'
                        ? 'bg-neutral-900 border-teal-400 ring-2 ring-teal-500/40 text-white'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-neutral-300 flex items-center justify-center text-amber-500 shadow-md">
                        <Sun className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm block text-white">Teint Blanc (Lumineux)</span>
                        <span className="text-[11px] text-neutral-400">Clair, net & éclatant le jour</span>
                      </div>
                    </div>
                    {themeMode === 'light' && <Check className="w-5 h-5 text-teal-400" />}
                  </button>
                </div>
              </div>

              {/* --- Section Tableau de discussion & Fond d'écran --- */}
              <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-3xl space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-teal-900/60 text-teal-300 rounded-2xl shrink-0">
                    <Palette className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-black text-white">
                      Couleur du tableau de discussion (Fond d'écran)
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Personnalisez l'arrière-plan de vos conversations avec des nuances subtiles ou en choisissant une photo dans votre galerie.
                    </p>
                  </div>
                </div>

                {/* Upload from Gallery Button */}
                <input
                  type="file"
                  ref={wallpaperInputRef}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await uploadCustomWallpaper(file);
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />

                <div className="p-3 bg-neutral-900/90 rounded-2xl border border-teal-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-teal-900/60 text-teal-300">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Choisir une image dans votre galerie</p>
                      <p className="text-[11px] text-neutral-400">Photo personnelle, souvenir ou paysage</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => wallpaperInputRef.current?.click()}
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:opacity-90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Parcourir ma galerie</span>
                  </button>
                </div>

                {/* Presets List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-300">
                      12 Couleurs et Nuances de discussion :
                    </span>
                    <span className="text-[11px] font-semibold text-teal-300 bg-teal-950/60 border border-teal-800/50 px-2 py-0.5 rounded-full">
                      12 nuances au choix
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                    {DEFAULT_WALLPAPERS.map((wp) => {
                      const isSelected = chatWallpaper.id === wp.id;
                      return (
                        <button
                          key={wp.id}
                          type="button"
                          onClick={() => setChatWallpaper(wp)}
                          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                            isSelected
                              ? 'border-teal-400 bg-teal-950/40 ring-2 ring-teal-500/50'
                              : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
                          }`}
                        >
                          <div
                            className="w-full h-8 rounded-lg shadow-inner border border-white/10"
                            style={{
                              background: wp.type === 'gradient' ? wp.value : wp.value,
                            }}
                          />
                          <span className="text-[11px] font-semibold text-neutral-200 truncate w-full text-center">
                            {wp.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {chatWallpaper.type === 'image' && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-teal-300 font-medium">✓ Image personnalisée de la galerie active</span>
                    <button
                      type="button"
                      onClick={resetChatWallpaper}
                      className="text-neutral-400 hover:text-white underline font-semibold"
                    >
                      Rétablir le fond par défaut
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* --- TAB: LANGUES & TRADUCTION LOCALE UNIVERSELLE --- */}
          {/* ========================================================================= */}
          {activeTab === 'languages' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Banner */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-950/80 via-[#0d2a23] to-emerald-950/80 border border-teal-800/60 rounded-3xl flex items-start gap-3.5 shadow-xl">
                <div className="p-3 bg-teal-900/60 text-teal-300 rounded-2xl shrink-0 shadow-md">
                  <Globe className="w-6 h-6 animate-spin-slow" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-white">
                      Langues & Traduction Locale Universelle
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/40 text-[10px] font-bold">
                      Toutes les langues & dialectes
                    </span>
                  </div>
                  <p className="text-xs text-teal-200/90 mt-1 leading-relaxed">
                    Traduisez Flex Online dans votre langue locale ou maternelle sans difficulté. Une flexibilité absolue pensée pour que chacun dans le monde et en Afrique puisse échanger dans sa propre langue.
                  </p>
                </div>
              </div>

              {/* Feedback Success Notification */}
              {langSuccessMsg && (
                <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-emerald-200 animate-fade-in shadow-lg">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{langSuccessMsg}</span>
                </div>
              )}

              {/* Card 1: Langue Actuellement Sélectionnée */}
              {(() => {
                const currentOption = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
                return (
                  <div className="p-4 sm:p-5 bg-neutral-900/90 border border-teal-900/50 rounded-3xl space-y-3 shadow-xl">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl filter drop-shadow">{currentOption.flag}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-black text-white">
                              {currentOption.name}
                            </h4>
                            <span className="text-xs font-semibold text-teal-300">
                              ({currentOption.nativeName})
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400">
                            Région : {currentOption.region} • Direction : {currentOption.dir === 'rtl' ? 'Droite à gauche (RTL)' : 'Gauche à droite (LTR)'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => speakLanguageGreeting(currentOption)}
                          className="px-3 py-1.5 rounded-xl bg-teal-950 hover:bg-teal-900 text-teal-300 border border-teal-700/60 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                          title="Écouter la prononciation"
                        >
                          <Volume1 className="w-3.5 h-3.5" />
                          <span>Écouter</span>
                        </button>
                        <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold flex items-center gap-1">
                          <Check className="w-3 h-3 text-teal-400" />
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Card 2: Recherche & Filtres de Langues */}
              <div className="p-4 sm:p-5 bg-neutral-900/90 border border-teal-900/50 rounded-3xl space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      placeholder="Rechercher une langue, un pays ou une région (ex: Baoulé, Wolof, Dioula, Anglais, Côte d'Ivoire)..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-950 border border-neutral-800 focus:border-teal-500 focus:outline-hidden text-xs sm:text-sm text-white placeholder-neutral-500 transition"
                    />
                    {langSearch && (
                      <button
                        onClick={() => setLangSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
                    <button
                      type="button"
                      onClick={() => setLangCategory('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                        langCategory === 'all'
                          ? 'bg-teal-600 text-white shadow-md'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      Toutes ({SUPPORTED_LANGUAGES.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setLangCategory('african_local')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                        langCategory === 'african_local'
                          ? 'bg-teal-600 text-white shadow-md'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      🌍 Africaines & Locales
                    </button>
                    <button
                      type="button"
                      onClick={() => setLangCategory('international')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                        langCategory === 'international'
                          ? 'bg-teal-600 text-white shadow-md'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      🌐 Internationales
                    </button>
                  </div>
                </div>

                {/* Grid of Languages */}
                {(() => {
                  const filteredLanguages = searchSupportedLanguages(langSearch, langCategory);
                  if (filteredLanguages.length === 0) {
                    return (
                      <div className="py-8 text-center text-neutral-400 space-y-2">
                        <Globe className="w-8 h-8 text-neutral-600 mx-auto" />
                        <p className="text-sm font-semibold">Aucune langue trouvée pour "{langSearch}"</p>
                        <p className="text-xs text-neutral-500">Essayez une autre recherche ou parcourez la liste complète.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-teal-900 scrollbar-track-transparent">
                      {filteredLanguages.map((item) => {
                        const isSelected = language === item.code;
                        return (
                          <div
                            key={item.code}
                            onClick={() => {
                              setLanguage(item.code);
                              playNotificationSound();
                              setLangSuccessMsg(`Langue activée avec succès : ${item.name} (${item.nativeName})`);
                              if (typeof document !== 'undefined') {
                                document.documentElement.lang = item.code;
                                document.documentElement.dir = item.dir || 'ltr';
                              }
                              setTimeout(() => setLangSuccessMsg(null), 4000);
                            }}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                              isSelected
                                ? 'bg-gradient-to-br from-teal-950 via-[#0d2a23] to-[#12382f] border-teal-400 text-white ring-2 ring-teal-500/50 shadow-lg shadow-teal-950/70'
                                : 'bg-neutral-950/70 border-neutral-800 text-neutral-300 hover:border-teal-700/60 hover:bg-neutral-900'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-2xl shrink-0">{item.flag}</span>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-white truncate">
                                    {item.name}
                                  </p>
                                  <p className="text-[11px] font-semibold text-teal-300/90 truncate">
                                    {item.nativeName}
                                  </p>
                                </div>
                              </div>
                              {isSelected ? (
                                <span className="w-5 h-5 rounded-full bg-teal-500 text-neutral-950 flex items-center justify-center shrink-0">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    speakLanguageGreeting(item);
                                  }}
                                  className="p-1 rounded-lg text-neutral-500 hover:text-teal-300 hover:bg-teal-950/60 opacity-0 group-hover:opacity-100 transition"
                                  title="Prononciation"
                                >
                                  <Volume1 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-400">
                              <span className="truncate max-w-[170px]">{item.region}</span>
                              <span className="px-1.5 py-0.2 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 uppercase font-mono font-bold">
                                {item.code}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Card 3: Flexibilité & Traduction Instantanée des Conversations */}
              <div className="p-4 sm:p-5 bg-neutral-900/90 border border-teal-900/50 rounded-3xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-teal-950 text-teal-300 rounded-xl border border-teal-700/60">
                      <Languages className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Traduction Automatique des Messages Reçus
                      </h4>
                      <p className="text-xs text-neutral-400">
                        Affiche la traduction dans votre langue préférée en un clin d'œil
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoTranslateEnabled}
                      onChange={(e) => setAutoTranslateEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#0F6E56] peer-checked:to-[#1D9E75]" />
                  </label>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  Lorsque cette option est activée, Flex Online détecte automatiquement la langue des messages de vos correspondants mondiaux (sur Hi Flex ou dans vos discussions) et vous permet de les lire directement dans votre langue locale.
                </p>

                <div className="p-3 bg-[#0a1613] border border-teal-800/40 rounded-2xl flex items-center justify-between text-xs text-teal-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    <span>Moteur linguistique Flex 5 étoiles opérationnel</span>
                  </div>
                  <span className="text-[11px] text-teal-400 font-mono font-bold">100% Flexible</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* --- TAB: NOTIFICATIONS & SONNERIE DU TÉLÉPHONE --- */}
          {/* ========================================================================= */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-950/70 to-emerald-950/70 border border-teal-800/60 rounded-3xl flex items-start gap-3.5 shadow-lg">
                <div className="p-3 bg-teal-900/60 text-teal-300 rounded-2xl shrink-0">
                  <Bell className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Sonnerie de Message & Alertes Téléphone
                  </h3>
                  <p className="text-xs text-teal-200/90 mt-1 leading-relaxed">
                    Sur Flex Online, chaque nouveau message, réponse d'IA ou notification est signalé par une sonnerie mélodieuse et le vibreur de votre smartphone.
                  </p>
                </div>
              </div>

              {/* Card 1: Tester la sonnerie */}
              <div className="p-5 sm:p-6 bg-neutral-900/90 border border-teal-900/50 rounded-3xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-950 border border-teal-700/60 flex items-center justify-center text-teal-400">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Sonnerie de notification des messages</h4>
                      <p className="text-xs text-neutral-400">Carillon haute-fidélité + Vibration double pulsation</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Active 24/7
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  Testez immédiatement la tonalité sur votre téléphone pour vous assurer que le volume de votre appareil est optimal.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      playNotificationSound();
                    }}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:from-[#138367] hover:to-[#22b587] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-950/60 transition active:scale-95 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Tester la sonnerie du message (Carillon & Vibreur) 🔔</span>
                  </button>

                  {typeof window !== 'undefined' && 'Notification' in window && (
                    <button
                      type="button"
                      onClick={() => {
                        Notification.requestPermission().then((perm) => {
                          if (perm === 'granted') {
                            new Notification('Flex Online', {
                              body: '🔔 Sonnerie et notifications du téléphone configurées avec succès !',
                              icon: '/flex_ai_robot_avatar.jpg',
                            });
                            playNotificationSound();
                          }
                        });
                      }}
                      className="px-4 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-teal-200 hover:text-white font-bold text-xs flex items-center gap-2 border border-neutral-700 transition active:scale-95 cursor-pointer"
                    >
                      <Bell className="w-4 h-4 text-teal-400" />
                      <span>Activer alertes écran verrouillé</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Card 2: Signal "Thinking" de Flex IA */}
              <div className="p-5 sm:p-6 bg-neutral-900/90 border border-teal-900/50 rounded-3xl space-y-3 shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-950 border border-teal-700/60 flex items-center justify-center text-teal-300">
                    <Sparkles className="w-5 h-5 text-teal-300 animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Signal "Thinking..." de Flex IA</h4>
                    <p className="text-xs text-neutral-400">Indicateur visuel en direct de recherche de l'IA</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  Lorsque vous interrogez l'Intelligence Artificielle, l'application signale <strong className="text-teal-300 font-bold">"Thinking..."</strong> dans l'en-tête de la discussion et affiche une bulle animée avec le robot officiel. Cela vous assure que l'IA explore activement ses connaissances universelles pour vous apporter la réponse la plus complète.
                </p>

                <div className="p-3 bg-teal-950/40 border border-teal-800/40 rounded-2xl flex items-center gap-2 text-xs text-teal-200">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping shrink-0" />
                  <span>Dès que la réponse est prête, votre téléphone sonne et vibre automatiquement.</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* --- TAB: GUIDE D'UTILISATION (COMMENT UTILISER L'APPLICATION) --- */}
          {/* ========================================================================= */}
          {activeTab === 'guide' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-gradient-to-r from-teal-950/60 to-emerald-950/60 border border-teal-800/60 rounded-3xl flex items-start gap-3.5">
                <div className="p-2.5 bg-teal-900/60 text-teal-300 rounded-2xl shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Guide Complet : Comment utiliser Flex Online
                  </h3>
                  <p className="text-xs text-teal-300/80 mt-1 leading-relaxed">
                    Retrouvez ici toutes les explications simples pour tirer le meilleur parti de votre application.
                  </p>
                </div>
              </div>

              {/* Guide Steps */}
              <div className="space-y-3.5">
                {/* Step 1 */}
                <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5 text-teal-300 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-teal-900/80 text-teal-300 flex items-center justify-center text-xs font-mono">1</span>
                    <h4 className="text-white">Envoyer des messages, vocaux et photos</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pl-8">
                    Dans une conversation, tapez votre texte en bas. Pour envoyer une note vocale, maintenez ou cliquez sur le micro. Pour partager des images, cliquez sur l'icône appareil photo ou trombone. Vous pouvez également cliquer sur les emojis pour réagir rapidement.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5 text-teal-300 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-teal-900/80 text-teal-300 flex items-center justify-center text-xs font-mono">2</span>
                    <h4 className="text-white">Voir votre photo et celles de vos contacts en grand format (HD)</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pl-8">
                    Cliquez directement sur votre photo de profil en haut ou sur la photo d'un contact dans une discussion : elle s'ouvrira immédiatement en grand format Haute Définition avec des boutons de zoom (+ et -) pour l'admirer ou la modifier.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5 text-teal-300 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-teal-900/80 text-teal-300 flex items-center justify-center text-xs font-mono">3</span>
                    <h4 className="text-white">Utiliser 2 comptes simultanément (Double compte)</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pl-8">
                    Dans les Paramètres sous l'onglet <strong>« 2 Comptes (Tél / PC) »</strong>, ajoutez un deuxième compte (ex: Professionnel et Personnel). Vous pouvez ensuite basculer de l'un à l'autre en un seul clic sans avoir à taper votre mot de passe à chaque fois.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5 text-teal-300 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-teal-900/80 text-teal-300 flex items-center justify-center text-xs font-mono">4</span>
                    <h4 className="text-white">Connecter votre ordinateur PC Windows</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pl-8">
                    Rendez-vous dans l'onglet <strong>« Windows & Mobile »</strong>. Vous pouvez y scanner le QR Code affiché sur votre PC ou saisir le code de synchronisation. Tous vos messages seront instantanément disponibles sur votre ordinateur.
                  </p>
                </div>

                {/* Step 5 */}
                <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5 text-teal-300 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-teal-900/80 text-teal-300 flex items-center justify-center text-xs font-mono">5</span>
                    <h4 className="text-white">Sécurité Puce SIM & Récupération anti-perte de téléphone</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pl-8">
                    Votre compte est relié à votre puce SIM. En cas de perte ou de vol de votre téléphone, votre <strong>Clé Maître de Récupération</strong> (disponible dans l'onglet « Sécurité Puce SIM ») vous permet de restaurer l'intégralité de vos contacts et discussions sur votre nouvel appareil.
                  </p>
                </div>

                {/* Step 6 */}
                <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5 text-teal-300 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-teal-900/80 text-teal-300 flex items-center justify-center text-xs font-mono">6</span>
                    <h4 className="text-white">Bloquer, débloquer ou signaler un contact indésirable</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pl-8">
                    Rendez-vous dans l'onglet <strong>« Bloquer & Signaler »</strong> des Paramètres. Vous pouvez y bloquer n'importe quel contact indésirable ou envoyer un rapport de sécurité en cas de tentative d'arnaque ou de harcèlement.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* --- TAB: 2 COMPTES (MULTI-ACCOUNT) --- */}
          {/* ========================================================================= */}
          {activeTab === 'accounts' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-teal-950/40 border border-teal-900/60 rounded-3xl flex items-start gap-3.5">
                <div className="p-2.5 bg-teal-900/60 text-teal-300 rounded-2xl shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Associer Deux Comptes (Personnel & Professionnel)
                  </h3>
                  <p className="text-xs text-teal-300/80 mt-1 leading-relaxed">
                    Basculez d'un compte à l'autre d'un simple clic sur votre téléphone ou PC sans jamais devoir vous reconnecter.
                  </p>
                </div>
              </div>

              {/* Saved Accounts List */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Vos comptes configurés :</span>
                
                {savedAccounts.map((account) => {
                  const isCurrent = account.id === currentUser.id;
                  return (
                    <div 
                      key={account.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                        isCurrent 
                          ? 'bg-teal-950/40 border-teal-500/70 shadow-md ring-1 ring-teal-500/20' 
                          : 'bg-neutral-950/80 border-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative cursor-pointer" onClick={() => openProfilePhotoModal(account)}>
                          <img 
                            src={account.avatar} 
                            alt={account.name} 
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-teal-500"
                          />
                          {isCurrent && (
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-neutral-900 rounded-full" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white flex items-center gap-1.5 truncate">
                            <span>{account.name}</span>
                            {account.verified && <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />}
                          </p>
                          <p className="text-xs text-neutral-400 truncate">@{account.username}</p>
                          <span className="text-[10px] text-teal-300/80 font-mono">
                            {account.phone || account.email || 'Puce SIM reliée'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCurrent ? (
                          <span className="px-3 py-1.5 bg-[#1D9E75] text-white rounded-xl text-xs font-bold shadow-xs">
                            Actif
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              switchAccount(account.id);
                              onClose();
                            }}
                            className="px-3 py-1.5 bg-neutral-800 hover:bg-teal-950 hover:text-teal-200 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-neutral-700"
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                            <span>Basculer</span>
                          </button>
                        )}

                        {savedAccounts.length > 1 && !isCurrent && (
                          <button
                            onClick={() => removeLinkedAccount(account.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors"
                            title="Retirer ce compte de la liste"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Second Account Trigger */}
              <button
                onClick={() => {
                  onClose();
                  setIsAuthModalOpen(true);
                }}
                className="w-full p-4 rounded-2xl border-2 border-dashed border-teal-800/60 hover:border-teal-400 bg-teal-950/20 hover:bg-teal-950/40 text-teal-200 flex items-center justify-center gap-2 transition-all font-bold text-sm"
              >
                <PlusCircle className="w-5 h-5 text-teal-400" />
                <span>Associer un deuxième compte (Personnel ou Professionnel)</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* --- TAB: DEVICES (WINDOWS & MOBILE) --- */}
          {/* ========================================================================= */}
          {activeTab === 'devices' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-teal-950/40 border border-teal-900/60 rounded-3xl flex items-start gap-3.5">
                <div className="p-2.5 bg-teal-900/60 text-teal-300 rounded-2xl shrink-0">
                  <Laptop className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Appareils Connectés & PC Windows
                  </h3>
                  <p className="text-xs text-teal-300/80 mt-1 leading-relaxed">
                    Utilisez Flex Online en même temps sur votre téléphone et sur votre ordinateur Windows grâce à la synchronisation temps réel sécurisée.
                  </p>
                </div>
              </div>

              {/* Real High-Res QR Code Scanner & Display */}
              <FlexQRCodeScanner />

              {/* Pair New Device Form */}
              <form onSubmit={handlePairPc} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Associer un ordinateur manuellement :
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nom de l'appareil (ex: PC Salon, Bureau...)"
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-teal-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:opacity-90 text-white rounded-xl text-xs font-bold shrink-0 transition-all shadow-sm"
                  >
                    Lier ce PC
                  </button>
                </div>
              </form>

              {/* Active Linked Devices */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Sessions et Appareils actifs :</span>
                
                {(currentUser.linkedDevices || []).filter(d => d.status === 'active').map((dev, idx) => {
                  const isCurrent = idx === 0 || dev.type === 'mobile';
                  return (
                    <div key={dev.id} className="p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-950/80 text-teal-400 flex items-center justify-center">
                          {dev.type === 'pc' ? <Laptop className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span>{dev.name}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                                Cet appareil
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-neutral-400">{dev.os} • Actif maintenant</p>
                        </div>
                      </div>

                      {!isCurrent && (
                        <button
                          onClick={() => revokeDevice(dev.id)}
                          className="px-3 py-1.5 bg-neutral-900 hover:bg-rose-950 hover:text-rose-300 text-neutral-300 rounded-xl text-xs font-bold transition-colors border border-neutral-800"
                        >
                          Déconnecter
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* --- TAB: SECURITY & SIM DETAILS --- */}
          {/* ========================================================================= */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-teal-950/40 border border-teal-900/60 rounded-3xl flex items-start gap-3.5">
                <div className="p-2.5 bg-teal-900/60 text-teal-300 rounded-2xl shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Puce SIM, Récupération & Chiffrement P2P
                  </h3>
                  <p className="text-xs text-teal-300/80 mt-1 leading-relaxed">
                    Si vous perdez votre téléphone ou changez d'appareil, votre compte est 100% récupérable grâce à votre puce SIM et votre Clé Maître secrète.
                  </p>
                </div>
              </div>

              {/* SIM & Identity Info */}
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Identifiant Puce SIM / Téléphone :</span>
                <div className="flex items-center justify-between">
                  <span className="text-base font-mono font-bold text-teal-300">
                    {currentUser.phone || '+33 6 12 34 56 78 (SIM Franck Alex)'}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 rounded-md text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    Puce SIM Sécurisée & Vérifiée
                  </span>
                </div>
              </div>

              {/* Master Recovery Key */}
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Votre Clé Maître de Récupération :</span>
                  <button
                    onClick={handleCopyRecovery}
                    className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-bold"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copiée !' : 'Copier la clé'}</span>
                  </button>
                </div>
                <div className="p-3 bg-neutral-900 rounded-xl font-mono text-sm text-teal-200 break-all select-all border border-neutral-800">
                  {currentUser.recoveryKey || 'FLEX-REC-9821-X4K2-9110'}
                </div>
                <p className="text-[11px] text-neutral-400">
                  Conservez cette clé en lieu sûr (dans vos notes ou sur papier). Elle vous permettra de débloquer et restaurer l'intégralité de vos messages sur un nouveau téléphone.
                </p>
              </div>

              {/* End-to-end Encryption status */}
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
                  <Lock className="w-4 h-4" />
                  <span>Chiffrement de bout en bout P2P Actif</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Tous vos messages, photos et notes vocales sont cryptés avec des clés privées. Seuls vous et votre interlocuteur pouvez les lire. Personne d'autre ne peut y accéder.
                </p>
              </div>

              {/* PIN Code Change */}
              <form onSubmit={handleUpdatePin} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Modifier le Code PIN de sécurité :</h4>
                <div className="flex gap-2">
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="Nouveau PIN (4 chiffres)"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-center text-lg font-mono text-white tracking-widest placeholder-neutral-500 focus:outline-hidden focus:border-teal-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:opacity-90 text-white rounded-xl text-xs font-bold shrink-0 transition-all shadow-sm"
                  >
                    Enregistrer PIN
                  </button>
                </div>
                {pinSuccessMsg && (
                  <p className="text-xs text-emerald-400 font-bold animate-fade-in">
                    ✓ Code PIN mis à jour avec succès.
                  </p>
                )}
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* --- TAB: MODERATION (BLOQUER & SIGNALER) --- */}
          {/* ========================================================================= */}
          {activeTab === 'moderation' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-rose-950/30 border border-rose-900/60 rounded-3xl flex items-start gap-3.5">
                <div className="p-2.5 bg-rose-900/60 text-rose-300 rounded-2xl shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Bloquer un contact, Débloquer ou Signaler un compte
                  </h3>
                  <p className="text-xs text-rose-300/80 mt-1 leading-relaxed">
                    Protégez votre tranquillité. Un contact bloqué ne peut plus vous écrire ni voir vos statuts. Vous pouvez également signaler tout comportement suspect ou frauduleux.
                  </p>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* BOUCLIER AUTOMATIQUE DE PUDEUR & RESPECT ÉTHIQUE */}
              {/* ========================================================================= */}
              <div className="p-5 bg-gradient-to-br from-neutral-950 via-teal-950/40 to-neutral-950 border-2 border-teal-500/50 rounded-3xl shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F6E56] to-[#1D9E75] text-white flex items-center justify-center shadow-lg shadow-teal-950/80">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                        <span>Bouclier Automatique de Pudeur & Respect</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/80 text-[10px] font-black uppercase tracking-wider">
                          {shieldActive ? 'Actif & Vigilant' : 'Désactivé'}
                        </span>
                      </h4>
                      <p className="text-xs text-teal-300/80">
                        Éradique en temps réel tout propos grotesque, malsain, offensant ou portant atteinte à la pudeur.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-xl bg-teal-950/80 border border-teal-800 text-xs text-teal-200 font-bold flex items-center gap-1.5 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      <span>{blockedCounter} neutralisés</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const next = !shieldActive;
                        setDecencyShieldEnabled(next);
                        setShieldActive(next);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        shieldActive
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                          : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                      }`}
                    >
                      {shieldActive ? 'Activé' : 'Désactivé'}
                    </button>
                  </div>
                </div>

                {/* Core Philosophy Banner */}
                <div className="p-3 bg-neutral-900/90 rounded-2xl border border-teal-900/60 text-xs text-teal-200/90 italic flex items-center gap-2.5">
                  <span className="text-base">✦</span>
                  <p>
                    <strong>Charte Flex Online :</strong> "Flex est fait pour communiquer et dialoguer dans la paix et le respect, pas pour s'attaquer aux autres ni porter atteinte à la pudeur."
                  </p>
                </div>

                {/* 4 Pillars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 bg-neutral-900/70 rounded-2xl border border-neutral-800 flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-rose-950 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">1. Pudeur & Décence</h5>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                        Blocage instantané des contenus obscènes, pornographiques, grossièretés sexuelles ou grotesques.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-900/70 rounded-2xl border border-neutral-800 flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-teal-950 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">2. Respect des Croyances</h5>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                        Exclusion automatique de toute attaque ou injure confessionnelle, de blasphème haineux ou de dénigrement de la foi.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-900/70 rounded-2xl border border-neutral-800 flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">3. Neutralité & Paix</h5>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                        Exclusion des attaques politiques agressives, des invectives partisanes violentes et des incitations au désordre.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-900/70 rounded-2xl border border-neutral-800 flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <UserX className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">4. Tolérance Zéro Harcèlement</h5>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                        Neutralisation des menaces, intimidations, insultes personnelles et tentatives de dénigrement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {blockSuccessMsg && (
                <div className="p-3 bg-teal-950 border border-teal-700 text-teal-200 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  <span>{blockSuccessMsg}</span>
                </div>
              )}

              {reportSuccessMsg && (
                <div className="p-3.5 bg-emerald-950 border border-emerald-700 text-emerald-200 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{reportSuccessMsg}</span>
                </div>
              )}

              {/* SECTION 1: BLOCK A CONTACT */}
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <UserX className="w-4 h-4 text-rose-400" />
                  <span>Bloquer un nouveau contact :</span>
                </h4>
                
                <form onSubmit={handleManualBlock} className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={contactToBlockId}
                    onChange={(e) => setContactToBlockId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden focus:border-rose-500"
                  >
                    <option value="">Sélectionner un contact dans la liste...</option>
                    {otherUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} (@{u.username}) {u.phone ? `· ${u.phone}` : ''}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={!contactToBlockId}
                    className="px-4 py-2 bg-rose-700 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Bloquer ce contact</span>
                  </button>
                </form>
              </div>

              {/* SECTION 2: CURRENTLY BLOCKED CONTACTS */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Contacts actuellement bloqués ({blockedUsersList.length}) :</span>
                </span>

                {blockedUsersList.length === 0 ? (
                  <div className="p-6 text-center text-neutral-500 bg-neutral-950 rounded-2xl border border-neutral-800">
                    <UserCheck className="w-7 h-7 mx-auto text-neutral-600 mb-2" />
                    <p className="text-xs">Vous n'avez aucun contact bloqué pour le moment.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {blockedUsersList.map((user) => (
                      <div key={user.id} className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-neutral-700" />
                          <div>
                            <span className="text-sm font-bold text-white block">{user.name}</span>
                            <span className="text-xs text-neutral-400">@{user.username} {user.phone && `· ${user.phone}`}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            unblockUser(user.id);
                            setBlockSuccessMsg(`Le contact ${user.name} a été débloqué.`);
                            setTimeout(() => setBlockSuccessMsg(null), 3000);
                          }}
                          className="px-3.5 py-1.5 bg-neutral-800 hover:bg-emerald-950 hover:text-emerald-300 text-white rounded-xl text-xs font-bold transition-colors border border-neutral-700"
                        >
                          Débloquer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 3: REPORT AN ACCOUNT */}
              <div className="p-4 bg-neutral-950 border border-rose-950/60 rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-950 text-rose-400 flex items-center justify-center">
                    <Flag className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Signaler un compte à la sécurité</h4>
                    <p className="text-xs text-neutral-400">Signalez tout spam, arnaque, faux profil ou harcèlement.</p>
                  </div>
                </div>

                <form onSubmit={handleSendReport} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Compte à signaler :
                    </label>
                    <select
                      value={reportTargetId}
                      onChange={(e) => {
                        setReportTargetId(e.target.value);
                        setReportCustomTarget('');
                      }}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden focus:border-rose-500 mb-2"
                    >
                      <option value="">Sélectionner un contact connu...</option>
                      {users.filter(u => u.id !== currentUser.id).map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} (@{u.username}) {u.phone ? `· ${u.phone}` : ''}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Ou tapez un nom, numéro de téléphone ou identifiant inconnu..."
                      value={reportCustomTarget}
                      onChange={(e) => {
                        setReportCustomTarget(e.target.value);
                        setReportTargetId('');
                      }}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Motif du signalement :
                    </label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden focus:border-rose-500"
                    >
                      <option value="spam">Spam / Messages indésirables répétés</option>
                      <option value="scam">Tentative d'escroquerie ou hameçonnage (Arnaque)</option>
                      <option value="harassment">Harcèlement, insultes ou menaces</option>
                      <option value="impersonation">Usurpation d'identité / Faux compte</option>
                      <option value="offensive">Contenu offensant ou illicite</option>
                      <option value="other">Autre motif de sécurité</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Détails ou explications complémentaires (facultatif) :
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Précisez ce qui s'est passé..."
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden focus:border-rose-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="auto-block-checkbox"
                      checked={reportAutoBlock}
                      onChange={(e) => setReportAutoBlock(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <label htmlFor="auto-block-checkbox" className="text-xs text-neutral-300 select-none cursor-pointer">
                      Bloquer également ce contact automatiquement sur mon compte
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!reportTargetId && !reportCustomTarget.trim()}
                    className="w-full py-2.5 bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Envoyer le signalement de sécurité</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* --- TAB: CHATS & PINS --- */}
          {/* ========================================================================= */}
          {activeTab === 'chats' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-sm font-black text-white mb-2">Discussions Épinglées</h3>
                {pinnedConvsList.length === 0 ? (
                  <p className="text-xs text-neutral-500 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                    Aucune discussion épinglée pour l'instant.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {pinnedConvsList.map((conv) => (
                      <div key={conv.id} className="p-3 bg-neutral-950 rounded-2xl flex items-center justify-between border border-neutral-800/80">
                        <span className="text-sm font-bold text-white">{conv.name || 'Discussion'}</span>
                        <button
                          onClick={() => togglePinConversation(conv.id)}
                          className="px-3 py-1 bg-neutral-800 text-xs text-neutral-300 rounded-lg hover:bg-neutral-700 transition"
                        >
                          Désépingler
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Version & Cache Section */}
              <div className="p-4 border border-teal-800/60 bg-gradient-to-br from-teal-950/30 to-emerald-950/30 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-teal-400" />
                    <span>Mise à jour & Ancienne Version :</span>
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-teal-900/60 text-teal-200 text-[10px] font-mono border border-teal-700/50">
                    Version 5.0 Active
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Si vous aviez une <strong>ancienne version</strong> ou si votre navigateur a conservé en mémoire des pages précédentes (cache ou ancien raccourci écran d'accueil), utilisez ces options pour charger immédiatement la toute dernière version :
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={handleForceUpdateApp}
                    className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:opacity-90 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-teal-950/50 active:scale-98"
                  >
                    <RefreshCw className="w-4 h-4 shrink-0" />
                    <span>Vider le cache & Actualiser</span>
                  </button>

                  <button
                    onClick={handleFullResetApp}
                    className="flex items-center justify-center gap-2 p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-2xl text-xs font-bold transition-all active:scale-98"
                  >
                    <Trash2 className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Remettre à neuf (Reset complet)</span>
                  </button>
                </div>

                <div className="p-3 bg-neutral-950/70 rounded-2xl border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                  <p className="font-semibold text-neutral-300">📱 Si vous aviez installé l'application sur l'écran d'accueil de votre téléphone :</p>
                  <p>
                    1. Maintenez le doigt sur l'ancienne icône Flex de votre écran d'accueil et choisissez <strong>« Supprimer »</strong>.
                  </p>
                  <p>
                    2. Ouvrez le nouveau lien dans votre navigateur puis cliquez sur <strong>« Ajouter à l'écran d'accueil »</strong> pour installer la nouvelle version.
                  </p>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-4 border border-rose-900/60 bg-rose-950/20 rounded-3xl space-y-3">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Zone de Nettoyage de l'historique :</span>
                </h4>
                <p className="text-xs text-neutral-300">
                  Supprime l'historique de tous vos messages locaux. Vos contacts et vos comptes associés restent intacts.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      if (window.confirm('Voulez-vous vraiment vider tout l’historique des messages ?')) {
                        clearAllChatHistory();
                      }
                    }}
                    className="px-4 py-2 bg-neutral-900 hover:bg-rose-950 border border-neutral-800 text-rose-300 rounded-xl text-xs font-bold transition-colors"
                  >
                    Vider tout l'historique des discussions
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with generous breathing room and clean teal accents */}
        <div className="p-4 sm:p-5 border-t border-teal-950/70 bg-[#0c1614] flex flex-col sm:flex-row items-center justify-between gap-3.5 text-xs text-neutral-400">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-teal-300 font-bold bg-teal-950/60 border border-teal-800/60 px-3 py-1.5 rounded-xl shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Flex Online V5.0</span>
            </div>
            <button
              onClick={handleForceUpdateApp}
              className="flex items-center gap-1.5 text-[11px] text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700/60 transition active:scale-95"
              title="Vider le cache et charger la dernière version"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Vider le cache</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Voulez-vous vraiment vous déconnecter de votre compte Flex Online ?')) {
                  onClose();
                  logoutUser();
                }
              }}
              className="flex items-center gap-1.5 text-[11px] text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 px-3 py-1.5 rounded-xl border border-rose-800/60 transition font-bold active:scale-95"
              title="Se déconnecter du compte"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Se déconnecter</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-7 py-2.5 bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:from-teal-600 hover:to-emerald-500 text-white rounded-xl font-black transition-all shadow-md shadow-teal-950/50 active:scale-95 text-center"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
