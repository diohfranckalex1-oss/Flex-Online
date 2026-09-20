import { User, Conversation, Message, Post, Story, CallLog } from '../types';

export const CURRENT_USER: User = {
  id: 'user-franck',
  name: 'Franck Alex',
  username: 'franckalex',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  bio: 'Passionné d’innovation numérique & de nouvelles technologies 🚀',
  phone: '+33 6 12 34 56 78',
  status: 'online',
  verified: true,
};

export const AVAILABLE_USERS: User[] = [
  CURRENT_USER,
  {
    id: 'user-sarah',
    name: 'Sarah Dupont',
    username: 'sarah_d',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    bio: 'Photographe nomade & créatrice de contenu 📸✨',
    phone: '+33 6 98 76 54 32',
    status: 'online',
    lastSeen: 'En ligne',
    verified: true,
  },
  {
    id: 'user-david',
    name: 'David Kamara',
    username: 'david_k',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Entrepreneur | Développeur Web3 | Fan de foot ⚽',
    phone: '+33 7 45 67 89 01',
    status: 'online',
    lastSeen: 'Il y a 5 min',
  },
  {
    id: 'user-aicha',
    name: 'Aïcha Traoré',
    username: 'aicha_t',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    bio: 'Architecte d’intérieur & amatrice d’art contemporain 🎨',
    phone: '+33 6 33 22 11 00',
    status: 'away',
    lastSeen: 'Il y a 20 min',
  },
  {
    id: 'user-lucas',
    name: 'Lucas Martin',
    username: 'lucasm',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Musicien & compositeur indépendant 🎧',
    phone: '+33 6 88 99 77 66',
    status: 'offline',
    lastSeen: 'Aujourd’hui à 11:32',
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-sarah',
    type: 'direct',
    participants: ['user-franck', 'user-sarah'],
    unreadCount: { 'user-franck': 1 },
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    pinned: true,
  },
  {
    id: 'conv-group-family',
    type: 'group',
    name: 'Communauté Flex Online ❤️',
    avatar: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80',
    description: 'Espace d’échange public ouvert à tous les utilisateurs de Flex Online !',
    participants: ['user-franck', 'user-sarah', 'user-david', 'user-aicha', 'user-lucas'],
    unreadCount: { 'user-franck': 2 },
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    pinned: true,
  },
  {
    id: 'conv-david',
    type: 'direct',
    participants: ['user-franck', 'user-david'],
    unreadCount: { 'user-franck': 0 },
    updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'conv-group-tech',
    type: 'group',
    name: 'Startup & Tech Innovators 💻',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
    description: 'Échange sur les projets, les designs UI/UX et le dev.',
    participants: ['user-franck', 'user-david', 'user-lucas'],
    unreadCount: { 'user-franck': 0 },
    updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'conv-aicha',
    type: 'direct',
    participants: ['user-franck', 'user-aicha'],
    unreadCount: { 'user-franck': 0 },
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];

export const INITIAL_MESSAGES: Message[] = [
  // Conversation with Sarah
  {
    id: 'msg-s1',
    conversationId: 'conv-sarah',
    senderId: 'user-sarah',
    senderName: 'Sarah Dupont',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    content: 'Salut Franck ! Tu as vu les photos de la nouvelle expo d’art ? C’était magnifique !',
    type: 'text',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    status: 'read',
    reactions: [{ emoji: '❤️', userId: 'user-franck', userName: 'Franck Alex' }],
  },
  {
    id: 'msg-s2',
    conversationId: 'conv-sarah',
    senderId: 'user-sarah',
    senderName: 'Sarah Dupont',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    content: 'Regarde cette toile incroyable :',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    status: 'read',
    reactions: [{ emoji: '🔥', userId: 'user-franck', userName: 'Franck Alex' }],
  },
  {
    id: 'msg-s3',
    conversationId: 'conv-sarah',
    senderId: 'user-franck',
    senderName: 'Franck Alex',
    content: 'Waouh, les contrastes de couleurs sont saisissants ! On s’appelle ce soir pour en discuter ?',
    type: 'text',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'read',
    reactions: [],
  },
  {
    id: 'msg-s4',
    conversationId: 'conv-sarah',
    senderId: 'user-sarah',
    senderName: 'Sarah Dupont',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    content: 'Oui avec grand plaisir ! Je serai dispo dès 19h.',
    type: 'text',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    status: 'delivered',
    reactions: [{ emoji: '👍', userId: 'user-franck', userName: 'Franck Alex' }],
  },

  // Conversation Group Family
  {
    id: 'msg-f1',
    conversationId: 'conv-group-family',
    senderId: 'user-aicha',
    senderName: 'Aïcha Traoré',
    senderAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    content: 'Coucou tout le monde ! N’oubliez pas le grand repas de dimanche midi chez nous 🥘',
    type: 'text',
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    status: 'read',
    reactions: [
      { emoji: '😍', userId: 'user-sarah', userName: 'Sarah Dupont' },
      { emoji: '🎉', userId: 'user-franck', userName: 'Franck Alex' }
    ],
  },
  {
    id: 'msg-f2',
    conversationId: 'conv-group-family',
    senderId: 'user-david',
    senderName: 'David Kamara',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    content: 'Super ! J’apporte les desserts et les boissons fraîches 🍰🥤',
    type: 'text',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    status: 'read',
    reactions: [],
  },
  {
    id: 'msg-f3',
    conversationId: 'conv-group-family',
    senderId: 'user-sarah',
    senderName: 'Sarah Dupont',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    content: 'Parfait, j’ai préparé une petite note vocale pour les détails !',
    type: 'voice',
    voiceDuration: 14,
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'delivered',
    reactions: [{ emoji: '❤️', userId: 'user-franck', userName: 'Franck Alex' }],
  },

  // Conversation with David
  {
    id: 'msg-d1',
    conversationId: 'conv-david',
    senderId: 'user-david',
    senderName: 'David Kamara',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    content: 'Hello Franck ! Le prototype de l’interface est prêt à être testé. Dis-moi quand tu as 10 minutes.',
    type: 'text',
    timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    status: 'read',
    reactions: [{ emoji: '🚀', userId: 'user-franck', userName: 'Franck Alex' }],
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    authorId: 'user-sarah',
    authorName: 'Sarah Dupont',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    authorVerified: true,
    content: 'Quelle lumière magique aujourd’hui pour cette séance photo dans les ruelles historiques ! Prendre le temps d’observer et de capturer les détails de la vie urbaine... Qu’en pensez-vous ? 📸✨',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    timestamp: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(),
    reactions: [
      { type: 'love', userId: 'user-franck', userName: 'Franck Alex' },
      { type: 'like', userId: 'user-david', userName: 'David Kamara' },
      { type: 'wow', userId: 'user-aicha', userName: 'Aïcha Traoré' }
    ],
    comments: [
      {
        id: 'c-1',
        postId: 'post-1',
        authorId: 'user-franck',
        authorName: 'Franck Alex',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        content: 'La composition est tout simplement époustouflante ! Bravo Sarah 👏',
        timestamp: new Date(Date.now() - 1.2 * 3600 * 1000).toISOString(),
        likes: ['user-sarah'],
      },
      {
        id: 'c-2',
        postId: 'post-1',
        authorId: 'user-david',
        authorName: 'David Kamara',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        content: 'Incroyable ! On dirait une carte postale.',
        timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        likes: [],
      }
    ],
    sharesCount: 7,
    privacy: 'public',
  },
  {
    id: 'post-2',
    authorId: 'user-david',
    authorName: 'David Kamara',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    authorVerified: false,
    content: 'Fier de lancer officiellement notre nouvelle version de plateforme collaborative en temps réel ! Moins de friction, plus de convivialité et une réactivité immédiate sur tous les écrans. 🚀💡',
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    reactions: [
      { type: 'like', userId: 'user-franck', userName: 'Franck Alex' },
      { type: 'love', userId: 'user-sarah', userName: 'Sarah Dupont' }
    ],
    comments: [
      {
        id: 'c-3',
        postId: 'post-2',
        authorId: 'user-aicha',
        authorName: 'Aïcha Traoré',
        authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
        content: 'Félicitations David, tout le travail acharné porte ses fruits !',
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        likes: ['user-david'],
      }
    ],
    sharesCount: 12,
    privacy: 'public',
  },
  {
    id: 'post-3',
    authorId: 'user-aicha',
    authorName: 'Aïcha Traoré',
    authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    authorVerified: false,
    content: 'Nouvel aménagement de salon terminé : tons chaleureux terracotta, bois naturel et plantes vertes pour créer un vrai cocon de sérénité 🌿🏡',
    mediaUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    reactions: [
      { type: 'love', userId: 'user-franck', userName: 'Franck Alex' },
      { type: 'care', userId: 'user-sarah', userName: 'Sarah Dupont' }
    ],
    comments: [],
    sharesCount: 3,
    privacy: 'friends',
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story-1',
    authorId: 'user-sarah',
    authorName: 'Sarah Dupont',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    caption: 'Sunset vibes au bord de l’eau 🌅',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 22 * 3600 * 1000).toISOString(),
    viewed: false,
  },
  {
    id: 'story-2',
    authorId: 'user-david',
    authorName: 'David Kamara',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    caption: 'Hackathon avec l’équipe jusqu’à l’aube ☕⚡',
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 19 * 3600 * 1000).toISOString(),
    viewed: false,
  },
  {
    id: 'story-3',
    authorId: 'user-aicha',
    authorName: 'Aïcha Traoré',
    authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    caption: 'Pause café & croquis d’architecture ☕📐',
    timestamp: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 17 * 3600 * 1000).toISOString(),
    viewed: true,
  },
];

export const INITIAL_CALL_LOGS: CallLog[] = [
  {
    id: 'call-1',
    contact: AVAILABLE_USERS[1], // Sarah
    type: 'video',
    direction: 'incoming',
    timestamp: 'Aujourd’hui à 11:20',
    duration: '12 min 45 s',
  },
  {
    id: 'call-2',
    contact: AVAILABLE_USERS[2], // David
    type: 'audio',
    direction: 'outgoing',
    timestamp: 'Hier à 18:04',
    duration: '5 min 10 s',
  },
  {
    id: 'call-3',
    contact: AVAILABLE_USERS[3], // Aïcha
    type: 'video',
    direction: 'missed',
    timestamp: 'Hier à 14:15',
  },
  {
    id: 'call-4',
    contact: AVAILABLE_USERS[1], // Sarah
    type: 'audio',
    direction: 'outgoing',
    timestamp: '18 Sept à 20:30',
    duration: '24 min 12 s',
  },
];
