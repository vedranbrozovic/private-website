export type BiomeId = 'slavonia' | 'zagorje' | 'lika' | 'dalmatia';

export type TileType = 
  | 'plain' 
  | 'hill' 
  | 'mountain' 
  | 'wetland' 
  | 'forest' 
  | 'coast' 
  | 'deep_water' 
  | 'shallow_water'
  | 'city';

export type HatStyle = 'fedora' | 'sestine' | 'sailor' | 'beanie' | 'crown' | 'none';
export type AccessoryStyle = 'staff' | 'tambura' | 'lantern' | 'shield';

export interface CharacterCustomization {
  presetId: string;
  name: string;
  outfitColor: string;
  cloakColor: string;
  hatStyle: HatStyle;
  hairColor: string;
  skinTone: string;
  accessory: AccessoryStyle;
}

export const DEFAULT_CHARACTER_CUSTOMIZATION: CharacterCustomization = {
  presetId: 'zagreb_explorer',
  name: 'Putnik',
  outfitColor: '#2563eb',
  cloakColor: '#dc2626',
  hatStyle: 'sestine',
  hairColor: '#4a2e1b',
  skinTone: '#ffd8be',
  accessory: 'staff',
};

export const CHARACTER_PRESETS: CharacterCustomization[] = [
  {
    presetId: 'zagreb_explorer',
    name: 'Zagreb Purger',
    outfitColor: '#2563eb',
    cloakColor: '#dc2626',
    hatStyle: 'sestine',
    hairColor: '#4a2e1b',
    skinTone: '#ffd8be',
    accessory: 'staff',
  },
  {
    presetId: 'dalmatian_mariner',
    name: 'Adriatic Captain',
    outfitColor: '#1e3a8a',
    cloakColor: '#f8fafc',
    hatStyle: 'sailor',
    hairColor: '#27272a',
    skinTone: '#ebba98',
    accessory: 'lantern',
  },
  {
    presetId: 'velebit_ranger',
    name: 'Velebit Mountaineer',
    outfitColor: '#15803d',
    cloakColor: '#d97706',
    hatStyle: 'beanie',
    hairColor: '#7c2d12',
    skinTone: '#f5cba7',
    accessory: 'staff',
  },
  {
    presetId: 'slavonian_ducat',
    name: 'Slavonian Bećar',
    outfitColor: '#b45309',
    cloakColor: '#f59e0b',
    hatStyle: 'fedora',
    hairColor: '#d4a359',
    skinTone: '#ffd8be',
    accessory: 'tambura',
  },
  {
    presetId: 'ragusa_knight',
    name: 'Royal Guardian',
    outfitColor: '#dc2626',
    cloakColor: '#f59e0b',
    hatStyle: 'crown',
    hairColor: '#e2e8f0',
    skinTone: '#d49b72',
    accessory: 'shield',
  },
];

export interface LandmarkData {
  id: string;
  name: string;
  title: string;
  biome: BiomeId;
  category: 'wonder' | 'tech' | 'nature' | 'cavalry' | 'city' | 'fortress' | 'craft' | 'coastal';
  loreNote: string;
  gameBuff: {
    title: string;
    description: string;
    stat: string;
  };
  gridX: number;
  gridZ: number;
  icon: string;
  actionLabel?: string;
  modelKey: string;
}

export interface TileData {
  x: number;
  z: number;
  biome: BiomeId;
  type: TileType;
  height: number;
  isLand: boolean;
  landmarkId?: string;
  revealed: boolean;
  baseColor: string;
}

export interface PlayerState {
  x: number;
  z: number;
  targetX?: number;
  targetZ?: number;
  isMoving: boolean;
  isMounted: boolean; // Lipizzaner rider
  moveRange: number; // 4 normally, 6 if Lipizzaner on 4x map
  stars: number;
  discoveredLandmarks: Set<string>;
  revealedTiles: Set<string>;
  activeBuffs: string[];
  customization: CharacterCustomization;
}
