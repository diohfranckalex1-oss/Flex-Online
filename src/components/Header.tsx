import React, { useState } from 'react';
import { 
  MessageSquare, 
  Compass, 
  CircleDashed, 
  Phone, 
  ChevronDown, 
  UserCheck, 
  UserPlus, 
  Sparkles,
  Users,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FlexLogo } from './common/FlexLogo';
import { PWAInstallButton } from './pwa/PWAInstallButton';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    users, 
    switchCurrentUser, 
    wsConnected, 
    conversations,
    setIsAuthModalOpen,
    setIsSecurityModalOpen
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Total unread messages count across all conversations
  const totalUnread = conversations.reduce(
    (acc, conv) => acc + (conv.unreadCount[currentUser.id] || 0),
    0
  );

  return (
    <header id="main-app-header" className="bg-white border-b border-neutral-200/90 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Flex Online Logo Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <FlexLogo size="md" showText={true} />
            
            {/* Live Indicator */}
            <div className="hidden xl:flex items-center gap-1.5 pl-3 border-l border-neutral-200 text-[11px] font-semibold text-neutral-500">
              <span
                className={`w-2 h-2 rounded-full ${
                  wsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>{wsConnected ? 'Réseau actif 100%' : 'Connexion...'}</span>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            {/* Discussions Tab */}
            <button
              id="tab-discussions"
              onClick={() => setActiveTab('chats')}
              className={`relative px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'chats'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Discussions</span>
              {totalUnread > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'chats' ? 'bg-white text-emerald-700' : 'bg-emerald-600 text-white'
                }`}>
                  {totalUnread}
                </span>
              )}
            </button>

            {/* Fil d'Actualité Tab */}
            <button
              id="tab-feed"
              onClick={() => setActiveTab('feed')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'feed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="hidden sm:inline">Fil d'actualité</span>
            </button>

            {/* Statuts / Stories Tab */}
            <button
              id="tab-stories"
              onClick={() => setActiveTab('stories')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'stories'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <CircleDashed className="w-4 h-4" />
              <span className="hidden sm:inline">Stories</span>
            </button>

            {/* Appels Tab */}
            <button
              id="tab-calls"
              onClick={() => setActiveTab('calls')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'calls'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Appels</span>
            </button>
          </nav>

          {/* Right Actions: Register/Login + PWA Install + Security + Profile switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Install PWA Button */}
            <PWAInstallButton variant="compact" />

            {/* Phone Security & Backup Button */}
            <button
              id="btn-open-phone-security"
              onClick={() => setIsSecurityModalOpen(true)}
              title="Sécurité & Sauvegarde téléphone"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/90 rounded-full transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="hidden md:inline">Sécurité</span>
            </button>

            {/* Quick Register / Connect button */}
            <button
              id="btn-open-register"
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-full transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Compte</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                id="btn-user-profile-menu"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-neutral-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/50 transition-all shadow-2xs"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-emerald-500"
                />
                <span className="text-xs font-bold text-neutral-800 hidden md:inline max-w-[100px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50 animate-scale-in">
                  <div className="px-4 py-2.5 border-b border-neutral-100 flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-neutral-900 truncate">{currentUser.name}</p>
                      <p className="text-xs text-neutral-500 truncate">@{currentUser.username}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Connecté
                      </span>
                    </div>
                  </div>

                  {/* Phone Security & Backup CTA in dropdown */}
                  <div className="p-2 border-b border-neutral-100 space-y-1.5">
                    <button
                      id="btn-menu-phone-security"
                      onClick={() => {
                        setShowProfileMenu(false);
                        setIsSecurityModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Sécurité & Changement de téléphone</span>
                      </div>
                      <span className="text-[10px] bg-emerald-200/80 px-1.5 py-0.5 rounded-md font-mono">PIN</span>
                    </button>

                    <button
                      id="btn-menu-create-account"
                      onClick={() => {
                        setShowProfileMenu(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-all"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                      Créer / Connecter un autre compte
                    </button>
                  </div>

                  <div className="px-3 py-2">
                    <p className="text-[11px] font-semibold text-neutral-400 mb-1.5 px-1 flex items-center justify-between">
                      <span>Changer d'utilisateur ({users.length}) :</span>
                      <Users className="w-3 h-3 text-neutral-400" />
                    </p>
                    <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                      {users.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => {
                            switchCurrentUser(user);
                            setShowProfileMenu(false);
                          }}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors ${
                            user.id === currentUser.id
                              ? 'bg-emerald-50 text-emerald-800 font-bold'
                              : 'hover:bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate">{user.name}</p>
                            <p className="text-[10px] text-neutral-400 truncate">@{user.username}</p>
                          </div>
                          {user.id === currentUser.id && (
                            <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-4 py-2 border-t border-neutral-100 bg-neutral-50/50 text-[11px] text-neutral-500 rounded-b-2xl">
                    ⚡ <strong>Multi-appareils</strong> : Ouvrez le lien partagé dans un autre navigateur ou sur mobile pour causer en direct avec tout le monde !
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
