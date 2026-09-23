import React, { useState, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Check, 
  CheckCheck, 
  Users, 
  MessageSquare,
  CircleDashed,
  Phone,
  Video,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Image as ImageIcon, 
  Mic, 
  Smartphone,
  Camera,
  Sparkles,
  Pin,
  BellOff,
  Trash2,
  UserX,
  CheckSquare,
  Square,
  MoreVertical,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Conversation, User } from '../../types';
import { NewChatModal } from './NewChatModal';
import { WhatsAppStatusRow } from './WhatsAppStatusRow';
import { StoryViewerModal } from '../stories/StoryViewerModal';

interface ChatListProps {
  onSelectChat?: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  const { 
    conversations, 
    selectedConversationId, 
    setSelectedConversationId, 
    users, 
    currentUser, 
    typingMap, 
    stories,
    createStory,
    callLogs,
    startCall,
    setIsContactsSyncModalOpen, 
    phoneContacts,
    pinnedConversationIds,
    mutedConversationIds,
    blockedUserIds,
    togglePinConversation,
    toggleMuteConversation,
    blockUser,
    unblockUser,
    deleteConversation,
    deleteMultipleConversations,
    openProfilePhotoModal,
    fontSize,
    setActiveTab,
  } = useApp();

  const [subTab, setSubTab] = useState<'chats' | 'status' | 'calls'>('chats');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups'>('all');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [storyMedia, setStoryMedia] = useState<string | null>(null);
  const [storyCaption, setStoryCaption] = useState('');
  const statusFileInputRef = useRef<HTMLInputElement>(null);

  // Selection mode state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedConvIds, setSelectedConvIds] = useState<string[]>([]);
  const [activeItemMenuId, setActiveItemMenuId] = useState<string | null>(null);

  const totalUnread = Object.values(
    conversations.reduce((acc, conv) => {
      const u = conv.unreadCount[currentUser.id] || 0;
      return acc + u;
    }, 0)
  );

  const getDirectChatUser = (conv: Conversation): User | undefined => {
    const otherId = conv.participants.find((id) => id !== currentUser.id) || conv.participants[0];
    return users.find((u) => u.id === otherId);
  };

  const filteredConversations = conversations.filter((conv) => {
    if (filter === 'groups' && conv.type !== 'group') return false;
    const unread = conv.unreadCount[currentUser.id] || 0;
    if (filter === 'unread' && unread === 0) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      if (conv.type === 'group') {
        return conv.name?.toLowerCase().includes(q) || false;
      } else {
        const contact = getDirectChatUser(conv);
        return (
          contact?.name.toLowerCase().includes(q) ||
          contact?.username.toLowerCase().includes(q) ||
          contact?.phone?.includes(q) ||
          false
        );
      }
    }
    return true;
  });

  // Sort pinned conversations first
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    const aPinned = pinnedConversationIds.includes(a.id) || a.pinned;
    const bPinned = pinnedConversationIds.includes(b.id) || b.pinned;
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const toggleSelectConv = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedConvIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedConvIds.length === sortedConversations.length) {
      setSelectedConvIds([]);
    } else {
      setSelectedConvIds(sortedConversations.map((c) => c.id));
    }
  };

  const handleBatchPin = () => {
    selectedConvIds.forEach((id) => togglePinConversation(id));
    setIsSelectionMode(false);
    setSelectedConvIds([]);
  };

  const handleBatchMute = () => {
    selectedConvIds.forEach((id) => toggleMuteConversation(id));
    setIsSelectionMode(false);
    setSelectedConvIds([]);
  };

  const handleBatchDelete = () => {
    if (window.confirm(`Supprimer définitivement ${selectedConvIds.length} discussion(s) ?`)) {
      deleteMultipleConversations(selectedConvIds);
      setIsSelectionMode(false);
      setSelectedConvIds([]);
    }
  };

  const handleBatchBlock = () => {
    const toBlockUsers: string[] = [];
    selectedConvIds.forEach((id) => {
      const conv = conversations.find((c) => c.id === id);
      if (conv && conv.type !== 'group') {
        const otherId = conv.participants.find((p) => p !== currentUser.id);
        if (otherId) toBlockUsers.push(otherId);
      }
    });
    if (toBlockUsers.length > 0) {
      if (window.confirm(`Bloquer ${toBlockUsers.length} contact(s) sélectionné(s) ?`)) {
        toBlockUsers.forEach((uId) => blockUser(uId));
        setIsSelectionMode(false);
        setSelectedConvIds([]);
      }
    }
  };

  const formatMessageTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
  };

  const handleStatusFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoryMedia(reader.result as string);
        setIsCreatingStory(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishStory = () => {
    if (!storyMedia) return;
    createStory(storyMedia, storyCaption.trim() || undefined);
    setStoryMedia(null);
    setStoryCaption('');
    setIsCreatingStory(false);
  };

  const myStories = stories.filter((s) => s.authorId === currentUser.id);
  const friendsStories = stories.filter((s) => s.authorId !== currentUser.id);

  return (
    <div id="chat-list-panel" className="flex flex-col h-full bg-neutral-900 border-r border-neutral-800 text-neutral-100">
      {/* Top Header with Phone Sync & New Chat */}
      <div className="p-3.5 sm:p-4 pb-2.5 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-950/40">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Flex Messaging
          </h1>
          <p className="text-[11px] text-neutral-400">
            Discussions, statuts 24h & contacts téléphoniques
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Synchronized Phone Contacts Button */}
          <button
            id="btn-open-phone-contacts-sync"
            onClick={() => setIsContactsSyncModalOpen(true)}
            className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-400 hover:text-cyan-300 flex items-center justify-center transition-transform active:scale-95 border border-neutral-700/80 shadow-xs relative"
            title="Contacts de mon téléphone reliés"
          >
            <Smartphone className="w-4 h-4" />
            {phoneContacts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-neutral-950 font-black text-[9px] flex items-center justify-center ring-2 ring-neutral-900">
                {phoneContacts.length > 99 ? '99+' : phoneContacts.length}
              </span>
            )}
          </button>

          {/* New Chat Button */}
          <button
            id="btn-open-new-chat"
            onClick={() => setIsNewChatOpen(true)}
            className="w-10 h-10 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center transition-transform active:scale-95 shadow-lg shadow-violet-950/50"
            title="Nouvelle discussion"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Flex Exclusive Navigation Sub-Tabs: Discussions / Statuts / Appels */}
      <div className="grid grid-cols-3 border-b border-violet-950/40 bg-neutral-950/80 p-1.5 gap-1.5">
        <button
          onClick={() => setSubTab('chats')}
          className={`py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            subTab === 'chats'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-950/40 border border-violet-500/40'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-violet-200" />
          <span>Discussions</span>
          {Number(totalUnread) > 0 && (
            <span className="min-w-4.5 h-4.5 px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
              {totalUnread}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('feed')}
          className="py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
          title="Accéder aux statuts et stories dans le Fil Flex"
        >
          <CircleDashed className="w-4 h-4 text-violet-400" />
          <span>Statuts Flex</span>
          {stories.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setSubTab('calls')}
          className={`py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            subTab === 'calls'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-950/40 border border-violet-500/40'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Phone className="w-4 h-4 text-violet-200" />
          <span>Appels</span>
          {callLogs.length > 0 && (
            <span className="text-xs text-neutral-300 font-bold">
              ({callLogs.length})
            </span>
          )}
        </button>
      </div>

      {/* --- SUBTAB 1: DISCUSSIONS --- */}
      {subTab === 'chats' && (
        <>
          {/* Search Bar - Directly placed at top, creating generous vertical space for messages */}
          <div className="px-3.5 py-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-search-chats"
                type="text"
                placeholder="Rechercher contact, téléphone ou message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-2xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-hidden focus:border-violet-500 transition-colors"
              />
            </div>

            {/* Quick Filters + Selection Toggle */}
            <div className="flex items-center justify-between gap-1.5 mt-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    filter === 'all'
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    filter === 'unread'
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Non lues
                </button>
                <button
                  onClick={() => setFilter('groups')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    filter === 'groups'
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Groupes
                </button>
              </div>

              {/* Mode Sélection Button */}
              <button
                onClick={() => {
                  setIsSelectionMode(!isSelectionMode);
                  setSelectedConvIds([]);
                  setActiveItemMenuId(null);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  isSelectionMode
                    ? 'bg-cyan-500 text-neutral-950 shadow-xs'
                    : 'bg-neutral-800 text-neutral-300 hover:text-white'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{isSelectionMode ? 'Terminer' : 'Sélectionner'}</span>
              </button>
            </div>

            {/* Batch Action Toolbar when Selection Mode is Active */}
            {isSelectionMode && (
              <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-2 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-400">
                    {selectedConvIds.length} sélectionnée(s)
                  </span>
                  <button
                    onClick={handleSelectAll}
                    className="text-[11px] text-neutral-400 hover:text-white underline"
                  >
                    {selectedConvIds.length === sortedConversations.length ? 'Tout décocher' : 'Tout sélectionner'}
                  </button>
                </div>

                {selectedConvIds.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
                    <button
                      onClick={handleBatchPin}
                      className="px-2.5 py-1 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 rounded-lg text-[11px] font-bold flex items-center gap-1 shrink-0 transition"
                      title="Épingler ou désépingler"
                    >
                      <Pin className="w-3 h-3" />
                      <span>Épingler</span>
                    </button>

                    <button
                      onClick={handleBatchMute}
                      className="px-2.5 py-1 bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-amber-300 rounded-lg text-[11px] font-bold flex items-center gap-1 shrink-0 transition"
                      title="Suspendre les notifications"
                    >
                      <BellOff className="w-3 h-3" />
                      <span>Suspendre</span>
                    </button>

                    <button
                      onClick={handleBatchBlock}
                      className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg text-[11px] font-bold flex items-center gap-1 shrink-0 transition"
                      title="Bloquer les utilisateurs"
                    >
                      <UserX className="w-3 h-3" />
                      <span>Bloquer</span>
                    </button>

                    <button
                      onClick={handleBatchDelete}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shrink-0 transition ml-auto"
                      title="Supprimer définitivement"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/40">
            {sortedConversations.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">
                <p className="text-sm font-semibold mb-1">Aucune discussion trouvée</p>
                <p className="text-xs mb-3">Démarrez un échange direct avec vos contacts</p>
                <button
                  onClick={() => setIsNewChatOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Nouvelle conversation
                </button>
              </div>
            ) : (
              sortedConversations.map((conv) => {
                const isGroup = conv.type === 'group';
                const contact = !isGroup ? getDirectChatUser(conv) : undefined;
                const title = isGroup ? conv.name : contact?.name || 'Contact';
                const avatar = isGroup ? conv.avatar : contact?.avatar;
                const isOnline = contact?.status === 'online';
                const unread = conv.unreadCount[currentUser.id] || 0;
                const isSelected = selectedConversationId === conv.id;
                const typingUsers = typingMap[conv.id] || [];
                const isTyping = typingUsers.length > 0;

                const isPinned = pinnedConversationIds.includes(conv.id) || conv.pinned;
                const isMuted = mutedConversationIds.includes(conv.id) || conv.muted;
                const isBlocked = contact ? blockedUserIds.includes(contact.id) : false;
                const isCheckedInSelection = selectedConvIds.includes(conv.id);

                return (
                  <div
                    key={conv.id}
                    id={`conversation-item-${conv.id}`}
                    onClick={() => {
                      if (isSelectionMode) {
                        toggleSelectConv(conv.id);
                      } else {
                        setSelectedConversationId(conv.id);
                        if (onSelectChat) onSelectChat();
                      }
                    }}
                    className={`p-3 sm:px-4 flex items-center gap-3 cursor-pointer transition-colors relative group ${
                      isSelected && !isSelectionMode
                        ? 'bg-violet-950/40 border-l-4 border-violet-500 shadow-inner'
                        : isCheckedInSelection
                        ? 'bg-violet-950/20'
                        : 'hover:bg-neutral-800/50'
                    }`}
                  >
                    {/* Selection Checkbox */}
                    {isSelectionMode && (
                      <div 
                        onClick={(e) => toggleSelectConv(conv.id, e)}
                        className="shrink-0 text-violet-400 cursor-pointer"
                      >
                        {isCheckedInSelection ? (
                          <CheckSquare className="w-5 h-5 fill-violet-500 text-neutral-900" />
                        ) : (
                          <Square className="w-5 h-5 text-neutral-500 hover:text-neutral-300" />
                        )}
                      </div>
                    )}

                    {/* Avatar with Status badge (Click to view full photo) */}
                    <div 
                      onClick={(e) => {
                        if (contact) {
                          e.stopPropagation();
                          openProfilePhotoModal(contact);
                        }
                      }}
                      className="relative shrink-0 cursor-pointer group/avatar"
                      title="Cliquer pour voir la photo en grand"
                    >
                      <img
                        src={avatar}
                        alt={title}
                        className={`w-12 h-12 rounded-2xl object-cover ring-2 group-hover/avatar:ring-violet-400 transition-all ${
                          isBlocked ? 'ring-rose-700 opacity-60 grayscale' : 'ring-neutral-700'
                        }`}
                      />
                      {isGroup ? (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-violet-600 text-white flex items-center justify-center ring-2 ring-neutral-900 shadow-xs">
                          <Users className="w-3 h-3" />
                        </span>
                      ) : (
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-neutral-900 ${
                            isBlocked
                              ? 'bg-rose-500'
                              : isOnline
                              ? 'bg-violet-400 shadow-xs shadow-violet-400/50'
                              : 'bg-neutral-600'
                          }`}
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <h3 className={`text-base font-black truncate ${
                            unread > 0 ? 'text-white' : 'text-neutral-200'
                          }`}>
                            {title}
                          </h3>
                          {isPinned && (
                            <Pin className="w-3.5 h-3.5 text-violet-400 fill-violet-400/30 shrink-0" />
                          )}
                          {isMuted && (
                            <BellOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                          {isBlocked && (
                            <span className="px-1.5 py-0.2 text-[10px] bg-rose-950 text-rose-300 border border-rose-800 rounded font-bold shrink-0">
                              Bloqué
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span className="text-[11px] text-neutral-400 font-medium">
                            {formatMessageTime(conv.lastMessage?.timestamp || conv.updatedAt)}
                          </span>

                          {/* Quick Menu Trigger (⋮) */}
                          {!isSelectionMode && (
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setActiveItemMenuId(activeItemMenuId === conv.id ? null : conv.id)}
                                className="p-1 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition"
                                title="Actions"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>

                              {/* Dropdown Menu */}
                              {activeItemMenuId === conv.id && (
                                <div className="absolute right-0 top-6 z-30 w-44 bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-xl p-1.5 space-y-0.5 text-xs text-neutral-200 animate-fade-in">
                                  <button
                                    onClick={() => {
                                      togglePinConversation(conv.id);
                                      setActiveItemMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-neutral-800 text-left font-medium"
                                  >
                                    <Pin className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>{isPinned ? 'Désépingler' : 'Épingler'}</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      toggleMuteConversation(conv.id);
                                      setActiveItemMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-neutral-800 text-left font-medium"
                                  >
                                    <BellOff className="w-3.5 h-3.5 text-amber-400" />
                                    <span>{isMuted ? 'Réactiver sons' : 'Suspendre'}</span>
                                  </button>

                                  {contact && (
                                    <button
                                      onClick={() => {
                                        if (isBlocked) {
                                          unblockUser(contact.id);
                                        } else {
                                          blockUser(contact.id);
                                        }
                                        setActiveItemMenuId(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-neutral-800 text-left font-medium text-rose-300"
                                    >
                                      <UserX className="w-3.5 h-3.5 text-rose-400" />
                                      <span>{isBlocked ? 'Débloquer' : 'Bloquer le contact'}</span>
                                    </button>
                                  )}

                                  <button
                                    onClick={() => {
                                      if (window.confirm('Supprimer définitivement cette discussion ?')) {
                                        deleteConversation(conv.id);
                                      }
                                      setActiveItemMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-rose-950/60 text-left font-medium text-rose-400"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Supprimer discussion</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-1">
                        {isTyping ? (
                          <p className="text-xs sm:text-sm text-violet-400 font-bold truncate animate-pulse flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                            En train d'écrire...
                          </p>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-300 truncate">
                            {conv.lastMessage?.senderId === currentUser.id && (
                              <span className="text-neutral-400 shrink-0">
                                {conv.lastMessage?.status === 'read' ? (
                                  <CheckCheck className="w-4 h-4 text-violet-400 inline" />
                                ) : (
                                  <Check className="w-4 h-4 inline" />
                                )}
                              </span>
                            )}
                            {conv.lastMessage?.type === 'image' && (
                              <span className="flex items-center gap-1 text-violet-300 font-semibold">
                                <ImageIcon className="w-4 h-4 shrink-0" /> Photo
                              </span>
                            )}
                            {conv.lastMessage?.type === 'voice' && (
                              <span className="flex items-center gap-1 text-violet-300 font-semibold">
                                <Mic className="w-4 h-4 shrink-0" /> Message vocal
                              </span>
                            )}
                            {conv.lastMessage?.type === 'text' && (
                              <span className="truncate">{conv.lastMessage.content}</span>
                            )}
                            {!conv.lastMessage && (
                              <span className="italic text-neutral-500">Commencer la discussion</span>
                            )}
                          </div>
                        )}

                        {unread > 0 && (
                          <span className="min-w-5 h-5 px-1.5 rounded-full bg-violet-600 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-md shadow-violet-950/50">
                            {unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* --- SUBTAB 2: DEDICATED STATUTS (STATUTS FLEX EXCLUSIFS) --- */}
      {subTab === 'status' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* My Status Card */}
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-3.5 flex items-center justify-between">
            <div 
              onClick={() => {
                if (myStories.length > 0) {
                  const idx = stories.findIndex((s) => s.id === myStories[0].id);
                  if (idx !== -1) setSelectedStoryIndex(idx);
                } else {
                  statusFileInputRef.current?.click();
                }
              }}
              className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
            >
              <div className="relative shrink-0">
                <div className={`w-13 h-13 rounded-full p-0.5 ${
                  myStories.length > 0
                    ? 'bg-gradient-to-tr from-emerald-400 via-cyan-400 to-indigo-500'
                    : 'bg-neutral-800'
                }`}>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full rounded-full object-cover ring-2 ring-neutral-900"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full bg-emerald-500 text-neutral-950 font-black text-xs flex items-center justify-center ring-2 ring-neutral-900">
                  +
                </span>
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white">Mon statut</h3>
                <p className="text-xs text-neutral-400 truncate">
                  {myStories.length > 0
                    ? `${myStories.length} mise${myStories.length > 1 ? 's' : ''} à jour active`
                    : 'Appuyez pour ajouter une actualité'}
                </p>
              </div>
            </div>

            <button
              onClick={() => statusFileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-emerald-400 hover:text-emerald-300 transition-colors"
              title="Prendre une photo ou importer"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={statusFileInputRef}
              onChange={handleStatusFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Friends' Status Updates */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-400 mb-2.5 flex items-center gap-1.5">
              <span>Mises à jour récentes</span>
              <span className="text-[10px] text-emerald-400 font-bold">({friendsStories.length})</span>
            </h4>

            {friendsStories.length === 0 ? (
              <div className="p-6 text-center text-neutral-500 bg-neutral-950/40 rounded-2xl border border-neutral-800/60">
                <CircleDashed className="w-8 h-8 text-neutral-600 mx-auto mb-2 opacity-60" />
                <p className="text-xs font-semibold text-neutral-400 mb-0.5">Aucun statut récent</p>
                <p className="text-[11px] text-neutral-500">Les statuts de vos amis s'afficheront ici pendant 24 heures.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {friendsStories.map((story) => {
                  const storyIdx = stories.findIndex((s) => s.id === story.id);
                  return (
                    <div
                      key={story.id}
                      onClick={() => setSelectedStoryIndex(storyIdx)}
                      className="p-2.5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 hover:bg-neutral-800/50 cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-emerald-400 via-cyan-400 to-indigo-500 shrink-0 shadow-xs">
                        <img
                          src={story.authorAvatar}
                          alt={story.authorName}
                          className="w-full h-full rounded-full object-cover ring-2 ring-neutral-900"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-white truncate">{story.authorName}</h5>
                        <p className="text-[11px] text-neutral-400 truncate">
                          {story.caption || 'Statut photo (24h)'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SUBTAB 3: CALLS LOGS & SPEED DIAL --- */}
      {subTab === 'calls' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-400">
              Historique des appels récents
            </h4>
            <span className="text-[11px] text-indigo-400 font-bold">Chiffré WebRTC</span>
          </div>

          {callLogs.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 bg-neutral-950/40 rounded-2xl border border-neutral-800/60">
              <Phone className="w-8 h-8 text-neutral-600 mx-auto mb-2 opacity-60" />
              <p className="text-xs font-semibold text-neutral-400 mb-0.5">Aucun appel récent</p>
              <p className="text-[11px] text-neutral-500">Lancez un appel audio ou vidéo depuis une discussion ou un contact.</p>
            </div>
          ) : (
            <div className="space-y-1.5 divide-y divide-neutral-800/50">
              {callLogs.map((log) => {
                const contact = log.contact;
                const isMissed = log.direction === 'missed';
                const isIncoming = log.direction === 'incoming';

                return (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl hover:bg-neutral-800/50 flex items-center justify-between transition-colors pt-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-neutral-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <h5 className={`text-xs font-bold truncate ${isMissed ? 'text-rose-400' : 'text-white'}`}>
                          {contact.name}
                        </h5>
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                          {isMissed && <PhoneMissed className="w-3 h-3 text-rose-500 inline" />}
                          {isIncoming && <PhoneIncoming className="w-3 h-3 text-cyan-400 inline" />}
                          {!isMissed && !isIncoming && <PhoneOutgoing className="w-3 h-3 text-emerald-400 inline" />}
                          <span>{formatMessageTime(log.timestamp)}</span>
                          {log.duration ? <span>• {log.duration}</span> : null}
                        </div>
                      </div>
                    </div>

                    {contact && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startCall(contact, 'audio')}
                          className="p-2 rounded-lg bg-neutral-800 hover:bg-emerald-950/80 text-emerald-400 transition-colors"
                          title="Rappeler en audio"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => startCall(contact, 'video')}
                          className="p-2 rounded-lg bg-neutral-800 hover:bg-cyan-950/80 text-cyan-400 transition-colors"
                          title="Rappeler en vidéo"
                        >
                          <Video className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
      />

      {/* Story Viewer Modal */}
      {selectedStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={selectedStoryIndex}
          onClose={() => setSelectedStoryIndex(null)}
        />
      )}

      {/* Status Creator Modal */}
      {isCreatingStory && storyMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in">
          <div className="bg-neutral-900 rounded-3xl max-w-sm w-full overflow-hidden border border-neutral-800 shadow-2xl text-white animate-scale-in">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-black text-sm">Nouveau statut Flex (24h)</h3>
              <button
                onClick={() => setIsCreatingStory(false)}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1"
              >
                Annuler
              </button>
            </div>

            <div className="h-72 bg-neutral-950 overflow-hidden relative flex items-center justify-center">
              <img src={storyMedia} alt="Story" className="w-full h-full object-contain" />
            </div>

            <div className="p-4 space-y-3">
              <input
                type="text"
                placeholder="Ajouter une légende..."
                value={storyCaption}
                onChange={(e) => setStoryCaption(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-500"
              />
              <button
                onClick={handlePublishStory}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-neutral-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20"
              >
                Diffuser mon statut
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
