import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { ChatList } from './components/chat/ChatList';
import { ChatWindow } from './components/chat/ChatWindow';
import { FeedView } from './components/feed/FeedView';
import { StoriesView } from './components/stories/StoriesView';
import { CallsView } from './components/calls/CallsView';
import { CallModal } from './components/calls/CallModal';
import { AuthModal } from './components/auth/AuthModal';
import { SmsNotificationToast } from './components/auth/SmsNotificationToast';
import { ProfilePhotoModal } from './components/profile/ProfilePhotoModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { LinkedDevicesModal } from './components/devices/LinkedDevicesModal';
import { PhoneBackupModal } from './components/security/PhoneBackupModal';
import { ContactsSyncModal } from './components/contacts/ContactsSyncModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    isAuthModalOpen, 
    setIsAuthModalOpen,
    isSecurityModalOpen,
    setIsSecurityModalOpen,
    isContactsSyncModalOpen,
    setIsContactsSyncModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isLinkedDevicesModalOpen,
    setIsLinkedDevicesModalOpen
  } = useApp();

  // Mobile navigation state: toggles between list and chat view on small screens
  const [showMobileChat, setShowMobileChat] = useState(false);

  const handleSelectChat = () => {
    setShowMobileChat(true);
  };

  const handleBackToChatList = () => {
    setShowMobileChat(false);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full overflow-hidden bg-neutral-950">
      {activeTab === 'chats' && (
        <div className="flex-1 min-h-0 flex overflow-hidden max-w-7xl mx-auto w-full bg-neutral-900 border-x border-violet-950/40 shadow-2xl">
          {/* Chat List: visible on desktop or on mobile when not viewing chat */}
          <div
            className={`w-full md:w-80 lg:w-96 shrink-0 h-full min-h-0 ${
              showMobileChat ? 'hidden md:flex flex-col' : 'flex flex-col'
            }`}
          >
            <ChatList onSelectChat={handleSelectChat} />
          </div>

          {/* Chat Window: visible on desktop or on mobile when a chat is opened */}
          <div
            className={`flex-1 h-full min-h-0 w-full max-w-full min-w-0 flex flex-col overflow-hidden ${
              !showMobileChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            <ChatWindow onBack={handleBackToChatList} />
          </div>
        </div>
      )}

      {activeTab === 'feed' && <FeedView />}
      {activeTab === 'stories' && <StoriesView />}
      {activeTab === 'calls' && <CallsView />}

      {/* Global Call Modal */}
      <CallModal />

      {/* Profile Photo Lightbox (Click avatar anywhere to view photo HD) */}
      <ProfilePhotoModal />

      {/* Real-time SMS / OTP Code Toast Notification */}
      <SmsNotificationToast />

      {/* Global Authentication / SIM Verification / Recovery Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Main Settings Modal (Font Size, 2 Accounts, Devices, SIM Security) */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Linked Devices & Windows PC Modal */}
      <LinkedDevicesModal
        isOpen={isLinkedDevicesModalOpen}
        onClose={() => setIsLinkedDevicesModalOpen(false)}
      />

      {/* Phone Security & Backup Modal */}
      <PhoneBackupModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

      {/* Phone Contacts Synchronization Modal */}
      <ContactsSyncModal
        isOpen={isContactsSyncModalOpen}
        onClose={() => setIsContactsSyncModalOpen(false)}
      />

      {/* Offline Status Warning Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="h-[100dvh] max-h-[100dvh] flex flex-col bg-neutral-950 font-sans text-neutral-100 selection:bg-violet-600 selection:text-white overflow-hidden">
        <Header />
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <MainContent />
        </main>
      </div>
    </AppProvider>
  );
}
