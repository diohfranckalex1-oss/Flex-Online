import { ChatWallpaper } from '../types';

export const DEFAULT_WALLPAPERS: ChatWallpaper[] = [
  {
    id: 'flex-dark',
    name: 'Flex Nuit Douce',
    type: 'color',
    value: '#131722',
    previewColor: '#131722'
  },
  {
    id: 'flex-light',
    name: 'Flex Blanc Lumineux',
    type: 'color',
    value: '#f8fafc',
    previewColor: '#f8fafc'
  },
  {
    id: 'slate-night',
    name: 'Bleu Ardoise Nuit',
    type: 'color',
    value: '#181e2b',
    previewColor: '#181e2b'
  },
  {
    id: 'violet-nebula',
    name: 'Nébuleuse Douce',
    type: 'gradient',
    value: 'linear-gradient(135deg, #24143d 0%, #171b29 50%, #121622 100%)',
    previewColor: '#24143d'
  },
  {
    id: 'deep-ocean',
    name: 'Bleu Océan Doux',
    type: 'gradient',
    value: 'linear-gradient(135deg, #14243b 0%, #121d2f 50%, #111724 100%)',
    previewColor: '#14243b'
  },
  {
    id: 'emerald-peace',
    name: 'Forêt Émeraude Paisible',
    type: 'gradient',
    value: 'linear-gradient(135deg, #0d3322 0%, #11221c 50%, #111822 100%)',
    previewColor: '#0d3322'
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
