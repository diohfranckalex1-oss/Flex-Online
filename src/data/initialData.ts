import { User, Conversation, Message, Post, Story, CallLog } from '../types';

export const CURRENT_USER: User = {
  id: 'user-franck',
  name: 'Franck Alex',
  username: 'franckalex',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  bio: 'Créateur & Innovateur numérique sur Flex Online 🚀',
  phone: '+33 6 12 34 56 78',
  email: 'diohfranckalex1@gmail.com',
  status: 'online',
  verified: true,
  securityPin: '1234',
  recoveryKey: 'FLEX-ALEX-9901',
  linkedDevices: [
    {
      id: 'dev-pc-windows',
      name: 'Windows PC (Chrome)',
      type: 'pc',
      os: 'Windows 11 Pro',
      browser: 'Chrome 128',
      lastActive: 'Actif maintenant',
      ip: '192.168.1.42',
      status: 'active'
    },
    {
      id: 'dev-phone-main',
      name: 'Téléphone Mobile (Puce SIM active)',
      type: 'mobile',
      os: 'Android 15',
      browser: 'Flex PWA Mobile',
      lastActive: 'Actif maintenant',
      ip: '10.0.0.8',
      status: 'active'
    }
  ],
  fontSizePreference: 'large',
  createdAt: new Date().toISOString(),
};

export const FLEX_SUPPORT: User = {
  id: 'user-flex-support',
  name: 'Assistance Flex Officielle',
  username: 'flex_support',
  avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  bio: 'Centre de sécurité, vérification puce SIM et récupération de compte 24/7 🛡️',
  phone: '+33 8 00 00 35 39',
  email: 'support@flexonline.network',
  status: 'online',
  lastSeen: 'Toujours en ligne',
  verified: true,
  createdAt: new Date().toISOString(),
};

export const FLEX_AI: User = {
  id: 'user-flex-ai',
  name: 'Flex IA Assistant',
  username: 'flex_ai',
  avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  bio: 'Intelligence Artificielle officielle de Flex Online ⚡ Posez-moi toutes vos questions sur la vie, le travail, l\'application ou son créateur Franck Alex !',
  phone: '+33 8 00 77 77 77',
  email: 'ai@flexonline.network',
  status: 'online',
  lastSeen: 'Toujours disponible ⚡',
  verified: true,
  createdAt: new Date().toISOString(),
};

export const AVAILABLE_USERS: User[] = [
  CURRENT_USER,
  FLEX_AI,
  FLEX_SUPPORT,
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-ai-assistant',
    type: 'direct',
    participants: ['user-franck', 'user-flex-ai'],
    unreadCount: { 'user-franck': 0 },
    updatedAt: new Date().toISOString(),
    pinned: true,
  },
  {
    id: 'conv-support',
    type: 'direct',
    participants: ['user-franck', 'user-flex-support'],
    unreadCount: { 'user-franck': 1 },
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    pinned: true,
  },
  {
    id: 'conv-group-community',
    type: 'group',
    name: 'Communauté Flex Online 🌟',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    description: 'Canal officiel des membres vérifiés Flex Online : échangez, partagez vos idées et vos projets en direct.',
    participants: ['user-franck', 'user-flex-support', 'user-flex-ai'],
    unreadCount: { 'user-franck': 0 },
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    pinned: true,
  },
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-welcome-ai-1',
    conversationId: 'conv-ai-assistant',
    senderId: 'user-flex-ai',
    senderName: 'Flex IA Assistant',
    senderAvatar: FLEX_AI.avatar,
    content: `Bonjour ! 👋 Je suis l'Intelligence Artificielle officielle de Flex Online.\n\nPosez-moi n'importe quelle question :\n• 🌟 Sur mon créateur : Franck Alex (sa vision, comment il a créé l'application...)\n• 📱 Sur Flex Online : le chiffrement, les 2 comptes, la synchronisation PC...\n• 💡 Sur tout autre sujet : travail, sciences, études, conseils, rédaction, code, actualités...\n\nComment puis-je vous aider aujourd'hui ?`,
    type: 'text',
    timestamp: new Date().toISOString(),
    status: 'delivered',
    reactions: [{ emoji: '🤖', userId: 'user-flex-ai', userName: 'Flex IA' }],
  },
  {
    id: 'msg-welcome-support-1',
    conversationId: 'conv-support',
    senderId: 'user-flex-support',
    senderName: 'Assistance Flex Officielle',
    senderAvatar: FLEX_SUPPORT.avatar,
    content: `Bienvenue Franck Alex sur votre espace sécurisé Flex Online ! 🛡️✨\n\nVotre compte est protégé par votre puce SIM et votre e-mail (diohfranckalex1@gmail.com). Si vous perdez votre téléphone ou changez d'ordinateur, votre clé d'urgence ${CURRENT_USER.recoveryKey} et la confirmation par SMS vous permettront de restaurer instantanément tous vos messages et contacts.`,
    type: 'text',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'delivered',
    reactions: [{ emoji: '🌟', userId: 'user-franck', userName: 'Franck Alex' }],
  },
  {
    id: 'msg-welcome-support-2',
    conversationId: 'conv-support',
    senderId: 'user-flex-support',
    senderName: 'Assistance Flex Officielle',
    senderAvatar: FLEX_SUPPORT.avatar,
    content: `💡 Astuce multi-écrans : vous pouvez associer votre ordinateur Windows et votre téléphone mobile directement depuis le menu Paramètres > "Appareils Connectés" pour utiliser Flex Online simultanément sur tous vos écrans sans déconnexion !`,
    type: 'text',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    status: 'delivered',
    reactions: [{ emoji: '⚡', userId: 'user-franck', userName: 'Franck Alex' }],
  },
  {
    id: 'msg-comm-1',
    conversationId: 'conv-group-community',
    senderId: 'user-franck',
    senderName: 'Franck Alex',
    senderAvatar: CURRENT_USER.avatar,
    content: 'Bienvenue sur le réseau Flex Online nouvelle génération ! Écritures agrandies, modèle unique violet néon, sécurité par puce SIM et synchronisation totale Windows & Mobile.',
    type: 'text',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'read',
    reactions: [{ emoji: '🔥', userId: 'user-flex-support', userName: 'Assistance Flex Officielle' }],
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    authorId: 'user-franck',
    authorName: 'Franck Alex',
    authorAvatar: CURRENT_USER.avatar,
    authorVerified: true,
    content: 'Fier de vous présenter la toute nouvelle version de Flex Online ! 🌟💜\n\nAdieu le vert classique : place à notre identité propre au violet néon impérial. Écritures agrandies pour un confort parfait sans forcer sur les yeux, synchronisation Windows et téléphones, et récupération garantie via puce SIM et mail.',
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    reactions: [
      { type: 'love', userId: 'user-flex-support', userName: 'Assistance Flex Officielle' },
      { type: 'like', userId: 'user-franck', userName: 'Franck Alex' }
    ],
    comments: [
      {
        id: 'c-1',
        postId: 'post-1',
        authorId: 'user-flex-support',
        authorName: 'Assistance Flex Officielle',
        authorAvatar: FLEX_SUPPORT.avatar,
        content: 'Félicitations pour cette mise à jour 5 étoiles ! Le système de récupération par puce et multi-appareils est opérationnel à 100%.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        likes: ['user-franck'],
      }
    ],
    sharesCount: 12,
    privacy: 'public',
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story-1',
    authorId: 'user-franck',
    authorName: 'Franck Alex',
    authorAvatar: CURRENT_USER.avatar,
    mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    caption: 'Flex Online : interface stable, élégante et ultra-rapide 🚀',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 22 * 3600 * 1000).toISOString(),
  }
];

export const INITIAL_CALL_LOGS: CallLog[] = [
  {
    id: 'call-1',
    contact: FLEX_SUPPORT,
    type: 'audio',
    direction: 'incoming',
    timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    duration: '2:15',
  }
];
