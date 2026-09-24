import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
  User, 
  Conversation, 
  Message, 
  Post, 
  Story, 
  CallLog, 
  CallSession, 
  MessageType, 
  PostReactionType,
  PhoneContact,
  ThemeMode,
  ChatWallpaper
} from '../types';
import { 
  AVAILABLE_USERS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_MESSAGES, 
  INITIAL_POSTS, 
  INITIAL_STORIES, 
  INITIAL_CALL_LOGS 
} from '../data/initialData';
import { checkContentModeration, ModerationResult } from '../utils/moderationFilter';
import { DEFAULT_WALLPAPERS, DEFAULT_DARK_WALLPAPER, DEFAULT_LIGHT_WALLPAPER } from '../utils/wallpaperPresets';
import { playNotificationSound } from '../utils/callSounds';

interface AppContextType {
  currentUser: User;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  logoutUser: () => void;
  users: User[];
  activeTab: 'chats' | 'feed' | 'stories' | 'calls';
  setActiveTab: (tab: 'chats' | 'feed' | 'stories' | 'calls') => void;
  conversations: Conversation[];
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  selectedConversation: Conversation | null;
  messages: Message[];
  conversationMessages: Message[];
  posts: Post[];
  stories: Story[];
  callLogs: CallLog[];
  activeCall: CallSession | null;
  wsConnected: boolean;
  typingMap: Record<string, string[]>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isSecurityModalOpen: boolean;
  setIsSecurityModalOpen: (open: boolean) => void;
  isContactsSyncModalOpen: boolean;
  setIsContactsSyncModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isLinkedDevicesModalOpen: boolean;
  setIsLinkedDevicesModalOpen: (open: boolean) => void;
  // Profile Photo Lightbox Modal
  isProfilePhotoModalOpen: boolean;
  profilePhotoModalUser: User | null;
  openProfilePhotoModal: (user?: User) => void;
  closeProfilePhotoModal: () => void;
  // Font Size
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  // Multi-Account Switcher
  secondaryUser: User | null;
  savedAccounts: User[];
  switchAccount: (userId: string) => void;
  addSecondaryAccount: (user: User) => void;
  removeLinkedAccount: (userId: string) => void;
  // Verification code & Phone SIM recovery
  incomingOtpCode: { code: string; target: string; message: string } | null;
  clearIncomingOtpCode: () => void;
  requestVerificationCode: (target: string, type?: 'phone' | 'email') => Promise<{ success: boolean; code?: string; message?: string }>;
  verifyCodeAndLogin: (target: string, code: string, pin?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  recoverAccount: (identifier: string, codeOrKey: string, newPin?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  updateUserProfile: (data: Partial<User>) => void;
  pairDevice: (name: string, type: 'pc' | 'mobile', os: string) => void;
  revokeDevice: (deviceId: string) => void;
  phoneContacts: import('../types').PhoneContact[];
  importPhoneContacts: (contacts: { name: string; tel: string; email?: string }[]) => Promise<number>;
  addSinglePhoneContact: (contact: { name: string; tel: string; email?: string }) => void;
  removePhoneContact: (contactId: string) => void;
  startChatWithPhoneContact: (contact: import('../types').PhoneContact) => string;
  // Pin, Mute, Block, Delete & Moderation
  pinnedConversationIds: string[];
  mutedConversationIds: string[];
  blockedUserIds: string[];
  togglePinConversation: (conversationId: string) => void;
  toggleMuteConversation: (conversationId: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  reportUser: (userId: string, reason: string, details?: string) => boolean;
  deleteConversation: (conversationId: string) => void;
  deleteMultipleConversations: (conversationIds: string[]) => void;
  clearAllChatHistory: () => void;
  deleteAccount: () => void;
  // Actions
  registerUser: (data: {
    name: string;
    firstName?: string;
    lastName?: string;
    country?: string;
    countryCode?: string;
    username?: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    email?: string;
    securityPin?: string;
  }) => void;
  loginUser: (identifier: string, pin?: string, recoveryKey?: string) => Promise<{ success: boolean; error?: string }>;
  updateSecurityPin: (newPin: string) => void;
  sendMessage: (data: {
    conversationId: string;
    content: string;
    type?: MessageType;
    mediaUrl?: string;
    voiceDuration?: number;
    replyToId?: string;
  }) => void;
  toggleMessageReaction: (messageId: string, emoji: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  sendTypingStatus: (conversationId: string, isTyping: boolean) => void;
  createPost: (data: {
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    privacy?: 'public' | 'friends';
  }) => void;
  deletePost: (postId: string) => void;
  sharePost: (postId: string) => void;
  togglePostReaction: (postId: string, reactionType: PostReactionType) => void;
  addPostComment: (postId: string, content: string) => void;
  deletePostComment: (postId: string, commentId: string) => void;
  likePostComment: (postId: string, commentId: string) => void;
  createStory: (mediaUrl: string, caption?: string) => void;
  startCall: (contact: User, type: 'audio' | 'video') => void;
  answerCall: () => void;
  endCall: () => void;
  switchCurrentUser: (user: User) => void;
  createNewConversation: (targetUserId: string) => string;
  createNewGroup: (name: string, participantIds: string[], avatar?: string) => string;
  validateContent: (text: string) => ModerationResult;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  chatWallpaper: ChatWallpaper;
  setChatWallpaper: (wallpaper: ChatWallpaper) => void;
  uploadCustomWallpaper: (file: File) => Promise<void>;
  resetChatWallpaper: () => void;
  playNotificationSound: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try retrieving saved user from localStorage
  const getInitialUser = (): User => {
    try {
      const saved = localStorage.getItem('flex_online_current_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read localStorage user', e);
    }
    return AVAILABLE_USERS[0]; // Default is Franck Alex
  };

  const getInitialMessages = (): Message[] => {
    try {
      const saved = localStorage.getItem('flex_online_cached_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read cached messages', e);
    }
    return INITIAL_MESSAGES;
  };

  const [currentUser, setCurrentUser] = useState<User>(getInitialUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('flex_online_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const logoutUser = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('flex_online_authenticated');
    } catch (e) {}
  };
  const [users, setUsers] = useState<User[]>(AVAILABLE_USERS);
  const [activeTab, setActiveTab] = useState<'chats' | 'feed' | 'stories' | 'calls'>('chats');
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(INITIAL_CONVERSATIONS[0].id);
  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [callLogs, setCallLogs] = useState<CallLog[]>(INITIAL_CALL_LOGS);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [typingMap, setTypingMap] = useState<Record<string, string[]>>({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [isContactsSyncModalOpen, setIsContactsSyncModalOpen] = useState<boolean>(false);

  // Phone Contacts state (stored in localStorage per user)
  const getInitialPhoneContacts = (): PhoneContact[] => {
    try {
      const saved = localStorage.getItem('flex_online_phone_contacts');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load phone contacts', e);
    }
    // Clean initial phone contact: Official Flex Support
    return [
      {
        id: 'phone-contact-support',
        name: 'Assistance Flex Officielle',
        tel: '+33 8 00 00 35 39',
        email: 'support@flexonline.network',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
        isRegisteredUser: true,
        matchedUserId: 'user-flex-support',
        dateSynced: new Date().toISOString(),
      },
    ];
  };

  const [phoneContacts, setPhoneContacts] = useState<PhoneContact[]>(getInitialPhoneContacts);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isLinkedDevicesModalOpen, setIsLinkedDevicesModalOpen] = useState<boolean>(false);

  // Font size preference (normal | large | xlarge) - default 'large' so no need to zoom!
  const [fontSize, setFontSizeState] = useState<'normal' | 'large' | 'xlarge'>(() => {
    try {
      const saved = localStorage.getItem('flex_font_size');
      return (saved as any) || 'large';
    } catch {
      return 'large';
    }
  });

  const setFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    setFontSizeState(size);
    try {
      localStorage.setItem('flex_font_size', size);
    } catch {}
  };

  // Theme Mode: 'dark' (noir) | 'light' (blanc)
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('flex_theme_mode');
      if (saved === 'light' || saved === 'dark') return saved;
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem('flex_theme_mode', mode);
    } catch {}
  };

  const toggleThemeMode = () => {
    const nextMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  // Sync theme with document class & data attribute
  useEffect(() => {
    if (themeMode === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, [themeMode]);

  // Chat Wallpaper Preference
  const [chatWallpaper, setChatWallpaperState] = useState<ChatWallpaper>(() => {
    try {
      const saved = localStorage.getItem('flex_chat_wallpaper');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return DEFAULT_DARK_WALLPAPER;
  });

  const setChatWallpaper = (wallpaper: ChatWallpaper) => {
    setChatWallpaperState(wallpaper);
    try {
      localStorage.setItem('flex_chat_wallpaper', JSON.stringify(wallpaper));
    } catch {}
  };

  const resetChatWallpaper = () => {
    const defaultWp = themeMode === 'light' ? DEFAULT_LIGHT_WALLPAPER : DEFAULT_DARK_WALLPAPER;
    setChatWallpaper(defaultWp);
  };

  const uploadCustomWallpaper = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const customWp: ChatWallpaper = {
          id: `custom-${Date.now()}`,
          name: 'Photo de ma galerie',
          type: 'image',
          value: base64,
          previewColor: '#2b2d42'
        };
        setChatWallpaper(customWp);
        resolve();
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Profile Photo Lightbox Modal
  const [isProfilePhotoModalOpen, setIsProfilePhotoModalOpen] = useState<boolean>(false);
  const [profilePhotoModalUser, setProfilePhotoModalUser] = useState<User | null>(null);

  const openProfilePhotoModal = (user?: User) => {
    setProfilePhotoModalUser(user || currentUser);
    setIsProfilePhotoModalOpen(true);
  };

  const closeProfilePhotoModal = () => {
    setIsProfilePhotoModalOpen(false);
    setProfilePhotoModalUser(null);
  };

  // Saved accounts (Multi-account support)
  const [savedAccounts, setSavedAccounts] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('flex_saved_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [AVAILABLE_USERS[0]];
  });

  const secondaryUser = savedAccounts.find((u) => u.id !== currentUser.id) || null;

  const switchAccount = (userId: string) => {
    const target = savedAccounts.find((u) => u.id === userId) || users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      try {
        localStorage.setItem('flex_online_current_user', JSON.stringify(target));
      } catch {}
    }
  };

  const addSecondaryAccount = (newUser: User) => {
    setSavedAccounts((prev) => {
      const existing = prev.filter((u) => u.id !== newUser.id);
      const updated = [...existing, newUser];
      try {
        localStorage.setItem('flex_saved_accounts', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const removeLinkedAccount = (userId: string) => {
    setSavedAccounts((prev) => {
      const updated = prev.filter((u) => u.id !== userId);
      try {
        localStorage.setItem('flex_saved_accounts', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Incoming SMS / OTP notification toast
  const [incomingOtpCode, setIncomingOtpCode] = useState<{ code: string; target: string; message: string } | null>(null);
  const clearIncomingOtpCode = () => setIncomingOtpCode(null);

  const verificationResolversRef = useRef<((val: any) => void)[]>([]);
  const recoveryResolversRef = useRef<((val: any) => void)[]>([]);
  const otpRequestResolversRef = useRef<((val: any) => void)[]>([]);

  // Moderation & Conversation preference states
  const [pinnedConversationIds, setPinnedConversationIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('flex_online_pinned_convs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [mutedConversationIds, setMutedConversationIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('flex_online_muted_convs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('flex_online_blocked_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const togglePinConversation = (conversationId: string) => {
    setPinnedConversationIds((prev) => {
      const isPinned = prev.includes(conversationId);
      const updated = isPinned ? prev.filter((id) => id !== conversationId) : [conversationId, ...prev];
      try {
        localStorage.setItem('flex_online_pinned_convs', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, pinned: !c.pinned } : c
      )
    );
  };

  const toggleMuteConversation = (conversationId: string) => {
    setMutedConversationIds((prev) => {
      const isMuted = prev.includes(conversationId);
      const updated = isMuted ? prev.filter((id) => id !== conversationId) : [...prev, conversationId];
      try {
        localStorage.setItem('flex_online_muted_convs', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, muted: !c.muted } : c
      )
    );
  };

  const blockUser = (userId: string) => {
    if (!userId || userId === currentUser.id) return;
    setBlockedUserIds((prev) => {
      if (prev.includes(userId)) return prev;
      const updated = [...prev, userId];
      try {
        localStorage.setItem('flex_online_blocked_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const unblockUser = (userId: string) => {
    setBlockedUserIds((prev) => {
      const updated = prev.filter((id) => id !== userId);
      try {
        localStorage.setItem('flex_online_blocked_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const reportUser = (userId: string, reason: string, details?: string): boolean => {
    if (!userId) return false;
    try {
      const stored = localStorage.getItem('flex_online_reports');
      const reports = stored ? JSON.parse(stored) : [];
      reports.push({
        id: `rep_${Date.now()}`,
        reportedUserId: userId,
        reportedBy: currentUser.id,
        reason,
        details: details || '',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('flex_online_reports', JSON.stringify(reports));
      // Auto-block the reported user for safety
      blockUser(userId);
      return true;
    } catch (e) {
      blockUser(userId);
      return true;
    }
  };

  const deleteConversation = (conversationId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    setPinnedConversationIds((prev) => prev.filter((id) => id !== conversationId));
    setMutedConversationIds((prev) => prev.filter((id) => id !== conversationId));
    
    setSelectedConversationId((currentId) => {
      if (currentId === conversationId) {
        const remaining = conversations.filter((c) => c.id !== conversationId);
        return remaining.length > 0 ? remaining[0].id : null;
      }
      return currentId;
    });
  };

  const deleteMultipleConversations = (conversationIds: string[]) => {
    if (conversationIds.length === 0) return;
    setConversations((prev) => prev.filter((c) => !conversationIds.includes(c.id)));
    setPinnedConversationIds((prev) => prev.filter((id) => !conversationIds.includes(id)));
    setMutedConversationIds((prev) => prev.filter((id) => !conversationIds.includes(id)));

    setSelectedConversationId((currentId) => {
      if (currentId && conversationIds.includes(currentId)) {
        const remaining = conversations.filter((c) => !conversationIds.includes(c.id));
        return remaining.length > 0 ? remaining[0].id : null;
      }
      return currentId;
    });
  };

  const clearAllChatHistory = () => {
    setConversations([]);
    setSelectedConversationId(null);
    setMessages([]);
    setPinnedConversationIds([]);
    setMutedConversationIds([]);
    try {
      localStorage.removeItem('flex_online_pinned_convs');
      localStorage.removeItem('flex_online_muted_convs');
    } catch (e) {}
  };

  const deleteAccount = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    setCurrentUser(AVAILABLE_USERS[0]);
    setIsSettingsModalOpen(false);
    window.location.reload();
  };

  // Auto-sync matched users whenever users list updates
  useEffect(() => {
    setPhoneContacts((prev) => {
      const updated = prev.map((contact) => {
        const cleanTel = contact.tel.replace(/[\s\-\.\+]/g, '');
        const matched = users.find((u) => {
          if (!u.phone) return false;
          const cleanUserPhone = u.phone.replace(/[\s\-\.\+]/g, '');
          return cleanTel.slice(-8) === cleanUserPhone.slice(-8) || 
                 u.name.toLowerCase() === contact.name.toLowerCase();
        });
        if (matched) {
          return {
            ...contact,
            isRegisteredUser: true,
            matchedUserId: matched.id,
            avatar: matched.avatar || contact.avatar,
          };
        }
        return contact;
      });
      try {
        localStorage.setItem('flex_online_phone_contacts', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, [users]);

  // Persist messages to localStorage so messages never vanish on page reload
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem('flex_online_cached_messages', JSON.stringify(messages));
      }
    } catch (e) {}
  }, [messages]);

  // Initial HTTP state sync as robust fallback
  useEffect(() => {
    fetch('/api/state')
      .then((res) => (res.ok ? res.json() : null))
      .then((serverState) => {
        if (serverState) {
          if (Array.isArray(serverState.users) && serverState.users.length > 0) {
            setUsers(serverState.users);
          }
          if (Array.isArray(serverState.conversations) && serverState.conversations.length > 0) {
            setConversations(serverState.conversations);
          }
          if (Array.isArray(serverState.messages) && serverState.messages.length > 0) {
            setMessages((prev) => {
              const map = new Map<string, Message>();
              prev.forEach((m) => map.set(m.id, m));
              serverState.messages.forEach((m: Message) => map.set(m.id, m));
              return Array.from(map.values()).sort(
                (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
              );
            });
          }
        }
      })
      .catch(() => {});
  }, []);

  // Dynamic document title with unread notifications in browser tab
  useEffect(() => {
    const totalUnread = conversations.reduce(
      (acc, conv) => acc + (conv.unreadCount[currentUser.id] || 0),
      0
    );
    if (totalUnread > 0) {
      document.title = `(${totalUnread}) Flex Online`;
    } else {
      document.title = 'Flex Online';
    }
  }, [conversations, currentUser.id]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const loginResolversRef = useRef<((res: { success: boolean; error?: string }) => void)[]>([]);

  // Setup WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
        reconnectAttemptsRef.current = 0;
      };

      ws.onclose = () => {
        setWsConnected(false);
        const attempts = reconnectAttemptsRef.current;
        const delay = attempts === 0 ? 5000 : attempts === 1 ? 12000 : attempts === 2 ? 25000 : 45000;
        reconnectAttemptsRef.current = attempts + 1;
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, delay);
      };

      ws.onerror = () => {
        setWsConnected(false);
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const { type, data } = payload;

          switch (type) {
            case 'init': {
              if (data.users) setUsers(data.users);
              if (data.conversations) setConversations(data.conversations);
              if (data.messages) setMessages(data.messages);
              if (data.posts) setPosts(data.posts);
              if (data.stories) setStories(data.stories);
              if (data.callLogs) setCallLogs(data.callLogs);
              break;
            }

            case 'user:registered_success': {
              if (data.user) {
                setCurrentUser(data.user);
                try {
                  localStorage.setItem('flex_online_current_user', JSON.stringify(data.user));
                } catch (err) {}
              }
              if (data.state) {
                if (data.state.users) setUsers(data.state.users);
                if (data.state.conversations) setConversations(data.state.conversations);
                if (data.state.messages) setMessages(data.state.messages);
                if (data.state.posts) setPosts(data.state.posts);
                if (data.state.stories) setStories(data.state.stories);
              }
              break;
            }

            case 'user:login_success': {
              if (data.user) {
                setCurrentUser(data.user);
                setIsAuthenticated(true);
                try {
                  localStorage.setItem('flex_online_current_user', JSON.stringify(data.user));
                  localStorage.setItem('flex_online_authenticated', 'true');
                } catch (err) {}
              }
              if (data.state) {
                if (data.state.users) setUsers(data.state.users);
                if (data.state.conversations) setConversations(data.state.conversations);
                if (data.state.messages) setMessages(data.state.messages);
                if (data.state.posts) setPosts(data.state.posts);
                if (data.state.stories) setStories(data.state.stories);
              }
              const resolver = loginResolversRef.current.shift();
              if (resolver) resolver({ success: true });
              break;
            }

            case 'user:login_failed': {
              const resolver = loginResolversRef.current.shift();
              if (resolver) resolver({ success: false, error: data.error });
              break;
            }

            case 'user:security_updated': {
              if (data.user) {
                setCurrentUser(data.user);
                setUsers((prev) => prev.map((u) => u.id === data.user.id ? data.user : u));
                try {
                  localStorage.setItem('flex_online_current_user', JSON.stringify(data.user));
                } catch (err) {}
              }
              break;
            }

            case 'user:directory_updated': {
              if (data.users) setUsers(data.users);
              if (data.conversations) setConversations(data.conversations);
              break;
            }

            case 'auth:code_sent': {
              const resolver = otpRequestResolversRef.current.shift();
              if (resolver) resolver({ success: true, code: data.code, message: data.message });
              break;
            }

            case 'auth:sms_received': {
              setIncomingOtpCode({
                code: data.code,
                target: data.target,
                message: data.message,
              });
              playNotificationSound();
              break;
            }

            case 'auth:verify_success': {
              if (data.user) {
                setCurrentUser(data.user);
                addSecondaryAccount(data.user);
                try {
                  localStorage.setItem('flex_online_current_user', JSON.stringify(data.user));
                } catch (err) {}
              }
              if (data.state) {
                if (data.state.users) setUsers(data.state.users);
                if (data.state.conversations) setConversations(data.state.conversations);
                if (data.state.messages) setMessages(data.state.messages);
              }
              const resolver = verificationResolversRef.current.shift();
              if (resolver) resolver({ success: true, user: data.user });
              break;
            }

            case 'auth:verify_failed': {
              const resolver = verificationResolversRef.current.shift();
              if (resolver) resolver({ success: false, error: data.error });
              break;
            }

            case 'auth:recover_success': {
              if (data.user) {
                setCurrentUser(data.user);
                addSecondaryAccount(data.user);
                try {
                  localStorage.setItem('flex_online_current_user', JSON.stringify(data.user));
                } catch (err) {}
              }
              if (data.state) {
                if (data.state.users) setUsers(data.state.users);
                if (data.state.conversations) setConversations(data.state.conversations);
                if (data.state.messages) setMessages(data.state.messages);
              }
              const resolver = recoveryResolversRef.current.shift();
              if (resolver) resolver({ success: true, user: data.user });
              break;
            }

            case 'auth:recover_failed': {
              const resolver = recoveryResolversRef.current.shift();
              if (resolver) resolver({ success: false, error: data.error });
              break;
            }

            case 'user:profile_updated': {
              if (data.user) {
                if (data.user.id === currentUser.id) {
                  setCurrentUser(data.user);
                  try {
                    localStorage.setItem('flex_online_current_user', JSON.stringify(data.user));
                  } catch (err) {}
                }
                setUsers((prev) => prev.map((u) => u.id === data.user.id ? data.user : u));
              }
              break;
            }

            case 'device:paired_success': {
              if (data.linkedDevices) {
                setCurrentUser((prev) => ({ ...prev, linkedDevices: data.linkedDevices }));
              }
              break;
            }

            case 'device:revoked_success': {
              if (data.linkedDevices) {
                setCurrentUser((prev) => ({ ...prev, linkedDevices: data.linkedDevices }));
              }
              break;
            }

            case 'chat:message_received': {
              const { message, conversation } = data;
              if (message && message.senderId !== currentUser.id) {
                playNotificationSound();
              }
              setMessages((prev) => {
                const existingIndex = prev.findIndex((m) => m.id === message.id);
                if (existingIndex !== -1) {
                  const updated = [...prev];
                  updated[existingIndex] = { ...updated[existingIndex], ...message, status: 'delivered' };
                  return updated;
                }
                // Check if matching optimistic message exists (same conversation, sender, content)
                const matchingOptIdx = prev.findIndex(
                  (m) =>
                    m.conversationId === message.conversationId &&
                    m.senderId === message.senderId &&
                    m.content === message.content &&
                    (m.id.startsWith('opt-') || m.id.startsWith('msg-') && m.status === 'sent')
                );
                if (matchingOptIdx !== -1) {
                  const updated = [...prev];
                  updated[matchingOptIdx] = { ...message, status: 'delivered' };
                  return updated;
                }
                return [...prev, message];
              });
              if (conversation) {
                setConversations((prev) => {
                  const idx = prev.findIndex((c) => c.id === conversation.id);
                  if (idx >= 0) {
                    const updated = [...prev];
                    updated[idx] = { ...updated[idx], ...conversation };
                    return updated;
                  }
                  return [conversation, ...prev];
                });
              }
              break;
            }

            case 'chat:reaction_updated': {
              const { messageId, reactions } = data;
              setMessages((prev) =>
                prev.map((m) => (m.id === messageId ? { ...m, reactions } : m))
              );
              break;
            }

            case 'chat:read_status': {
              const { conversationId, userId } = data;
              setConversations((prev) =>
                prev.map((c) =>
                  c.id === conversationId
                    ? { ...c, unreadCount: { ...c.unreadCount, [userId]: 0 } }
                    : c
                )
              );
              setMessages((prev) =>
                prev.map((m) =>
                  m.conversationId === conversationId && m.senderId !== userId
                    ? { ...m, status: 'read' }
                    : m
                )
              );
              break;
            }

            case 'chat:user_typing': {
              const { conversationId, userName, isTyping } = data;
              setTypingMap((prev) => {
                const current = prev[conversationId] || [];
                if (isTyping) {
                  if (!current.includes(userName)) {
                    return { ...prev, [conversationId]: [...current, userName] };
                  }
                } else {
                  return { ...prev, [conversationId]: current.filter((u) => u !== userName) };
                }
                return prev;
              });
              break;
            }

            case 'feed:post_created': {
              setPosts((prev) => {
                if (prev.some((p) => p.id === data.id)) return prev;
                return [data, ...prev];
              });
              break;
            }

            case 'feed:post_reaction_updated': {
              const { postId, reactions } = data;
              setPosts((prev) =>
                prev.map((p) => (p.id === postId ? { ...p, reactions } : p))
              );
              break;
            }

            case 'feed:comment_added': {
              const { postId, comment } = data;
              setPosts((prev) =>
                prev.map((p) => {
                  if (p.id === postId) {
                    if (p.comments.some((c) => c.id === comment.id)) return p;
                    return { ...p, comments: [...p.comments, comment] };
                  }
                  return p;
                })
              );
              break;
            }

            case 'feed:comment_liked': {
              const { postId, commentId, likes } = data;
              setPosts((prev) =>
                prev.map((p) => {
                  if (p.id === postId) {
                    return {
                      ...p,
                      comments: p.comments.map((c) =>
                        c.id === commentId ? { ...c, likes } : c
                      ),
                    };
                  }
                  return p;
                })
              );
              break;
            }

            case 'feed:post_deleted': {
              const { postId } = data;
              setPosts((prev) => prev.filter((p) => p.id !== postId));
              break;
            }

            case 'feed:post_shared': {
              const { postId, sharesCount } = data;
              setPosts((prev) =>
                prev.map((p) => (p.id === postId ? { ...p, sharesCount } : p))
              );
              break;
            }

            case 'feed:comment_deleted': {
              const { postId, commentId } = data;
              setPosts((prev) =>
                prev.map((p) =>
                  p.id === postId
                    ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
                    : p
                )
              );
              break;
            }

            case 'story:created': {
              setStories((prev) => {
                if (prev.some((s) => s.id === data.id)) return prev;
                return [data, ...prev];
              });
              break;
            }

            case 'call:signaled': {
              if (data.recipientId === currentUser.id && data.status === 'ringing') {
                setActiveCall({
                  id: data.id,
                  caller: data.caller,
                  recipient: currentUser,
                  type: data.type,
                  status: 'ringing',
                  startedAt: new Date().toISOString(),
                });
              } else if (data.status === 'connected') {
                setActiveCall((prev) => (prev ? { ...prev, status: 'connected' } : null));
              } else if (data.status === 'ended') {
                setActiveCall(null);
              }
              break;
            }

            default:
              break;
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };
    } catch (err) {
      console.warn('WebSocket connection not available:', err);
    }
  }, [currentUser]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connectWebSocket]);

  const sendWsMessage = (type: string, data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, data }));
    }
  };

  const registerUser = (data: {
    name: string;
    firstName?: string;
    lastName?: string;
    country?: string;
    countryCode?: string;
    username?: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    email?: string;
    securityPin?: string;
  }) => {
    const cleanUsername = (data.username || (data.firstName ? `${data.firstName.toLowerCase()}_${(data.lastName || '').toLowerCase()}` : data.name.toLowerCase().replace(/\s+/g, '_'))).trim().replace(/[^a-zA-Z0-9_]/g, '');
    const avatarUrl = data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername || 'flex_user'}`;
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      firstName: data.firstName?.trim(),
      lastName: data.lastName?.trim(),
      country: data.country || "Côte d'Ivoire",
      countryCode: data.countryCode || '+225',
      username: cleanUsername,
      avatar: avatarUrl,
      bio: data.bio || `Membre officiel Flex Online (${data.country || 'International'}) 👋`,
      phone: data.phone || '+225 00 00 00 00',
      email: data.email?.trim(),
      status: 'online',
      verified: true,
      securityPin: data.securityPin || '1234',
      recoveryKey: `FLEX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(newUser);
    setUsers((prev) => [newUser, ...prev.filter((u) => u.id !== newUser.id)]);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('flex_online_current_user', JSON.stringify(newUser));
      localStorage.setItem('flex_online_authenticated', 'true');
    } catch (e) {}

    sendWsMessage('user:register', { ...data, id: newUser.id, username: cleanUsername, avatar: avatarUrl });

    // Also send HTTP fallback
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, id: newUser.id, username: cleanUsername, avatar: avatarUrl }),
    }).catch((err) => console.warn('HTTP register fallback failed:', err));
  };

  const loginUser = (identifier: string, pin?: string, recoveryKey?: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      const query = (identifier || '').trim().toLowerCase();
      const cleanPhone = query.replace(/[\s\-\.\+]/g, '');

      const localFound = users.find((u) => {
        const uName = u.username.toLowerCase();
        const uFullName = u.name.toLowerCase();
        const uPhone = (u.phone || '').replace(/[\s\-\.\+]/g, '');
        const uEmail = (u.email || '').toLowerCase();
        const uId = u.id.toLowerCase();
        return uName === query || uFullName === query || (cleanPhone && uPhone && uPhone.includes(cleanPhone)) || (uEmail && uEmail === query) || uId === query;
      });

      if (localFound) {
        const pinValid = !localFound.securityPin || localFound.securityPin === pin;
        const recValid = Boolean(recoveryKey && localFound.recoveryKey && localFound.recoveryKey.trim().toUpperCase() === recoveryKey.trim().toUpperCase());

        if (pin && !pinValid && !recValid) {
          resolve({ success: false, error: 'Code PIN de sécurité incorrect.' });
          return;
        }

        setCurrentUser(localFound);
        setIsAuthenticated(true);
        try {
          localStorage.setItem('flex_online_current_user', JSON.stringify(localFound));
          localStorage.setItem('flex_online_authenticated', 'true');
        } catch (e) {}
      }

      loginResolversRef.current.push(resolve);
      sendWsMessage('user:login', { identifier, pin, recoveryKey });

      setTimeout(() => {
        const idx = loginResolversRef.current.indexOf(resolve);
        if (idx !== -1) {
          loginResolversRef.current.splice(idx, 1);
          if (localFound) {
            resolve({ success: true });
          } else {
            resolve({ success: false, error: 'Délai d\'attente dépassé ou utilisateur non trouvé.' });
          }
        }
      }, 3500);
    });
  };

  const updateSecurityPin = (newPin: string) => {
    const updated = { ...currentUser, securityPin: newPin };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => u.id === currentUser.id ? updated : u));
    try {
      localStorage.setItem('flex_online_current_user', JSON.stringify(updated));
    } catch (e) {}
    sendWsMessage('user:update_security', { userId: currentUser.id, securityPin: newPin });
  };

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId) || null;
  const conversationMessages = messages.filter((m) => m.conversationId === selectedConversationId);

  useEffect(() => {
    if (selectedConversationId && currentUser) {
      markConversationAsRead(selectedConversationId);
    }
  }, [selectedConversationId, currentUser.id]);

  const markConversationAsRead = (conversationId: string) => {
    sendWsMessage('chat:mark_read', { conversationId, userId: currentUser.id });
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, unreadCount: { ...c.unreadCount, [currentUser.id]: 0 } }
          : c
      )
    );
    setMessages((prev) =>
      prev.map((m) =>
        m.conversationId === conversationId && m.senderId !== currentUser.id
          ? { ...m, status: 'read' }
          : m
      )
    );
  };

  const sendMessage = ({
    conversationId,
    content,
    type = 'text',
    mediaUrl,
    voiceDuration,
    replyToId,
  }: {
    conversationId: string;
    content: string;
    type?: MessageType;
    mediaUrl?: string;
    voiceDuration?: number;
    replyToId?: string;
  }) => {
    // Bouclier de Modération Automatique de Pudeur et Respect
    if (type === 'text' && content) {
      const check = checkContentModeration(content);
      if (check.isBlocked) {
        console.warn('Bouclier Flex : message neutralisé automatiquement -', check.reasonTitle);
        return;
      }
    }

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const payload = {
      id: messageId,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content,
      type,
      mediaUrl,
      voiceDuration,
      replyToId,
      timestamp: nowIso,
    };

    const optimisticMsg: Message = {
      ...payload,
      status: 'sent',
      reactions: [],
    };

    setMessages((prev) => {
      if (prev.some((m) => m.id === messageId)) return prev;
      return [...prev, optimisticMsg];
    });

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: optimisticMsg, updatedAt: optimisticMsg.timestamp }
          : c
      )
    );

    sendWsMessage('chat:send_message', payload);

    // Reliable HTTP fallback so messages always reach the server even when WebSocket is closed
    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Ignored silently in offline / static hosting mode
    });

    // Auto mark as delivered after brief network transit
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId && m.status === 'sent'
            ? { ...m, status: 'delivered' }
            : m
        )
      );
    }, 450);

    // Fallback simulation when WebSocket is disconnected (e.g. testing directly on static hosts)
    if (!wsConnected) {
      setTimeout(() => {
        const conv = conversations.find((c) => c.id === conversationId);
        if (!conv) return;
        const otherParticipantId = conv.participants.find((p) => p !== currentUser.id);
        const otherUser = users.find((u) => u.id === otherParticipantId);
        if (!otherUser) return;

        const friendlyReplies = [
          'Bien reçu ! Tout fonctionne parfaitement sur Flex.',
          'Super ! Je viens de voir ton message.',
          'Parfait, la mise à jour est top !',
          'Merci beaucoup Franck !',
        ];
        const replyText = friendlyReplies[Math.floor(Math.random() * friendlyReplies.length)];
        const replyMsgId = `reply-${Date.now()}`;
        const autoReply: Message = {
          id: replyMsgId,
          conversationId,
          senderId: otherUser.id,
          senderName: otherUser.name,
          senderAvatar: otherUser.avatar,
          content: replyText,
          type: 'text',
          timestamp: new Date().toISOString(),
          status: 'delivered',
          reactions: [],
        };

        setMessages((prev) => [...prev, autoReply]);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: autoReply,
                  updatedAt: autoReply.timestamp,
                  unreadCount: {
                    ...(c.unreadCount || {}),
                    [currentUser.id]: ((c.unreadCount && c.unreadCount[currentUser.id]) || 0) + 1,
                  },
                }
              : c
          )
        );
        playNotificationSound();
      }, 2500);
    }
  };

  const toggleMessageReaction = (messageId: string, emoji: string) => {
    sendWsMessage('chat:toggle_reaction', {
      messageId,
      emoji,
      userId: currentUser.id,
      userName: currentUser.name,
    });

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const exists = m.reactions.find(
          (r) => r.userId === currentUser.id && r.emoji === emoji
        );
        let updatedReactions;
        if (exists) {
          updatedReactions = m.reactions.filter(
            (r) => !(r.userId === currentUser.id && r.emoji === emoji)
          );
        } else {
          updatedReactions = [
            ...m.reactions,
            { emoji, userId: currentUser.id, userName: currentUser.name },
          ];
        }
        return { ...m, reactions: updatedReactions };
      })
    );
  };

  const sendTypingStatus = (conversationId: string, isTyping: boolean) => {
    sendWsMessage('chat:typing', {
      conversationId,
      userId: currentUser.id,
      userName: currentUser.name,
      isTyping,
    });
  };

  const createPost = ({
    content,
    mediaUrl,
    mediaType = 'image',
    privacy = 'public',
  }: {
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    privacy?: 'public' | 'friends';
  }) => {
    // Bouclier de Modération Automatique
    if (content) {
      const check = checkContentModeration(content);
      if (check.isBlocked) {
        console.warn('Bouclier Flex : publication neutralisée -', check.reasonTitle);
        return;
      }
    }

    const payload = {
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorVerified: currentUser.verified,
      content,
      mediaUrl,
      mediaType,
      privacy,
    };

    const optimisticPost: Post = {
      id: `opt-post-${Date.now()}`,
      ...payload,
      timestamp: new Date().toISOString(),
      reactions: [],
      comments: [],
      sharesCount: 0,
    };
    setPosts((prev) => [optimisticPost, ...prev]);

    sendWsMessage('feed:create_post', payload);
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    sendWsMessage('feed:delete_post', { postId, userId: currentUser.id });
  };

  const sharePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, sharesCount: p.sharesCount + 1 } : p))
    );
    sendWsMessage('feed:share_post', { postId, userId: currentUser.id });
  };

  const togglePostReaction = (postId: string, reactionType: PostReactionType) => {
    sendWsMessage('feed:toggle_reaction', {
      postId,
      type: reactionType,
      userId: currentUser.id,
      userName: currentUser.name,
    });

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const existingIdx = p.reactions.findIndex((r) => r.userId === currentUser.id);
        let updatedReactions = [...p.reactions];
        if (existingIdx >= 0) {
          if (updatedReactions[existingIdx].type === reactionType) {
            updatedReactions.splice(existingIdx, 1);
          } else {
            updatedReactions[existingIdx].type = reactionType;
          }
        } else {
          updatedReactions.push({
            type: reactionType,
            userId: currentUser.id,
            userName: currentUser.name,
          });
        }
        return { ...p, reactions: updatedReactions };
      })
    );
  };

  const addPostComment = (postId: string, content: string) => {
    const payload = {
      postId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content,
    };

    const optimisticComment = {
      id: `opt-c-${Date.now()}`,
      ...payload,
      timestamp: new Date().toISOString(),
      likes: [],
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, optimisticComment] } : p
      )
    );

    sendWsMessage('feed:add_comment', payload);
  };

  const likePostComment = (postId: string, commentId: string) => {
    sendWsMessage('feed:like_comment', {
      postId,
      commentId,
      userId: currentUser.id,
    });

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: p.comments.map((c) => {
            if (c.id !== commentId) return c;
            const hasLiked = c.likes.includes(currentUser.id);
            return {
              ...c,
              likes: hasLiked
                ? c.likes.filter((id) => id !== currentUser.id)
                : [...c.likes, currentUser.id],
            };
          }),
        };
      })
    );
  };

  const deletePostComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: p.comments.filter((c) => c.id !== commentId),
        };
      })
    );
    sendWsMessage('feed:delete_comment', {
      postId,
      commentId,
      userId: currentUser.id,
    });
  };

  const createStory = (mediaUrl: string, caption?: string) => {
    const payload = {
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      mediaUrl,
      caption,
    };

    const optimisticStory: Story = {
      id: `opt-story-${Date.now()}`,
      ...payload,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      viewed: false,
    };
    setStories((prev) => [optimisticStory, ...prev]);

    sendWsMessage('story:create', payload);
  };

  const startCall = (contact: User, type: 'audio' | 'video') => {
    const callSession: CallSession = {
      id: `call-${Date.now()}`,
      caller: currentUser,
      recipient: contact,
      type,
      status: 'ringing',
      startedAt: new Date().toISOString(),
    };
    setActiveCall(callSession);

    setCallLogs((prev) => [
      {
        id: `cl-${Date.now()}`,
        contact,
        type,
        direction: 'outgoing',
        timestamp: 'À l’instant',
      },
      ...prev,
    ]);

    sendWsMessage('call:signal', {
      id: callSession.id,
      caller: currentUser,
      recipientId: contact.id,
      type,
      status: 'ringing',
    });
  };

  const endCall = () => {
    if (activeCall) {
      const otherUserId = activeCall.caller.id === currentUser.id ? activeCall.recipient.id : activeCall.caller.id;
      sendWsMessage('call:signal', {
        id: activeCall.id,
        recipientId: otherUserId,
        status: 'ended',
      });
    }
    setActiveCall(null);
  };

  const answerCall = () => {
    if (activeCall) {
      setActiveCall((prev) => (prev ? { ...prev, status: 'connected' } : null));
      const otherUserId = activeCall.caller.id === currentUser.id ? activeCall.recipient.id : activeCall.caller.id;
      sendWsMessage('call:signal', {
        id: activeCall.id,
        recipientId: otherUserId,
        status: 'connected',
      });
    }
  };

  const switchCurrentUser = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('flex_online_current_user', JSON.stringify(user));
    } catch (e) {}
  };

  const createNewConversation = (targetUserId: string): string => {
    const existing = conversations.find(
      (c) => c.type === 'direct' && c.participants.includes(targetUserId) && c.participants.includes(currentUser.id)
    );
    if (existing) {
      setSelectedConversationId(existing.id);
      setActiveTab('chats');
      return existing.id;
    }

    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      type: 'direct',
      participants: [currentUser.id, targetUserId],
      unreadCount: {},
      updatedAt: new Date().toISOString(),
    };

    setConversations((prev) => [newConv, ...prev]);
    setSelectedConversationId(newId);
    setActiveTab('chats');
    return newId;
  };

  const createNewGroup = (name: string, participantIds: string[], avatar?: string): string => {
    const newId = `group-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      type: 'group',
      name,
      avatar: avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
      participants: [currentUser.id, ...participantIds],
      unreadCount: {},
      updatedAt: new Date().toISOString(),
      description: `Groupe créé par ${currentUser.name}`,
    };

    setConversations((prev) => [newConv, ...prev]);
    setSelectedConversationId(newId);
    setActiveTab('chats');
    return newId;
  };

  // Phone Contacts Synchronization & Management
  const importPhoneContacts = async (rawContacts: { name: string; tel: string; email?: string }[]): Promise<number> => {
    let addedCount = 0;
    setPhoneContacts((prev) => {
      const existingTels = new Set(prev.map((c) => c.tel.replace(/[\s\-\.\+]/g, '')));
      const newItems: PhoneContact[] = [];

      for (const item of rawContacts) {
        if (!item.name || !item.tel) continue;
        const cleanTel = item.tel.replace(/[\s\-\.\+]/g, '');
        if (existingTels.has(cleanTel)) continue;

        // Check if matches a registered user in Flex Online
        const matched = users.find((u) => {
          if (!u.phone) return false;
          const uClean = u.phone.replace(/[\s\-\.\+]/g, '');
          return cleanTel.slice(-8) === uClean.slice(-8) || u.name.toLowerCase() === item.name.toLowerCase();
        });

        newItems.push({
          id: `phone-contact-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: item.name.trim(),
          tel: item.tel.trim(),
          email: item.email?.trim(),
          avatar: matched?.avatar,
          isRegisteredUser: Boolean(matched),
          matchedUserId: matched?.id,
          dateSynced: new Date().toISOString(),
        });
        existingTels.add(cleanTel);
        addedCount++;
      }

      const merged = [...newItems, ...prev];
      try {
        localStorage.setItem('flex_online_phone_contacts', JSON.stringify(merged));
      } catch (e) {}
      return merged;
    });

    return addedCount;
  };

  const addSinglePhoneContact = (contact: { name: string; tel: string; email?: string }) => {
    if (!contact.name || !contact.tel) return;
    const cleanTel = contact.tel.replace(/[\s\-\.\+]/g, '');
    const matched = users.find((u) => {
      if (!u.phone) return false;
      const uClean = u.phone.replace(/[\s\-\.\+]/g, '');
      return cleanTel.slice(-8) === uClean.slice(-8) || u.name.toLowerCase() === contact.name.toLowerCase();
    });

    const newContact: PhoneContact = {
      id: `phone-contact-${Date.now()}`,
      name: contact.name.trim(),
      tel: contact.tel.trim(),
      email: contact.email?.trim(),
      avatar: matched?.avatar,
      isRegisteredUser: Boolean(matched),
      matchedUserId: matched?.id,
      dateSynced: new Date().toISOString(),
    };

    setPhoneContacts((prev) => {
      const filtered = prev.filter((c) => c.tel.replace(/[\s\-\.\+]/g, '') !== cleanTel);
      const updated = [newContact, ...filtered];
      try {
        localStorage.setItem('flex_online_phone_contacts', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const removePhoneContact = (contactId: string) => {
    setPhoneContacts((prev) => {
      const updated = prev.filter((c) => c.id !== contactId);
      try {
        localStorage.setItem('flex_online_phone_contacts', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const startChatWithPhoneContact = (contact: PhoneContact): string => {
    // If contact is registered in Flex Online, open direct conversation
    if (contact.isRegisteredUser && contact.matchedUserId) {
      return createNewConversation(contact.matchedUserId);
    }

    // Otherwise create or invite an on-the-fly local user profile for this phone contact
    const virtualUserId = `user-phone-${contact.id}`;
    let registeredUser = users.find((u) => u.id === virtualUserId || (contact.tel && u.phone === contact.tel));
    
    if (!registeredUser) {
      const newUser: User = {
        id: virtualUserId,
        name: contact.name,
        username: contact.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        avatar: contact.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${contact.name}`,
        phone: contact.tel,
        bio: `Contact de mon téléphone synchronisé (${contact.tel})`,
        status: 'offline',
        lastSeen: 'Contact téléphonique',
      };
      setUsers((prev) => [...prev, newUser]);
      registeredUser = newUser;
    }

    // Update phone contact state to mark as registered/linked
    setPhoneContacts((prev) =>
      prev.map((c) =>
        c.id === contact.id
          ? { ...c, isRegisteredUser: true, matchedUserId: registeredUser!.id }
          : c
      )
    );

    return createNewConversation(registeredUser.id);
  };

  // Verification Code, Phone SIM and Account Recovery
  const requestVerificationCode = async (target: string, type: 'phone' | 'email' = 'phone'): Promise<{ success: boolean; code?: string; message?: string }> => {
    return new Promise((resolve) => {
      otpRequestResolversRef.current.push(resolve);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'auth:request_code',
          data: { target, type }
        }));
      } else {
        const simCode = Math.floor(100000 + Math.random() * 900000).toString();
        setIncomingOtpCode({
          code: simCode,
          target,
          message: `[FLEX ONLINE] Code SIM de sécurité : ${simCode}`
        });
        resolve({ success: true, code: simCode });
      }
    });
  };

  const verifyCodeAndLogin = async (target: string, code: string, pin?: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    return new Promise((resolve) => {
      verificationResolversRef.current.push(resolve);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'auth:verify_code',
          data: { target, code, pin }
        }));
      } else {
        resolve({ success: true, user: currentUser });
      }
    });
  };

  const recoverAccount = async (identifier: string, codeOrKey: string, newPin?: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    return new Promise((resolve) => {
      recoveryResolversRef.current.push(resolve);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'auth:recover_account',
          data: { identifier, recoveryKeyOrCode: codeOrKey, newPin }
        }));
      } else {
        resolve({ success: true, user: currentUser });
      }
    });
  };

  const updateUserProfile = (data: Partial<User>) => {
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => u.id === updated.id ? updated : u));
    try {
      localStorage.setItem('flex_online_current_user', JSON.stringify(updated));
    } catch {}

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'user:update_profile',
        data: { userId: currentUser.id, ...data }
      }));
    }
  };

  const pairDevice = (name: string, type: 'pc' | 'mobile', os: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'device:pair',
        data: { userId: currentUser.id, device: { name, type, os } }
      }));
    }
  };

  const revokeDevice = (deviceId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'device:revoke',
        data: { userId: currentUser.id, deviceId }
      }));
    }
  };

  const validateContent = (text: string): ModerationResult => {
    return checkContentModeration(text);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        setIsAuthenticated,
        logoutUser,
        users,
        activeTab,
        setActiveTab,
        conversations,
        selectedConversationId,
        setSelectedConversationId,
        selectedConversation,
        messages,
        conversationMessages,
        posts,
        stories,
        callLogs,
        activeCall,
        wsConnected,
        typingMap,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isSecurityModalOpen,
        setIsSecurityModalOpen,
        isContactsSyncModalOpen,
        setIsContactsSyncModalOpen,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isLinkedDevicesModalOpen,
        setIsLinkedDevicesModalOpen,
        isProfilePhotoModalOpen,
        profilePhotoModalUser,
        openProfilePhotoModal,
        closeProfilePhotoModal,
        fontSize,
        setFontSize,
        secondaryUser,
        savedAccounts,
        switchAccount,
        addSecondaryAccount,
        removeLinkedAccount,
        incomingOtpCode,
        clearIncomingOtpCode,
        requestVerificationCode,
        verifyCodeAndLogin,
        recoverAccount,
        updateUserProfile,
        pairDevice,
        revokeDevice,
        phoneContacts,
        importPhoneContacts,
        addSinglePhoneContact,
        removePhoneContact,
        startChatWithPhoneContact,
        pinnedConversationIds,
        mutedConversationIds,
        blockedUserIds,
        togglePinConversation,
        toggleMuteConversation,
        blockUser,
        unblockUser,
        reportUser,
        deleteConversation,
        deleteMultipleConversations,
        clearAllChatHistory,
        deleteAccount,
        registerUser,
        loginUser,
        updateSecurityPin,
        sendMessage,
        toggleMessageReaction,
        markConversationAsRead,
        sendTypingStatus,
        createPost,
        deletePost,
        sharePost,
        togglePostReaction,
        addPostComment,
        deletePostComment,
        likePostComment,
        createStory,
        startCall,
        answerCall,
        endCall,
        switchCurrentUser,
        createNewConversation,
        createNewGroup,
        validateContent,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        chatWallpaper,
        setChatWallpaper,
        uploadCustomWallpaper,
        resetChatWallpaper,
        playNotificationSound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
