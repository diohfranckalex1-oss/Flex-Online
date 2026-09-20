import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { 
  AVAILABLE_USERS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_MESSAGES, 
  INITIAL_POSTS, 
  INITIAL_STORIES, 
  INITIAL_CALL_LOGS 
} from './src/data/initialData';
import { User, Message, Post, Story, PostComment, MessageReaction, PostReaction, Conversation, CallLog } from './src/types';

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'data', 'flex_db.json');

// Ensure data folder exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

interface ServerState {
  users: User[];
  conversations: Conversation[];
  messages: Message[];
  posts: Post[];
  stories: Story[];
  callLogs: CallLog[];
}

// Authoritative Server State loader
function loadInitialState(): ServerState {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const loaded = JSON.parse(content);
      return {
        users: loaded.users || [...AVAILABLE_USERS],
        conversations: loaded.conversations || [...INITIAL_CONVERSATIONS],
        messages: loaded.messages || [...INITIAL_MESSAGES],
        posts: loaded.posts || [...INITIAL_POSTS],
        stories: loaded.stories || [...INITIAL_STORIES],
        callLogs: loaded.callLogs || [...INITIAL_CALL_LOGS],
      };
    } catch (e) {
      console.warn('Error reading flex_db.json, using defaults:', e);
    }
  }
  return {
    users: [...AVAILABLE_USERS],
    conversations: [...INITIAL_CONVERSATIONS],
    messages: [...INITIAL_MESSAGES],
    posts: [...INITIAL_POSTS],
    stories: [...INITIAL_STORIES],
    callLogs: [...INITIAL_CALL_LOGS],
  };
}

const state: ServerState = loadInitialState();

let saveTimeout: any = null;
function persistState() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write flex_db.json:', err);
    }
  }, 300);
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '30mb' }));

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws' });

  // Broadcast helper
  function broadcast(data: object, senderWs?: WebSocket) {
    const payload = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client !== senderWs && client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  function broadcastAll(data: object) {
    const payload = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  // WebSocket connection handler
  wss.on('connection', (ws: WebSocket) => {
    // Send full authoritative state to newly connected client
    ws.send(JSON.stringify({
      type: 'init',
      data: state,
    }));

    ws.on('message', (rawMessage: string) => {
      try {
        const parsed = JSON.parse(rawMessage.toString());
        const { type, data } = parsed;

        switch (type) {
          case 'user:register': {
            const { name, username, avatar, bio, phone, securityPin } = data;
            const cleanUsername = (username || name.toLowerCase().replace(/\s+/g, '_')).trim();
            const existingUser = state.users.find((u) => u.username.toLowerCase() === cleanUsername.toLowerCase());
            
            let userToUse: User;
            if (existingUser) {
              if (securityPin) existingUser.securityPin = securityPin;
              if (phone) existingUser.phone = phone;
              if (!existingUser.recoveryKey) {
                existingUser.recoveryKey = `FLEX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
              }
              userToUse = existingUser;
              persistState();
            } else {
              const generatedRecoveryKey = `FLEX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
              userToUse = {
                id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                name: name.trim(),
                username: cleanUsername,
                avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
                bio: bio?.trim() || 'Nouveau membre sur Flex Online ! 👋',
                phone: phone?.trim() || '+33 6 00 00 00 00',
                status: 'online',
                verified: false,
                securityPin: securityPin || '1234',
                recoveryKey: generatedRecoveryKey,
                createdAt: new Date().toISOString(),
              };
              state.users.push(userToUse);

              // Auto-join the main public community group
              const communityGroup = state.conversations.find((c) => c.id === 'conv-group-family');
              if (communityGroup && !communityGroup.participants.includes(userToUse.id)) {
                communityGroup.participants.push(userToUse.id);
                communityGroup.name = 'Communauté Flex Online ❤️';
              }

              // Auto-create a welcome direct conversation with Franck Alex
              const welcomeConvId = `conv-${userToUse.id}-franck`;
              const franckUser = state.users.find((u) => u.id === 'user-franck');
              if (franckUser && userToUse.id !== 'user-franck') {
                const welcomeMsg: Message = {
                  id: `msg-welcome-${Date.now()}`,
                  conversationId: welcomeConvId,
                  senderId: 'user-franck',
                  senderName: 'Franck Alex',
                  senderAvatar: franckUser.avatar,
                  content: `Bienvenue sur Flex Online ${userToUse.name.split(' ')[0]} ! 🎉 Je suis Franck, le créateur de l'application. Tu peux causer avec moi directement ici ou échanger avec tout le monde sur le fil et dans les groupes !`,
                  type: 'text',
                  timestamp: new Date().toISOString(),
                  status: 'delivered',
                  reactions: [{ emoji: '👋', userId: 'user-franck', userName: 'Franck Alex' }],
                };

                const newConv: Conversation = {
                  id: welcomeConvId,
                  type: 'direct',
                  participants: ['user-franck', userToUse.id],
                  lastMessage: welcomeMsg,
                  unreadCount: { [userToUse.id]: 1 },
                  updatedAt: welcomeMsg.timestamp,
                  pinned: true,
                };

                state.conversations.unshift(newConv);
                state.messages.push(welcomeMsg);
              }

              persistState();
            }

            // Acknowledge back to sender
            ws.send(JSON.stringify({
              type: 'user:registered_success',
              data: { user: userToUse, state },
            }));

            // Notify everyone of the new user & updated conversations
            broadcastAll({
              type: 'user:directory_updated',
              data: {
                users: state.users,
                conversations: state.conversations,
                newUser: userToUse,
              },
            });
            break;
          }

          case 'user:login': {
            const { identifier, pin, recoveryKey } = data;
            const query = (identifier || '').trim().toLowerCase();
            const cleanQueryPhone = query.replace(/[\s\-\.\+]/g, '');

            const targetUser = state.users.find((u) => {
              const uName = u.username.toLowerCase();
              const uFullName = u.name.toLowerCase();
              const uPhone = (u.phone || '').replace(/[\s\-\.\+]/g, '');
              const uId = u.id.toLowerCase();
              return uName === query || uFullName === query || (cleanQueryPhone && uPhone && uPhone.includes(cleanQueryPhone)) || uId === query;
            });

            if (!targetUser) {
              ws.send(JSON.stringify({
                type: 'user:login_failed',
                data: { error: 'Aucun compte trouvé avec cet identifiant ou numéro de téléphone.' },
              }));
              break;
            }

            // Verify security pin or recovery key
            const isPinValid = !targetUser.securityPin || targetUser.securityPin === pin;
            const isRecoveryValid = Boolean(recoveryKey && targetUser.recoveryKey && targetUser.recoveryKey.trim().toUpperCase() === recoveryKey.trim().toUpperCase());

            if (!isPinValid && !isRecoveryValid) {
              ws.send(JSON.stringify({
                type: 'user:login_failed',
                data: { error: 'Code de sécurité PIN incorrect. Vérifiez vos chiffres ou utilisez votre clé de secours.' },
              }));
              break;
            }

            targetUser.status = 'online';
            persistState();

            ws.send(JSON.stringify({
              type: 'user:login_success',
              data: { user: targetUser, state },
            }));
            break;
          }

          case 'user:update_security': {
            const { userId, securityPin } = data;
            const target = state.users.find((u) => u.id === userId);
            if (target && securityPin) {
              target.securityPin = securityPin;
              persistState();
              ws.send(JSON.stringify({
                type: 'user:security_updated',
                data: { user: target, message: 'Code de sécurité mis à jour avec succès !' },
              }));
            }
            break;
          }

          case 'chat:send_message': {
            const newMsg: Message = {
              id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
              conversationId: data.conversationId,
              senderId: data.senderId,
              senderName: data.senderName,
              senderAvatar: data.senderAvatar,
              content: data.content,
              type: data.type || 'text',
              mediaUrl: data.mediaUrl,
              voiceDuration: data.voiceDuration,
              timestamp: new Date().toISOString(),
              status: 'sent',
              reactions: [],
              replyToId: data.replyToId,
            };

            state.messages.push(newMsg);

            // Update conversation lastMessage & updatedAt
            const conv = state.conversations.find((c) => c.id === data.conversationId);
            if (conv) {
              conv.lastMessage = newMsg;
              conv.updatedAt = newMsg.timestamp;
              conv.participants.forEach((pId) => {
                if (pId !== data.senderId) {
                  conv.unreadCount[pId] = (conv.unreadCount[pId] || 0) + 1;
                }
              });
            }

            persistState();

            broadcastAll({
              type: 'chat:message_received',
              data: {
                message: newMsg,
                conversation: conv,
              },
            });
            break;
          }

          case 'chat:toggle_reaction': {
            const { messageId, emoji, userId, userName } = data;
            const msg = state.messages.find((m) => m.id === messageId);
            if (msg) {
              const existingIdx = msg.reactions.findIndex(
                (r) => r.userId === userId && r.emoji === emoji
              );
              if (existingIdx >= 0) {
                msg.reactions.splice(existingIdx, 1);
              } else {
                msg.reactions.push({ emoji, userId, userName });
              }
              persistState();
              broadcastAll({
                type: 'chat:reaction_updated',
                data: { messageId, reactions: msg.reactions },
              });
            }
            break;
          }

          case 'chat:mark_read': {
            const { conversationId, userId } = data;
            const conv = state.conversations.find((c) => c.id === conversationId);
            if (conv) {
              conv.unreadCount[userId] = 0;
            }
            state.messages.forEach((m) => {
              if (m.conversationId === conversationId && m.senderId !== userId) {
                m.status = 'read';
              }
            });
            persistState();
            broadcastAll({
              type: 'chat:read_status',
              data: { conversationId, userId },
            });
            break;
          }

          case 'chat:typing': {
            broadcast({
              type: 'chat:user_typing',
              data,
            }, ws);
            break;
          }

          case 'feed:create_post': {
            const newPost: Post = {
              id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
              authorId: data.authorId,
              authorName: data.authorName,
              authorAvatar: data.authorAvatar,
              authorVerified: data.authorVerified || false,
              content: data.content,
              mediaUrl: data.mediaUrl,
              mediaType: data.mediaType || 'image',
              timestamp: new Date().toISOString(),
              reactions: [],
              comments: [],
              sharesCount: 0,
              privacy: data.privacy || 'public',
            };
            state.posts.unshift(newPost);
            persistState();
            broadcastAll({
              type: 'feed:post_created',
              data: newPost,
            });
            break;
          }

          case 'feed:toggle_reaction': {
            const { postId, type: reactionType, userId, userName } = data;
            const post = state.posts.find((p) => p.id === postId);
            if (post) {
              const existingIdx = post.reactions.findIndex((r) => r.userId === userId);
              if (existingIdx >= 0) {
                if (post.reactions[existingIdx].type === reactionType) {
                  post.reactions.splice(existingIdx, 1);
                } else {
                  post.reactions[existingIdx].type = reactionType;
                }
              } else {
                post.reactions.push({ type: reactionType, userId, userName });
              }
              persistState();
              broadcastAll({
                type: 'feed:post_reaction_updated',
                data: { postId, reactions: post.reactions },
              });
            }
            break;
          }

          case 'feed:add_comment': {
            const { postId, authorId, authorName, authorAvatar, content } = data;
            const post = state.posts.find((p) => p.id === postId);
            if (post) {
              const newComment: PostComment = {
                id: `comment-${Date.now()}`,
                postId,
                authorId,
                authorName,
                authorAvatar,
                content,
                timestamp: new Date().toISOString(),
                likes: [],
              };
              post.comments.push(newComment);
              persistState();
              broadcastAll({
                type: 'feed:comment_added',
                data: { postId, comment: newComment },
              });
            }
            break;
          }

          case 'feed:like_comment': {
            const { postId, commentId, userId } = data;
            const post = state.posts.find((p) => p.id === postId);
            if (post) {
              const comment = post.comments.find((c) => c.id === commentId);
              if (comment) {
                const idx = comment.likes.indexOf(userId);
                if (idx >= 0) {
                  comment.likes.splice(idx, 1);
                } else {
                  comment.likes.push(userId);
                }
                persistState();
                broadcastAll({
                  type: 'feed:comment_liked',
                  data: { postId, commentId, likes: comment.likes },
                });
              }
            }
            break;
          }

          case 'story:create': {
            const newStory: Story = {
              id: `story-${Date.now()}`,
              authorId: data.authorId,
              authorName: data.authorName,
              authorAvatar: data.authorAvatar,
              mediaUrl: data.mediaUrl,
              caption: data.caption,
              timestamp: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
              viewed: false,
            };
            state.stories.unshift(newStory);
            persistState();
            broadcastAll({
              type: 'story:created',
              data: newStory,
            });
            break;
          }

          case 'call:signal': {
            broadcast({
              type: 'call:signaled',
              data,
            }, ws);
            break;
          }

          default:
            break;
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    });
  });

  // REST API Endpoints
  app.get('/api/health', (_req, res) => {
    res.json({ 
      status: 'ok', 
      app: 'Flex Online', 
      usersCount: state.users.length,
      messagesCount: state.messages.length,
      timestamp: new Date().toISOString() 
    });
  });

  app.get('/api/state', (_req, res) => {
    res.json(state);
  });

  // Export full backup for changing phones / offline preservation
  app.get('/api/backup/export', (req, res) => {
    const userId = req.query.userId as string;
    const backupData = {
      exportDate: new Date().toISOString(),
      app: 'Flex Online',
      version: '1.0.0',
      user: userId ? state.users.find((u) => u.id === userId) : null,
      users: state.users.map(({ securityPin, ...rest }) => rest), // sanitized users list
      conversations: userId ? state.conversations.filter((c) => c.participants.includes(userId)) : state.conversations,
      messages: userId ? state.messages.filter((m) => {
        const userConvIds = state.conversations
          .filter((c) => c.participants.includes(userId))
          .map((c) => c.id);
        return userConvIds.includes(m.conversationId);
      }) : state.messages,
      posts: state.posts,
      stories: state.stories,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="flex_online_backup_${Date.now()}.json"`);
    res.json(backupData);
  });

  // Restore backup data
  app.post('/api/backup/restore', (req, res) => {
    try {
      const data = req.body;
      if (!data || !data.app) {
        return res.status(400).json({ error: 'Fichier de sauvegarde Flex Online invalide.' });
      }

      if (Array.isArray(data.messages)) {
        data.messages.forEach((msg: Message) => {
          if (!state.messages.some((m) => m.id === msg.id)) {
            state.messages.push(msg);
          }
        });
      }

      if (Array.isArray(data.conversations)) {
        data.conversations.forEach((conv: Conversation) => {
          if (!state.conversations.some((c) => c.id === conv.id)) {
            state.conversations.push(conv);
          }
        });
      }

      persistState();
      broadcastAll({
        type: 'init',
        data: state,
      });

      res.json({ success: true, message: 'Sauvegarde restaurée avec succès !' });
    } catch (e: any) {
      res.status(500).json({ error: 'Erreur lors de la restauration: ' + e.message });
    }
  });

  app.post('/api/register', (req, res) => {
    const { name, username, avatar, bio, phone } = req.body;
    if (!name) return res.status(400).json({ error: 'Le nom est obligatoire' });
    const cleanUsername = (username || name.toLowerCase().replace(/\s+/g, '_')).trim();
    
    let user = state.users.find((u) => u.username.toLowerCase() === cleanUsername.toLowerCase());
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        username: cleanUsername,
        avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
        bio: bio || 'Membre Flex Online 🚀',
        phone: phone || '',
        status: 'online',
        verified: false,
      };
      state.users.push(user);
      persistState();
      broadcastAll({
        type: 'user:directory_updated',
        data: { users: state.users, newUser: user },
      });
    }
    res.json({ success: true, user });
  });

  app.post('/api/message', (req, res) => {
    const data = req.body;
    const newMsg: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      conversationId: data.conversationId,
      senderId: data.senderId,
      senderName: data.senderName,
      senderAvatar: data.senderAvatar,
      content: data.content,
      type: data.type || 'text',
      mediaUrl: data.mediaUrl,
      voiceDuration: data.voiceDuration,
      timestamp: new Date().toISOString(),
      status: 'sent',
      reactions: [],
      replyToId: data.replyToId,
    };
    state.messages.push(newMsg);
    const conv = state.conversations.find((c) => c.id === data.conversationId);
    if (conv) {
      conv.lastMessage = newMsg;
      conv.updatedAt = newMsg.timestamp;
    }
    persistState();
    broadcastAll({
      type: 'chat:message_received',
      data: { message: newMsg, conversation: conv },
    });
    res.json({ success: true, message: newMsg });
  });

  // Vite middleware / static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Flex Online Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
