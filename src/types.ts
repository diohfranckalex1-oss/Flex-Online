export type UserStatus = 'online' | 'offline' | 'away' | 'busy';

export interface LinkedDevice {
  id: string;
  name: string;
  type: 'pc' | 'mobile' | 'web';
  os: string;
  browser?: string;
  lastActive: string;
  ip?: string;
  status: 'active' | 'revoked';
}

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  countryCode?: string;
  username: string;
  avatar: string;
  bio?: string;
  phone?: string;
  email?: string;
  backupPhone?: string;
  status: UserStatus;
  lastSeen?: string;
  verified?: boolean;
  securityPin?: string;
  recoveryKey?: string;
  linkedDevices?: LinkedDevice[];
  fontSizePreference?: 'normal' | 'large' | 'xlarge';
  createdAt?: string;
}

export interface VerificationCode {
  target: string;
  code: string;
  type: 'phone_otp' | 'email_otp' | 'recovery';
  createdAt: string;
  expiresAt: string;
}

export type MessageType = 'text' | 'image' | 'voice' | 'file';

export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: MessageType;
  mediaUrl?: string;
  voiceDuration?: number; // in seconds
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  reactions: MessageReaction[];
  replyToId?: string;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string; // for group
  avatar?: string;
  participants: string[]; // user IDs
  participantDetails?: User[];
  lastMessage?: Message;
  unreadCount: Record<string, number>; // userId -> count
  updatedAt: string;
  description?: string;
  pinned?: boolean;
  muted?: boolean;
}

export type PostReactionType = 'like' | 'love' | 'care' | 'haha' | 'wow' | 'sad' | 'angry';

export interface PostReaction {
  type: PostReactionType;
  userId: string;
  userName: string;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: string[]; // user IDs
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorVerified?: boolean;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  timestamp: string;
  reactions: PostReaction[];
  comments: PostComment[];
  sharesCount: number;
  privacy: 'public' | 'friends';
}

export interface Story {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  mediaUrl: string;
  caption?: string;
  timestamp: string;
  expiresAt: string;
  viewed?: boolean;
}

export interface CallSession {
  id: string;
  caller: User;
  recipient: User;
  type: 'audio' | 'video';
  status: 'ringing' | 'connected' | 'ended';
  startedAt?: string;
  duration?: number;
}

export interface PhoneContact {
  id: string;
  name: string;
  tel: string;
  email?: string;
  avatar?: string;
  isRegisteredUser?: boolean;
  matchedUserId?: string;
  dateSynced: string;
}

export interface CallLog {
  id: string;
  contact: User;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration?: string;
}

export type ThemeMode = 'dark' | 'light';

export interface ChatWallpaper {
  id: string;
  name: string;
  type: 'color' | 'gradient' | 'image';
  value: string;
  previewColor?: string;
}

