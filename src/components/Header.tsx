import React, { useRef } from 'react';
import { 
  MessageSquare, 
  Compass, 
  Settings, 
  Eye,
  Sun,
  Moon,
  Sparkles, 
  Lock,
  Globe,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FlexLogo } from './common/FlexLogo';
import { PWAInstallButton } from './pwa/PWAInstallButton';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    openProfilePhotoModal, 
    setIsSettingsModalOpen, 
    conversations, 
    posts, 
    wsConnected,
    themeMode,
    toggleThemeMode,
    lockDiscussions,
    setIsAiModalOpen,
    t
  } = useApp();

  const scrollNavRef = useRef<HTMLDivElement>(null);

  // Total unread messages count across all conversations
  const totalUnread = conversations.reduce(
    (acc, conv) => acc + (conv.unreadCount[currentUser.id] || 0),
    0
  );

  return (
    <header className="bg-neutral-950 border-b border-teal-950/80 sticky top-0 z-30 select-none shadow-xl">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Flex Online Exclusive Logo Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <FlexLogo size="md" showText={true} />
            
            {/* Live Indicator */}
            <div className="hidden xl:flex items-center gap-1.5 pl-2.5 border-l border-neutral-800 text-[11px] font-semibold text-neutral-400">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  wsConnected ? 'bg-teal-400' : 'bg-amber-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  wsConnected ? 'bg-teal-500' : 'bg-amber-500'
                }`} />
              </span>
              <span className="tracking-wide text-neutral-300">{wsConnected ? 'Live' : '...'}</span>
            </div>
          </div>

          {/* Horizontally Scrollable Bar - Fluid, Clean, Zero overlap */}
          <div 
            ref={scrollNavRef}
            id="horizontal-scrollable-nav"
            className="flex-1 overflow-x-auto scrollbar-none py-1 px-1 flex items-center gap-2 scroll-smooth touch-pan-x min-w-0"
          >
            {/* Item 1: Discussions & Messages */}
            <button
              id="nav-tab-discussions"
              onClick={() => setActiveTab('chats')}
              className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                activeTab === 'chats' || activeTab === 'stories' || activeTab === 'calls'
                  ? 'bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white shadow-lg shadow-teal-950/60 border border-teal-400/50'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-teal-200" />
              <span className="whitespace-nowrap">{t('nav.chats', 'Discussions')}</span>
              {totalUnread > 0 && (
                <span className="min-w-5 h-5 px-1.5 rounded-full text-xs font-black bg-rose-600 text-white shadow-md flex items-center justify-center animate-pulse">
                  {totalUnread}
                </span>
              )}
            </button>

            {/* Item 2: Fil Flex & Publications */}
            <button
              id="nav-tab-feed"
              onClick={() => setActiveTab('feed')}
              className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white shadow-lg shadow-teal-950/60 border border-teal-400/50'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent'
              }`}
            >
              <Compass className="w-4 h-4 text-teal-200" />
              <span className="whitespace-nowrap">{t('nav.feed', 'Fil Flex')}</span>
              {posts.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-teal-950 text-teal-200 border border-teal-800/60">
                  {posts.length}
                </span>
              )}
            </button>

            {/* Item 3: HI FLEX (Rencontres & Correspondants Mondiaux) */}
            <button
              id="nav-tab-hiflex"
              onClick={() => setActiveTab('hiflex')}
              className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                activeTab === 'hiflex'
                  ? 'bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white shadow-lg shadow-teal-950/60 border border-teal-400/50'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent'
              }`}
              title="Hi Flex : Rencontrez de vrais correspondants partout dans le monde pour échanger et discuter"
            >
              <Globe className="w-4 h-4 text-teal-300 animate-pulse" />
              <span className="whitespace-nowrap font-black">{t('nav.hiflex', 'Hi Flex')}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-teal-400/20 text-teal-300 border border-teal-400/30">
                Monde 🌍
              </span>
            </button>

            {/* Item 4: FLEX LIBRARY (Bibliothèque de lecture universelle & Roman de Dioh Franck Alex) */}
            <button
              id="nav-tab-library"
              onClick={() => setActiveTab('library')}
              className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white shadow-lg shadow-teal-950/60 border border-teal-400/50'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent'
              }`}
              title="Flex Library : Des centaines de milliers de livres dont « Ceux qu'on n'entend pas » de Dioh Franck Alex"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span className="whitespace-nowrap font-black">{t('nav.library', 'Flex Library')}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Livres 📚
              </span>
            </button>

            {/* Item 5: Flex IA Assistant with Robot Avatar & Full Polymath Intelligence */}
            <button
              id="nav-tab-flex-ia"
              onClick={() => setIsAiModalOpen(true)}
              className="shrink-0 px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 bg-gradient-to-r from-[#0F6E56]/40 to-[#1D9E75]/40 hover:from-[#0F6E56]/70 hover:to-[#1D9E75]/70 text-teal-100 hover:text-white border border-teal-500/50 transition-all active:scale-95 group shadow-sm shadow-teal-950/40 cursor-pointer"
              title="Ouvrir Flex IA (questions universelles : sciences, maths, histoire, médecine, philo, code...)"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border-2 border-teal-400/80 shadow-xs group-hover:scale-110 transition-transform">
                <img 
                  src="/flex_ai_robot_avatar.jpg" 
                  alt="Robot Flex IA" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="whitespace-nowrap font-black">{t('nav.flex_ai', 'Flex IA')}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            </button>

            {/* Item 6: PHOTO DE PROFIL */}
            <button
              id="nav-tab-my-profile-photo"
              onClick={() => openProfilePhotoModal(currentUser)}
              className="shrink-0 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-teal-500/60 transition-all group cursor-pointer"
              title="Voir ma photo de profil en grand format (HD) et modifier mon profil"
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-teal-500/80 group-hover:scale-105 transition-transform"
                />
                <div className="absolute -bottom-1 -right-1 bg-teal-600 text-white rounded-full p-0.5 shadow-sm">
                  <Eye className="w-2.5 h-2.5" />
                </div>
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-teal-400 font-mono">
                  {t('nav.profile', 'Photo HD')}
                </span>
              </div>
            </button>

            {/* Item 7: LE CENTRE UNIQUE DE PARAMÈTRES */}
            <button
              id="nav-btn-settings"
              onClick={() => setIsSettingsModalOpen(true)}
              className="shrink-0 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-teal-500/60 transition-colors shadow-sm cursor-pointer"
              title="Paramètres complets : Langues, Sonnerie, Écritures, 2ème Compte, PC Windows, Guide d'utilisation"
            >
              <Settings className="w-4 h-4 text-teal-400" />
              <span className="whitespace-nowrap font-bold">{t('nav.settings', 'Paramètres')}</span>
            </button>

            {/* Bouton Verrouillage des Discussions instantané */}
            <button
              id="nav-btn-lock"
              onClick={lockDiscussions}
              className="shrink-0 px-3 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-amber-500/60 transition-colors shadow-sm active:scale-95 group cursor-pointer"
              title="Verrouiller l'accès aux discussions (Mot de passe à 4 chiffres exigé pour rouvrir)"
            >
              <Lock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="whitespace-nowrap hidden sm:inline">{t('nav.lock', 'Verrouiller')}</span>
            </button>

            {/* Quick Teint Switcher (Sombre / Blanc) */}
            <button
              id="theme-toggle-btn"
              onClick={toggleThemeMode}
              className="shrink-0 px-3 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-teal-500/60 transition-colors shadow-sm cursor-pointer"
              title={themeMode === 'dark' ? "Passer au Teint Blanc (Écran Clair)" : "Passer au Teint Noir (Écran Sombre)"}
            >
              {themeMode === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="whitespace-nowrap hidden sm:inline">{t('nav.theme_light', 'Teint Blanc')}</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-teal-400" />
                  <span className="whitespace-nowrap hidden sm:inline">{t('nav.theme_dark', 'Teint Noir')}</span>
                </>
              )}
            </button>

            {/* Item 8: INSTALL PWA BUTTON */}
            <div className="shrink-0">
              <PWAInstallButton variant="compact" />
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
