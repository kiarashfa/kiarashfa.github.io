// Ties the persistent stage to page navigation. The canvas, the loading screen
// and this script survive every page change; each page says which view it
// wants through <html data-view> (and data-slug on a project page). The engine
// itself is only fetched when a page first needs it.
import type { Arrival } from '../engine/arrival';
import type { TierName } from '../engine/look';
import type { StageProject, StageView } from '../engine/types';
import { veil } from './veil';

type State = 'boot' | 'gl' | 'no-gl';

let state: State | null = null;
let tier: TierName | null = null;
let arrival: Promise<Arrival | null> | null = null;

const root = document.documentElement;

/** Page changes replace the root element's attributes, so restore ours after each one. */
function applyRoot(): void {
  root.classList.add('js');
  root.classList.remove('gl-boot', 'gl', 'no-gl');
  if (state) root.classList.add(state === 'boot' ? 'gl-boot' : state);
  if (tier) root.dataset.tier = tier;
}

function setState(next: State): void {
  state = next;
  applyRoot();
}

function viewOf(): StageView {
  const kind = root.dataset.view;
  if (kind === 'home') return { kind: 'home' };
  if (kind === 'project' && root.dataset.slug) return { kind: 'project', slug: root.dataset.slug };
  return { kind: 'page' };
}

function projects(): StageProject[] {
  const el = document.getElementById('stage-data');
  return el?.textContent ? (JSON.parse(el.textContent) as StageProject[]) : [];
}

function canRun(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

async function boot(view: StageView): Promise<Arrival | null> {
  const canvas = document.getElementById('stage') as HTMLCanvasElement | null;
  const list = projects();
  if (!canvas || !list.length || !canRun()) {
    setState('no-gl');
    return null;
  }
  setState('boot');
  const v = veil();
  // a stage that has not started after this long gives way to the plain page
  const giveUp = setTimeout(() => {
    if (state === 'boot') setState('no-gl');
  }, 20000);
  try {
    const { startArrival } = await import('../engine/arrival');
    const a = await startArrival(canvas, list, view, v, (t) => {
      tier = t;
      applyRoot();
      dispatchEvent(new CustomEvent('kfa:tier', { detail: t }));
    });
    clearTimeout(giveUp);
    setState('gl');
    return a;
  } catch (err) {
    clearTimeout(giveUp);
    console.error(err);
    setState('no-gl');
    v.done();
    return null;
  }
}

async function onPage(): Promise<void> {
  applyRoot();
  const view = viewOf();
  if (!arrival) {
    if (view.kind === 'page') return;
    arrival = boot(view);
    return;
  }
  (await arrival)?.show(view);
}

document.addEventListener('astro:after-swap', applyRoot);
document.addEventListener('astro:page-load', () => void onPage());
addEventListener('kfa:set-tier', (e) => {
  const t = (e as CustomEvent<TierName>).detail;
  void arrival?.then((a) => a?.setTier(t));
});
