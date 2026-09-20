import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Check, 
  CheckCheck, 
  Users, 
  Pin, 
  Image as ImageIcon, 
  Mic, 
  Filter 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Conversation, User } from '../../types';
import { NewChatModal } from './NewChatModal';

interface ChatListProps {
  onSelectChat?: () => void; // for responsive mobile view toggle
}

export const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  const { 
    conversations, 
    selectedConversationId, 
    setSelectedConversationId, 
    users, 
    currentUser,
    typingMap 
  } = useApp();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups'>('all');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  // Helper to get other user details for direct chat
  const getDirectChatUser = (conv: Conversation): User | undefined => {
    const otherId = conv.participants.find((id) => id !== currentUser.id) || conv.participants[0];
    return users.find((u) => u.id === otherId);
  };

  const filteredConversations = conversations.filter((conv) => {
    // Filter by type
    if (filter === 'groups' && conv.type !== 'group') return false;
    const unread = conv.unreadCount[currentUser.id] || 0;
    if (filter === 'unread' && unread === 0) return false;

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      if (conv.type === 'group') {
        return conv.name?.toLowerCase().includes(q) || false;
      } else {
        const contact = getDirectChatUser(conv);
        return contact?.name.toLowerCase().includes(q) || contact?.username.toLowerCase().includes(q) || false;
      }
    }
    return true;
  });

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

  return (
    <div id="chat-list-panel" className="flex flex-col h-full bg-white border-r border-neutral-200">
      {/* Top action header */}
      <div className="p-4 pb-3 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            Discussions
          </h1>
          <p className="text-xs text-neutral-500">
            {conversations.length} conversation{conversations.length > 1 ? 's' : ''} actives
          </p>
        </div>

        <button
          id="btn-open-new-chat"
          onClick={() => setIsNewChatOpen(true)}
          className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs"
          title="Nouvelle discussion"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-chats"
            type="text"
            placeholder="Rechercher ou démarrer une discussion"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-100 border border-transparent rounded-xl text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="px-4 py-1.5 flex items-center gap-1.5 border-b border-neutral-100 overflow-x-auto no-scrollbar">
        <button
          id="filter-all-chats"
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
            filter === 'all'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Tous
        </button>
        <button
          id="filter-unread-chats"
          onClick={() => setFilter('unread')}
          className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-colors flex items-center gap-1 ${
            filter === 'unread'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Non lus
        </button>
        <button
          id="filter-groups-chats"
          onClick={() => setFilter('groups')}
          className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-colors flex items-center gap-1 ${
            filter === 'groups'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <Users className="w-3 h-3" />
          Groupes
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-50 px-2 py-1">
        {filteredConversations.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <p className="text-sm font-medium text-neutral-500">Aucune discussion trouvée</p>
            <p className="text-xs text-neutral-400 mt-1">Commencez une nouvelle causerie avec un proche !</p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isSelected = selectedConversationId === conv.id;
            const contact = conv.type === 'direct' ? getDirectChatUser(conv) : null;
            const unread = conv.unreadCount[currentUser.id] || 0;
            const typingUsers = typingMap[conv.id] || [];
            const isTyping = typingUsers.length > 0;

            const name = conv.type === 'group' ? conv.name : contact?.name || 'Contact';
            const avatar = conv.type === 'group' ? conv.avatar : contact?.avatar;
            const isOnline = contact?.status === 'online';

            return (
              <div
                key={conv.id}
                id={`chat-item-${conv.id}`}
                onClick={() => {
                  setSelectedConversationId(conv.id);
                  if (onSelectChat) onSelectChat();
                }}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-50/80 border border-emerald-200/60 shadow-xs'
                    : 'hover:bg-neutral-50 border border-transparent'
                }`}
              >
                {/* Avatar with indicator */}
                <div className="relative shrink-0">
                  <img
                    src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={name}
                    className="w-12 h-12 rounded-full object-cover border border-neutral-200"
                  />
                  {conv.type === 'direct' ? (
                    <span
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        isOnline ? 'bg-emerald-500' : 'bg-neutral-300'
                      }`}
                      title={isOnline ? 'En ligne' : 'Hors ligne'}
                    />
                  ) : (
                    <span className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-600 rounded-full text-white border-2 border-white shadow-xs">
                      <Users className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`text-sm font-semibold truncate ${isSelected ? 'text-emerald-950' : 'text-neutral-900'}`}>
                        {name}
                      </span>
                      {conv.pinned && (
                        <Pin className="w-3 h-3 text-emerald-600 rotate-45 shrink-0" />
                      )}
                    </div>
                    <span className={`text-[11px] shrink-0 font-medium ${unread > 0 ? 'text-emerald-600 font-bold' : 'text-neutral-400'}`}>
                      {formatMessageTime(conv.updatedAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-neutral-500 truncate pr-2 flex items-center gap-1">
                      {isTyping ? (
                        <span className="text-emerald-600 font-semibold italic flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {typingUsers[0]} écrit...
                        </span>
                      ) : conv.lastMessage ? (
                        <>
                          {conv.lastMessage.senderId === currentUser.id && (
                            conv.lastMessage.status === 'read' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            )
                          )}
                          {conv.lastMessage.type === 'voice' && (
                            <Mic className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                          {conv.lastMessage.type === 'image' && (
                            <ImageIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          )}
                          <span className="truncate">
                            {conv.type === 'group' && conv.lastMessage.senderId !== currentUser.id
                              ? `${conv.lastMessage.senderName.split(' ')[0]}: `
                              : ''}
                            {conv.lastMessage.type === 'voice'
                              ? 'Message vocal'
                              : conv.lastMessage.type === 'image'
                              ? 'Photo'
                              : conv.lastMessage.content}
                          </span>
                        </>
                      ) : (
                        <span className="italic text-neutral-400">Aucun message</span>
                      )}
                    </div>

                    {unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-xs">
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

      {/* New chat modal */}
      <NewChatModal isOpen={isNewChatOpen} onClose={() => setIsNewChatOpen(false)} />
    </div>
  );
};
