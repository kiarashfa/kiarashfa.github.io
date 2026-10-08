// Converge and Arrival on the one stage.
// Home: the name of each project rides two drops that fuse and pour into its
// emblem, which sets into mercury and melts again for the next.
// Project page: the picture glides (the emblem moves aside and closer), the
// mercury blooms into the project's colours, and the page comes in beside it.
import * as T from 'three';
import type { Veil } from '../scripts/veil';
import { portrait } from './portrait';
import { PLINTH_TOP, TIERS, type TierName } from './look';
import { guessTier, saveTier, timeFrames } from './quality';
import { createStage } from './stage';
import type { StageEmblem } from './emblem';
import type { StageProject, StageView } from './types';

const ease = (t: number) => t * t * (3 - 2 * t);
const seg = (f: number, a: number, b: number) => Math.min(1, Math.max(0, (f - a) / (b - a)));

const TIER_LABEL: Record<TierName, string> = {
  high: 'Atelier',
  mid: 'Atelier, lighter',
  low: 'The void',
};

export interface Arrival {
  show(view: StageView): void;
  readonly tier: TierName;
  setTier(t: TierName): void;
}

export async function startArrival(
  canvas: HTMLCanvasElement,
  projects: StageProject[],
  initial: StageView,
  veil: Veil,
  onTier: (t: TierName) => void,
): Promise<Arrival> {
  // for testing: ?tier=high|mid|low, ?still (a settled frame), ?at=<position on the home>
  const query = new URLSearchParams(location.search),
    STILL = query.has('still'),
    AT = parseFloat(query.get('at') ?? '');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = projects.length,
    mod = (i: number) => ((i % N) + N) % N;

  veil.set(0.06, 'Warming the mercury');
  const guess = guessTier();
  veil.tier(TIER_LABEL[guess.tier], guess.why);
  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);
  const stage = await createStage(canvas, guess.tier, (p, label) => veil.set(p, label));
  const U = stage.U,
    EU = stage.EU,
    drops = U.uBalls.value;
  U.uCount.value = 2;

  let view: StageView = initial;
  let target = 0,
    pos = 0,
    idle = 0,
    cur = -1,
    k = 0,
    kT = 0,
    spin = 0,
    last = performance.now();
  let entry: StageEmblem | null = null;
  const indexOf = (slug: string) => projects.findIndex((p) => p.slug === slug);

  // ---------- the home's text, refreshed whenever the project in view changes ----------
  const el = (id: string) => document.getElementById(id);
  function texts(p: StageProject): void {
    const name = el('converge-name');
    if (name) {
      const a = document.createElement('span'),
        b = document.createElement('span'),
        dot = document.createElement('i');
      a.textContent = p.name.slice(0, p.split).trimEnd();
      b.textContent = p.name.slice(p.split).trimStart();
      dot.className = 'mercury-dot';
      name.replaceChildren(a, dot, b);
      name.setAttribute('aria-label', p.name);
    }
    const set = (id: string, text: string) => {
      const e = el(id);
      if (e) e.textContent = text;
    };
    set('converge-roots', `${p.roots[0]} + ${p.roots[1]}`);
    set('converge-wa', p.roots[0]);
    set('converge-wb', p.roots[1]);
    set(
      'converge-kicker',
      [p.familyName, p.flagship && 'Flagship', p.year].filter(Boolean).join(' · '),
    );
    set('converge-line', p.line);
    set('converge-made', p.made ? `Made with ♥ ${p.made}.` : '');
    const cta = el('converge-cta') as HTMLAnchorElement | null;
    if (cta) {
      cta.href = p.href;
      cta.setAttribute('aria-label', `Open ${p.name}`);
    }
    document.querySelectorAll<HTMLAnchorElement>('#home-index a[data-slug]').forEach((a) => {
      if (a.dataset.slug === p.slug) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  // ---------- input on the home ----------
  const onHome = () => view.kind === 'home';
  addEventListener(
    'wheel',
    (e) => {
      if (!onHome()) return;
      target += e.deltaY * 0.0008;
      idle = 0;
    },
    { passive: true },
  );
  let touchY: number | null = null;
  canvas.addEventListener('pointerdown', (e) => (touchY = e.clientY));
  addEventListener('pointerup', () => (touchY = null));
  let mx = 0,
    my = 0;
  addEventListener('pointermove', (e) => {
    mx = e.clientX / innerWidth - 0.5;
    my = e.clientY / innerHeight - 0.5;
    if (onHome() && touchY !== null && e.pointerType !== 'mouse') {
      target -= (e.clientY - touchY) * 0.003;
      touchY = e.clientY;
      idle = 0;
    }
  });
  addEventListener('keydown', (e) => {
    if (!onHome() || e.target instanceof HTMLInputElement || e.altKey || e.metaKey || e.ctrlKey)
      return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') target = Math.floor(target) + 1.66;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') target = Math.floor(target) - 0.34;
    else return;
    idle = 0;
  });
  // the names on the home choose a project rather than leave the page; its button opens it
  document.addEventListener('click', (e) => {
    if (!onHome()) return;
    const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('#home-index a[data-slug]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const i = indexOf(a.dataset.slug!);
    if (i < 0) return;
    e.preventDefault();
    const base = Math.floor(pos);
    // the nearest way round to it
    let d = mod(i - mod(base));
    if (d > N / 2) d -= N;
    target = base + d + 0.66;
    idle = 0;
  });

  // ---------- portraits for the family list ----------
  function fillPortraits(): void {
    document.querySelectorAll<HTMLImageElement>('img[data-portrait]').forEach((img) => {
      const p = projects.find((q) => q.slug === img.dataset.portrait);
      if (!p || img.dataset.filled) return;
      img.dataset.filled = '';
      portrait(p, img.hasAttribute('data-colour'))
        .then((url) => {
          img.src = url;
        })
        .catch(() => undefined);
    });
  }

  // ---------- the frame ----------
  const v3 = new T.Vector3();
  function frame(now: number): void {
    const dt = STILL ? 0.016 : Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = now / 1000;
    idle += dt;
    if (onHome() && idle > 5 && !reduce && !STILL && !Number.isFinite(AT)) target += dt * 0.055;
    pos += (target - pos) * (reduce || STILL ? 1 : 0.07);
    const i = mod(Math.floor(pos)),
      f = pos - Math.floor(pos),
      p = projects[i]!;
    if (i !== cur) {
      cur = i;
      entry = null;
      stage.setProject(p).then((e) => {
        if (cur === i) entry = e;
      });
      texts(p);
      setTimeout(() => void stage.prepare(projects[mod(i + 1)]!), 900);
    }
    k += (kT - k) * (STILL || reduce ? 1 : 1 - Math.exp(-dt * 2.4));
    const kk = ease(Math.min(1, k * 1.02));
    const cy = PLINTH_TOP + (entry?.height ?? 0.9) * 0.42;

    // split the drop into its two words, hold, fuse, pour into the emblem, set into mercury, hold, melt
    const apart = ease(seg(f, 0, 0.14)) * (1 - ease(seg(f, 0.26, 0.38))),
      sep = 0.82 * apart,
      bob = Math.sin(t * 1.3) * 0.035 * apart;
    drops[0]!.set(-sep, cy + bob, 0, 0.25 - 0.03 * apart);
    drops[1]!.set(sep, cy - bob, 0, 0.25 - 0.03 * apart);
    U.uK.value = 0.42 - 0.3 * apart;
    let morph = ease(seg(f, 0.38, 0.52)) * (1 - ease(seg(f, 0.9, 1))),
      set = ease(seg(f, 0.52, 0.64)) * (1 - ease(seg(f, 0.84, 0.92)));
    if (!entry) morph = set = 0; // the emblem is still being made: only the drops
    U.uMorph.value = morph;
    U.uWob.value = 1 - morph * 0.9;
    U.uHide.value = 0.05 * set + kk * 2;
    EU.uSet.value = set;
    EU.uColour.value = ease(seg(k, 0.3, 0.95));
    spin += dt * (reduce ? 0 : 0.22 * (1 - kk * 0.6));
    const panel = view.kind === 'project' ? el('panel') : null;
    stage.holder.rotation.y = STILL ? 0.5 : spin + (panel ? panel.scrollTop * 0.0025 : 0);

    // the two words ride their drops, then blur into each other as they fuse
    const fuse = ease(seg(f, 0.26, 0.38)),
      wordsOn = apart > 0.02 ? Math.min(1, apart * 1.6) * (1 - fuse) * (1 - kk) : 0;
    (
      [
        ['converge-wa', drops[0]!, -1],
        ['converge-wb', drops[1]!, 1],
      ] as const
    ).forEach(([id, d, s]) => {
      const w = el(id);
      if (!w) return;
      const [x, y] = stage.project(v3.set(d.x, d.y + d.w + 0.1, 0));
      w.style.opacity = String(wordsOn);
      w.style.transform = `translate(${x}px,${y}px) translate(-50%,-100%) translateX(${-s * fuse * 40}px)`;
      w.style.filter = `blur(${fuse * 6}px)`;
    });
    const nameOn = ease(seg(f, 0.4, 0.56)) * (1 - ease(seg(f, 0.9, 0.98)));
    const mark = el('converge-mark');
    if (mark) {
      mark.style.opacity = String(nameOn);
      const halves = mark.querySelectorAll<HTMLElement>('#converge-name span');
      if (halves.length === 2) {
        halves[0]!.style.transform = `translateX(${(1 - nameOn) * -40}px)`;
        halves[1]!.style.transform = `translateX(${(1 - nameOn) * 40}px)`;
      }
    }

    // the camera: a little parallax on the home, the glide towards the emblem on a project page
    const portraitScreen = innerWidth < innerHeight,
      cam = stage.room.cam;
    stage.setShift(portraitScreen ? 0 : 0.2 * kk, portraitScreen ? 0.27 * kk : 0);
    stage.camera.position.set(
      mx * 0.3 * (1 - kk),
      cam.y + 0.05 - my * 0.12 * (1 - kk) + (portraitScreen ? 0.25 : 0) + kk * 0.05,
      (portraitScreen ? 6.4 : 5.0) - kk * (portraitScreen ? 1.9 : 0.9),
    );
    stage.camera.lookAt(0, cam.look + (portraitScreen ? 0.12 : 0) + kk * 0.06, 0);
    stage.frame(t);
  }

  // ---------- views ----------
  function show(next: StageView): void {
    const prev = view;
    view = next;
    if (next.kind === 'home') {
      kT = 0;
      idle = 0;
      if (cur >= 0) texts(projects[cur]!);
    } else if (next.kind === 'project') {
      const i = indexOf(next.slug);
      if (i >= 0) {
        if (i !== cur) {
          // another project: jump to it and let it bloom again
          k = Math.min(k, 0.28);
          const base = Math.floor(pos);
          pos = target = base - mod(base) + i + 0.7;
        } else target = Math.floor(pos) + 0.7;
        if (prev.kind === 'page') k = Math.min(k, 0.28);
      }
      kT = 1;
      fillPortraits();
    }
  }

  // ---------- start ----------
  veil.set(0.5, 'Setting the first drop');
  const first =
    initial.kind === 'project'
      ? Math.max(0, indexOf(initial.slug))
      : Number.isFinite(AT)
        ? mod(Math.floor(AT))
        : 0;
  pos = target = initial.kind === 'project' ? first + 0.7 : Number.isFinite(AT) ? AT : 0;
  entry = await stage.setProject(projects[first]!);
  cur = first;
  texts(projects[first]!);
  veil.set(0.66, 'Compiling the light');
  await stage.compile();
  if (!guess.locked && stage.tier !== 'low' && !STILL) {
    veil.set(0.8, 'Measuring this screen');
    const ms = await timeFrames(frame);
    if (ms > 40 && stage.tier === 'high') {
      stage.setTier('mid');
      veil.tier(TIER_LABEL.mid, 'stepped down to keep it smooth');
    }
    if (ms > 60) {
      stage.setTier('low');
      veil.tier(TIER_LABEL.low, 'stepped down to keep it smooth');
    }
  }
  onTier(stage.tier);
  veil.done();
  show(initial);

  const loop = (now: number) => {
    if (view.kind !== 'page' && !document.hidden) frame(now);
    else last = now;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame((now) => {
    last = now;
    loop(now);
  });

  return {
    show,
    get tier() {
      return stage.tier;
    },
    setTier(t: TierName) {
      if (!(t in TIERS) || t === stage.tier) return;
      stage.setTier(t);
      saveTier(t);
      onTier(t);
    },
  };
}
