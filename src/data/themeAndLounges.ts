export type ThemeMode = 'aurora-dark' | 'electric-obsidian' | 'cyber-amber';

export interface UserVibe {
  emoji: string;
  label: string;
  musicTrack?: string;
}

export const VIBE_OPTIONS: UserVibe[] = [
  { emoji: '⚡', label: 'Sur les nerfs / En action' },
  { emoji: '🎧', label: 'En train d\'écouter du bon son', musicTrack: 'Burna Boy - City Boys' },
  { emoji: '☕', label: 'Pause café & chill' },
  { emoji: '🔥', label: 'En plein rush productif' },
  { emoji: '✨', label: 'Bonne humeur & positive vibes' },
  { emoji: '🌙', label: 'Mode nocturne / focus' },
];

export const AUDIO_LOUNGES = [
  {
    id: 'lounge-chill',
    name: 'Salon Chill & Détente',
    topic: 'Discussion libre, musique & débriefing de la journée',
    activeListeners: 4,
    tags: ['Musique', 'Vibes', 'Chill'],
    isLive: true,
  },
  {
    id: 'lounge-tech',
    name: 'Tech & Créateurs 🚀',
    topic: 'Projets en cours, design, dev et idées de business',
    activeListeners: 3,
    tags: ['Tech', 'Dev', 'Inno'],
    isLive: true,
  },
];
