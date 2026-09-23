import React, { useRef } from 'react';
import { 
  MessageSquare, 
  Compass, 
  Settings, 
  Eye,
  Sun,
  Moon
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
    toggleThemeMode
  } = useApp();

  const scrollNavRef = useRef<HTMLDivElement>(null);

  // Total unread messages count across all conversations
  const totalUnread = conversations.reduce(
    (acc, conv) => acc + (conv.unreadCount[currentUser.id] || 0),
    0
  );

  return (
    <header id="main-app-header" className="bg-neutral-950/95 backdrop-blur-md border-b border-violet-950/50 sticky top-0 z-40 shadow-xl shadow-black/40 text-neutral-100 select-none">
      <div className="w-full px-2 sm:px-4">
        {/* Top Single Row: Brand Logo on Left + Streamlined, Pure Scrolling Navigation */}
        <div className="flex items-center h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Flex Online Exclusive Logo Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <FlexLogo size="md" showText={true} />
            
            {/* Live Indicator */}
            <div className="hidden xl:flex items-center gap-1.5 pl-2.5 border-l border-neutral-800 text-[11px] font-semibold text-neutral-400">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  wsConnected ? 'bg-violet-400' : 'bg-amber-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  wsConnected ? 'bg-violet-500' : 'bg-amber-500'
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
              className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all duration-200 ${
                activeTab === 'chats' || activeTab === 'stories' || activeTab === 'calls'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-950/60 border border-violet-500/50'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-violet-200" />
              <span className="whitespace-nowrap">Discussions</span>
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
              className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all duration-200 ${
                activeTab === 'feed'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-950/60 border border-violet-500/50'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent'
              }`}
            >
              <Compass className="w-4 h-4 text-violet-200" />
              <span className="whitespace-nowrap">Fil Flex</span>
              {posts.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-violet-950 text-violet-200 border border-violet-800/60">
                  {posts.length}
                </span>
              )}
            </button>

            {/* Item 3: LA SEULE ET UNIQUE PHOTO DE PROFIL (S'ouvre en HD en un clic) */}
            <button
              id="nav-tab-my-profile-photo"
              onClick={() => openProfilePhotoModal(currentUser)}
              className="shrink-0 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-violet-600/60 transition-all group"
              title="Voir ma photo de profil en grand format (HD) et modifier mon profil"
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-violet-500/80 group-hover:scale-105 transition-transform"
                />
                <div className="absolute -bottom-1 -right-1 bg-violet-600 text-white rounded-full p-0.5 shadow-sm">
                  <Eye className="w-2.5 h-2.5" />
                </div>
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-violet-400 font-mono">
                  Photo HD
                </span>
              </div>
            </button>

            {/* Item 4: LE CENTRE UNIQUE DE PARAMÈTRES (Contient tout : 2ème compte, PC, Guide, Sécurité, Blocage) */}
            <button
              id="nav-btn-settings"
              onClick={() => setIsSettingsModalOpen(true)}
              className="shrink-0 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-violet-600/60 transition-colors shadow-sm"
              title="Paramètres complets : Écritures, 2ème Compte, PC Windows, Guide d'utilisation, Sécurité et Blocage"
            >
              <Settings className="w-4 h-4 text-violet-400" />
              <span className="whitespace-nowrap font-bold">Paramètres</span>
            </button>

            {/* Quick Teint Switcher (Sombre / Blanc) */}
            <button
              id="theme-toggle-btn"
              onClick={toggleThemeMode}
              className="shrink-0 px-3 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-violet-500/60 transition-colors shadow-sm"
              title={themeMode === 'dark' ? "Passer au Teint Blanc (Écran Clair)" : "Passer au Teint Noir (Écran Sombre)"}
            >
              {themeMode === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="whitespace-nowrap hidden sm:inline">Teint Blanc</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-violet-400" />
                  <span className="whitespace-nowrap hidden sm:inline">Teint Noir</span>
                </>
              )}
            </button>

            {/* Item 5: INSTALL PWA BUTTON (Disparaît automatiquement dès que l'application est téléchargée) */}
            <div className="shrink-0">
              <PWAInstallButton variant="compact" />
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
