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
  PostReactionType 
} from '../types';
import { 
  AVAILABLE_USERS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_MESSAGES, 
  INITIAL_POSTS, 
  INITIAL_STORIES, 
  INITIAL_CALL_LOGS 
} from '../data/initialData';

interface AppContextType {
  currentUser: User;
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
  // Actions
  registerUser: (data: {
    name: string;
    username?: string;
    avatar: string;
    bio?: string;
    phone?: string;
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
  togglePostReaction: (postId: string, reactionType: PostReactionType) => void;
  addPostComment: (postId: string, content: string) => void;
  likePostComment: (postId: string, commentId: string) => void;
  createStory: (mediaUrl: string, caption?: string) => void;
  startCall: (contact: User, type: 'audio' | 'video') => void;
  endCall: () => void;
  switchCurrentUser: (user: User) => void;
  createNewConversation: (targetUserId: string) => string;
  createNewGroup: (name: string, participantIds: string[], avatar?: string) => string;
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

  const [currentUser, setCurrentUser] = useState<User>(getInitialUser);
  const [users, setUsers] = useState<User[]>(AVAILABLE_USERS);
  const [activeTab, setActiveTab] = useState<'chats' | 'feed' | 'stories' | 'calls'>('chats');
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(INITIAL_CONVERSATIONS[0].id);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [callLogs, setCallLogs] = useState<CallLog[]>(INITIAL_CALL_LOGS);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [typingMap, setTypingMap] = useState<Record<string, string[]>>({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);
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
      };

      ws.onclose = () => {
        setWsConnected(false);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
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

            case 'chat:message_received': {
              const { message, conversation } = data;
              setMessages((prev) => {
                if (prev.some((m) => m.id === message.id)) return prev;
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
    username?: string;
    avatar: string;
    bio?: string;
    phone?: string;
    securityPin?: string;
  }) => {
    const cleanUsername = (data.username || data.name.toLowerCase().replace(/\s+/g, '_')).trim();
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      username: cleanUsername,
      avatar: data.avatar,
      bio: data.bio || 'Nouveau membre sur Flex Online ! 👋',
      phone: data.phone || '+33 6 00 00 00 00',
      status: 'online',
      verified: false,
      securityPin: data.securityPin || '1234',
      recoveryKey: `FLEX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(newUser);
    try {
      localStorage.setItem('flex_online_current_user', JSON.stringify(newUser));
    } catch (e) {}

    sendWsMessage('user:register', data);

    // Also send HTTP fallback
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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
        const uId = u.id.toLowerCase();
        return uName === query || uFullName === query || (cleanPhone && uPhone && uPhone.includes(cleanPhone)) || uId === query;
      });

      if (localFound) {
        const pinValid = !localFound.securityPin || localFound.securityPin === pin;
        const recValid = Boolean(recoveryKey && localFound.recoveryKey && localFound.recoveryKey.trim().toUpperCase() === recoveryKey.trim().toUpperCase());

        if (pin && !pinValid && !recValid) {
          resolve({ success: false, error: 'Code PIN de sécurité incorrect.' });
          return;
        }

        setCurrentUser(localFound);
        try {
          localStorage.setItem('flex_online_current_user', JSON.stringify(localFound));
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
    const payload = {
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content,
      type,
      mediaUrl,
      voiceDuration,
      replyToId,
    };

    const optimisticMsg: Message = {
      id: `opt-${Date.now()}`,
      ...payload,
      timestamp: new Date().toISOString(),
      status: 'sent',
      reactions: [],
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: optimisticMsg, updatedAt: optimisticMsg.timestamp }
          : c
      )
    );

    sendWsMessage('chat:send_message', payload);
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
      sendWsMessage('call:signal', {
        id: activeCall.id,
        recipientId: activeCall.recipient.id,
        status: 'ended',
      });
    }
    setActiveCall(null);
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

  return (
    <AppContext.Provider
      value={{
        currentUser,
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
        registerUser,
        loginUser,
        updateSecurityPin,
        sendMessage,
        toggleMessageReaction,
        markConversationAsRead,
        sendTypingStatus,
        createPost,
        togglePostReaction,
        addPostComment,
        likePostComment,
        createStory,
        startCall,
        endCall,
        switchCurrentUser,
        createNewConversation,
        createNewGroup,
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
