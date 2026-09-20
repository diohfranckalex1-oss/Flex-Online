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
import { PhoneBackupModal } from './components/security/PhoneBackupModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    isAuthModalOpen, 
    setIsAuthModalOpen,
    isSecurityModalOpen,
    setIsSecurityModalOpen
  } = useApp();
  // Mobile navigation state
  const [showMobileChat, setShowMobileChat] = useState(false);

  const handleSelectChat = () => {
    setShowMobileChat(true);
  };

  const handleBackToChatList = () => {
    setShowMobileChat(false);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-hidden">
      {activeTab === 'chats' && (
        <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full bg-white shadow-xs">
          {/* Chat List: visible on desktop or on mobile when not viewing chat */}
          <div
            className={`w-full md:w-80 lg:w-96 shrink-0 h-full ${
              showMobileChat ? 'hidden md:flex flex-col' : 'flex flex-col'
            }`}
          >
            <ChatList onSelectChat={handleSelectChat} />
          </div>

          {/* Chat Window: visible on desktop or on mobile when a chat is opened */}
          <div
            className={`flex-1 h-full flex flex-col ${
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

      {/* Global Authentication / Account Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Phone Security & Backup Modal */}
      <PhoneBackupModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

      {/* Offline Status Warning Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-neutral-100 font-sans text-neutral-900">
        <Header />
        <main className="flex-1 flex flex-col overflow-hidden">
          <MainContent />
        </main>
      </div>
    </AppProvider>
  );
}
