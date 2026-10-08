// Choosing how much of the room a device can carry: a first guess from the
// graphics card, the visitor's own earlier choice, or `?tier=` in the address,
// then a measurement of real frames that steps down when they come too slowly.
import { TIERS, type TierName } from './look';

const STORAGE_KEY = 'kfa-tier';

export interface TierGuess {
  tier: TierName;
  why: string;
  /** Chosen by the visitor or the address: never stepped down automatically. */
  locked: boolean;
}

const isTier = (t: unknown): t is TierName => typeof t === 'string' && t in TIERS;

function readGPU(): { webgl2: boolean; name: string } {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return { webgl2: false, name: '' };
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const name = String(gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return { webgl2: true, name };
  } catch {
    return { webgl2: false, name: '' };
  }
}

export function hasWebGL2(): boolean {
  return readGPU().webgl2;
}

export function guessTier(): TierGuess {
  const asked = new URLSearchParams(location.search).get('tier');
  if (isTier(asked)) return { tier: asked, why: 'set in the address', locked: true };
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
  if (isTier(saved)) return { tier: saved, why: 'your earlier choice', locked: true };
  const gpu = readGPU();
  if (!gpu.webgl2) return { tier: 'low', why: 'this browser has no WebGL 2', locked: false };
  if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(gpu.name))
    return { tier: 'low', why: 'software graphics', locked: false };
  const phone =
    matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 1000;
  if (phone) return { tier: 'mid', why: 'tuned for a phone or tablet', locked: false };
  const nav = navigator as Navigator & { deviceMemory?: number };
  if ((navigator.hardwareConcurrency || 8) <= 4 && (nav.deviceMemory || 8) <= 4)
    return { tier: 'mid', why: 'tuned for a lighter computer', locked: false };
  return { tier: 'high', why: 'your graphics card can carry the room', locked: false };
}

export function saveTier(tier: TierName): void {
  try {
    localStorage.setItem(STORAGE_KEY, tier);
  } catch {
    /* storage unavailable */
  }
}

/** Render a few frames and return the median frame time in milliseconds. */
export function timeFrames(
  render: (now: number) => void,
  { warm = 8, frames = 24, maxMs = 2600 } = {},
): Promise<number> {
  return new Promise((resolve) => {
    const times: number[] = [];
    let n = 0;
    const t0 = performance.now();
    let last = t0;
    const step = (now: number) => {
      render(now);
      n++;
      if (n > warm) times.push(now - last);
      last = now;
      if (n >= warm + frames || now - t0 > maxMs) {
        times.sort((a, b) => a - b);
        resolve(times.length ? times[Math.floor(times.length * 0.5)]! : 999);
      } else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}
