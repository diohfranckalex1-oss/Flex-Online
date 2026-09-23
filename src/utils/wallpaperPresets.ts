import { ChatWallpaper } from '../types';

export const DEFAULT_WALLPAPERS: ChatWallpaper[] = [
  {
    id: 'flex-dark',
    name: 'Flex Nuit Noir',
    type: 'color',
    value: '#0c1117',
    previewColor: '#0c1117'
  },
  {
    id: 'flex-light',
    name: 'Flex Blanc Lumineux',
    type: 'color',
    value: '#f8fafc',
    previewColor: '#f8fafc'
  },
  {
    id: 'pure-black',
    name: 'Noir Absolu OLED',
    type: 'color',
    value: '#000000',
    previewColor: '#000000'
  },
  {
    id: 'violet-nebula',
    name: 'Nébuleuse Violette',
    type: 'gradient',
    value: 'linear-gradient(135deg, #1b0c33 0%, #0d061a 50%, #06030c 100%)',
    previewColor: '#1b0c33'
  },
  {
    id: 'deep-ocean',
    name: 'Bleu Océan Profond',
    type: 'gradient',
    value: 'linear-gradient(135deg, #0a192f 0%, #050d1a 50%, #02060d 100%)',
    previewColor: '#0a192f'
  },
  {
    id: 'emerald-peace',
    name: 'Forêt Émeraude Paisible',
    type: 'gradient',
    value: 'linear-gradient(135deg, #062b1b 0%, #03170e 50%, #020d08 100%)',
    previewColor: '#062b1b'
  },
  {
    id: 'sunset-amber',
    name: 'Coucher de Soleil Ambré',
    type: 'gradient',
    value: 'linear-gradient(135deg, #36170c 0%, #1c0a05 50%, #0e0502 100%)',
    previewColor: '#36170c'
  },
  {
    id: 'pearl-cream',
    name: 'Blanc Crème Doux',
    type: 'color',
    value: '#f1f5f9',
    previewColor: '#f1f5f9'
  },
  {
    id: 'lavender-light',
    name: 'Lavande Douce (Clair)',
    type: 'gradient',
    value: 'linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%)',
    previewColor: '#ede9fe'
  }
];

export const DEFAULT_DARK_WALLPAPER = DEFAULT_WALLPAPERS[0];
export const DEFAULT_LIGHT_WALLPAPER = DEFAULT_WALLPAPERS[1];
