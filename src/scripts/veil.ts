// The loading screen: two mercury drops close the gap as the work is done and
// fuse into one at "Ready". Its markup is in components/Veil.astro, so it
// shows before any script runs.

const ease = (t: number) => t * t * (3 - 2 * t);

export interface Veil {
  set(progress: number, label?: string): void;
  tier(name: string, why: string): void;
  done(): void;
}

export function veil(): Veil {
  const root = document.getElementById('veil');
  if (!root) return { set() {}, tier() {}, done() {} };
  const $ = <E extends Element>(sel: string) => root.querySelectorAll<E>(sel);
  const line = root.querySelector<HTMLElement>('[data-veil-line]')!;
  const tierName = root.querySelector<HTMLElement>('[data-veil-tier]')!;
  const tierWhy = root.querySelector<HTMLElement>('[data-veil-why]')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let target = 0,
    shown = 0,
    raf = 0;

  const place = (p: number, t: number) => {
    // far apart at the start, touching near the end, one drop at "Ready"
    const fused = p > 0.97;
    const gap = 118 * (1 - ease(p)),
      bob = reduce ? 0 : Math.sin(t * 1.4) * 3 * (1 - p),
      cy = 104;
    const xa = 210 - gap - (fused ? 0 : 6),
      xb = 210 + gap + (fused ? 0 : 6),
      ya = cy + bob,
      yb = cy - bob,
      r = fused ? 52 : 44;
    const at = (sel: string, x: number, y: number, radius?: number) =>
      $<SVGCircleElement | SVGEllipseElement>(sel).forEach((el) => {
        el.setAttribute('cx', String(x));
        el.setAttribute('cy', String(y));
        if (radius) el.setAttribute('r', String(radius));
      });
    at('[data-drop="a"]', xa, ya, r);
    at('[data-drop="b"]', xb, yb, r);
    at('[data-shade="a"]', xa - 6, ya - 8);
    at('[data-shade="b"]', xb - 6, yb - 8);
    at('[data-glint="a"]', xa - 10, ya - 27);
    at('[data-glint="b"]', xb - 10, yb - 27);
    at('[data-rim="a"]', xa, ya + 33);
    at('[data-rim="b"]', xb, yb + 33);
  };
  const loop = (now: number) => {
    shown += (target - shown) * (reduce ? 1 : 0.08);
    place(shown, now / 1000);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return {
    set(p, label) {
      target = Math.max(target, Math.min(1, p));
      if (label) line.textContent = label;
    },
    tier(name, why) {
      tierName.textContent = name;
      tierWhy.textContent = why;
    },
    done() {
      target = 1;
      line.textContent = 'Ready';
      setTimeout(
        () => {
          root.classList.add('is-done');
          setTimeout(() => cancelAnimationFrame(raf), 1200);
        },
        reduce ? 0 : 450,
      );
    },
  };
}
