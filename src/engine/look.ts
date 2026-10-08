// The night atelier, in one place: every value that shapes the light.
// A dark room with bright soft strips; the mercury reflects a dark studio,
// never a black void, so no face of it ever reads black.
import * as T from 'three';

export const PLINTH_TOP = 0.5;

export const LOOK = {
  toneMapping: T.ACESFilmicToneMapping,
  exposure: 0.95,
  mercury: { color: 0xe8ebef, metalness: 1, roughness: 0.075, envMapIntensity: 1.0 },
  /** The lamps' own highlights on mercury, kept low. */
  directSpecular: 0.28,
  liquid: { gain: 1.25, lod: 1.4, spec: 0.22 },
  /** Bloom strength, radius, threshold: a little glow on real highlights only. */
  bloom: [0.16, 0.45, 1.2] as [number, number, number],
  /** The glow riding the front where the mercury sets. */
  setEdge: 1.8,
  /** Blur of the reflected room for meshes. */
  envSigma: 0.028,
  room: { bg: 0x08080a, plaster: '#1d1c21', stone: '#101012', box: 1.15, hemi: 0.5 },
} as const;

export type TierName = 'high' | 'mid' | 'low';

export interface Tier {
  name: string;
  dpr: number;
  shadows: number;
  dust: number;
  steps: number;
  haze: boolean;
  room: 'atelier' | 'void';
}

export const TIERS: Record<TierName, Tier> = {
  high: {
    name: 'Atelier',
    dpr: 2,
    shadows: 2048,
    dust: 160,
    steps: 110,
    haze: true,
    room: 'atelier',
  },
  mid: {
    name: 'Atelier, lighter',
    dpr: 1.5,
    shadows: 0,
    dust: 60,
    steps: 84,
    haze: true,
    room: 'atelier',
  },
  low: { name: 'The void', dpr: 1, shadows: 0, dust: 0, steps: 64, haze: false, room: 'void' },
};
