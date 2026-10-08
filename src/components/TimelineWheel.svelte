<script lang="ts" module>
  export interface WheelRow {
    key: string;
    name: string;
    family: string;
    month: string;
    year: number | string;
    href?: string;
    /** Months since the row before it, when two or more. */
    gap?: number;
    /** The project whose page this is. */
    current?: boolean;
    /** An empty stop: nothing began here. */
    empty?: boolean;
  }
</script>

<script lang="ts">
  // A list wheel: rows stacked in a fixed window, placed at their distance from
  // the front row and fading with it, turned by wheel, drag, swipe, arrow keys
  // or buttons, snapping to a row. With ends, it hands the scroll back to the
  // page at either end, so it never traps the reader; as a ring, it turns on.
  import { onMount } from 'svelte';

  interface Props {
    rows: WheelRow[];
    start: number;
    label: string;
    loop?: boolean;
    /** The label of the button that returns to the start, e.g. "Back to Xefy". */
    backLabel?: string;
    rowHeight?: number;
    /** Rows above and below the front that stay readable. */
    visible?: number;
  }

  let {
    rows,
    start,
    label,
    loop = false,
    backLabel,
    rowHeight = 60,
    visible = 2,
  }: Props = $props();

  const n = $derived(rows.length);
  let pos = $state(0);
  let target = 0;
  let ready = $state(false);
  let dragging = $state(false);
  let wheel: HTMLDivElement;
  let raf = 0;
  let snap: ReturnType<typeof setTimeout> | undefined;
  const still =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const wrap = (i: number) => ((i % n) + n) % n;
  const clamp = (v: number) => (loop ? v : Math.max(0, Math.min(n - 1, v)));
  /** A row's distance from the front, the short way round on a ring. */
  const offset = (i: number) => {
    let o = i - pos;
    if (loop) o = (((o % n) + n + n / 2) % n) - n / 2;
    return o;
  };
  const front = $derived(wrap(Math.round(pos)));

  function tick() {
    const d = target - pos;
    if (still || Math.abs(d) < 0.002) {
      pos = target;
      raf = 0;
      return;
    }
    pos += d * 0.16;
    raf = requestAnimationFrame(tick);
  }
  function go(to: number) {
    target = clamp(to);
    if (!raf) raf = requestAnimationFrame(tick);
  }
  const step = (k: number) => go(Math.round(target) + k);
  /** Go to row i the short way round. */
  function goRow(i: number) {
    let d = i - wrap(Math.round(target));
    if (loop && Math.abs(d) > n / 2) d -= Math.sign(d) * n;
    go(Math.round(target) + d);
  }

  function style(i: number) {
    if (!ready) return '';
    const o = offset(i),
      a = Math.abs(o);
    if (a > visible + 3.2) return 'visibility:hidden';
    const opacity =
      a <= visible ? 1 - a * 0.2 : Math.max(0, 0.2 - Math.max(0, a - visible - 1) * 0.08);
    return `transform:translateY(${(o * rowHeight).toFixed(1)}px);opacity:${opacity};z-index:${100 - Math.round(a * 10)}`;
  }

  onMount(() => {
    pos = target = start;
    ready = true;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      let d = e.deltaY;
      if (e.deltaMode === 1) d *= 33;
      // at an end, let the page scroll on
      if (!loop && ((d < 0 && target <= 0) || (d > 0 && target >= n - 1))) return;
      e.preventDefault();
      go(target + d / 150);
      clearTimeout(snap);
      snap = setTimeout(() => go(Math.round(target)), 150);
    };
    wheel.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      wheel.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(raf);
    };
  });

  let drag: {
    id: number;
    start: number;
    from: number;
    last: number;
    lastT: number;
    vel: number;
    active: boolean;
  } | null = null;
  let swallow = false;
  function down(e: PointerEvent) {
    if (e.button !== 0) return;
    swallow = false;
    drag = {
      id: e.pointerId,
      start: e.clientY,
      from: target,
      last: e.clientY,
      lastT: e.timeStamp,
      vel: 0,
      active: false,
    };
  }
  function move(e: PointerEvent) {
    if (!drag || e.pointerId !== drag.id) return;
    const dist = e.clientY - drag.start;
    if (!drag.active) {
      if (Math.abs(dist) < 6) return;
      drag.active = true;
      dragging = true;
      wheel.setPointerCapture(e.pointerId);
    }
    drag.vel = (e.clientY - drag.last) / Math.max(1, e.timeStamp - drag.lastT);
    drag.last = e.clientY;
    drag.lastT = e.timeStamp;
    cancelAnimationFrame(raf);
    raf = 0;
    target = pos = clamp(drag.from - dist / rowHeight);
  }
  function release(e: PointerEvent) {
    if (!drag || e.pointerId !== drag.id) return;
    if (drag.active) {
      swallow = true;
      dragging = false;
      go(Math.round(target - (drag.vel * 180) / rowHeight));
    }
    drag = null;
  }
  function click(e: MouseEvent) {
    if (swallow) {
      swallow = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // a row that is not in front comes to the front; the front row follows its link
    const row = (e.target as Element).closest<HTMLElement>('[data-row]');
    if (!row) return;
    const i = Number(row.dataset.row);
    if (i !== front) {
      e.preventDefault();
      e.stopPropagation();
      goRow(i);
    }
  }
  function key(e: KeyboardEvent) {
    const k: Record<string, () => void> = {
      ArrowDown: () => step(1),
      ArrowUp: () => step(-1),
      Home: () => (loop ? goRow(0) : go(0)),
      End: () => (loop ? goRow(n - 1) : go(n - 1)),
    };
    if (k[e.key]) {
      e.preventDefault();
      k[e.key]!();
    }
  }

  const frontRow = $derived(rows[front]);
</script>

<div class="rx-wrap">
  <div
    class="rx"
    class:is-ready={ready}
    class:is-dragging={dragging}
    bind:this={wheel}
    role="listbox"
    tabindex="0"
    aria-label={label}
    onpointerdown={down}
    onpointermove={move}
    onpointerup={release}
    onpointercancel={release}
    onclickcapture={click}
    onkeydown={key}
    ondragstart={(e) => e.preventDefault()}
  >
    <div class="rx-lens" aria-hidden="true"></div>
    {#each rows as row, i (row.key)}
      {@const inFront = ready && i === front}
      {@const cls = [
        'rx-item',
        row.current && 'cur',
        row.empty && 'empty',
        inFront && 'is-front',
        !loop && i === 0 && 'first',
        !loop && i === n - 1 && 'last',
        row.gap && 'gap',
      ]
        .filter(Boolean)
        .join(' ')}
      {#snippet inner()}
        <span class="d">{row.month}<small>{row.year}</small></span>
        <span class="k"><i class="t"></i></span>
        {#if row.gap}<span class="gp">{row.gap} months later</span>{/if}
        <span class="m"><span class="n">{row.name}</span><span class="f">{row.family}</span></span>
        <span class="go"
          >{row.empty ? 'Nothing began here' : row.current ? 'This project' : 'Open →'}</span
        >
      {/snippet}
      {#if row.href && !row.current}
        <a
          class={cls}
          href={row.href}
          data-row={i}
          role="option"
          aria-selected={inFront}
          tabindex={inFront ? 0 : -1}
          style={style(i)}
          draggable="false">{@render inner()}</a
        >
      {:else}
        <div
          class={cls}
          data-row={i}
          role="option"
          aria-selected={inFront}
          aria-current={row.current ? 'page' : undefined}
          style={style(i)}
        >
          {@render inner()}
        </div>
      {/if}
    {/each}
  </div>
  <div class="rx-ctrl">
    <button type="button" aria-label="Earlier" onclick={() => step(-1)}>↑</button>
    <button type="button" aria-label="Later" onclick={() => step(1)}>↓</button>
    {#if backLabel}
      <button
        type="button"
        class="rx-back"
        class:on={ready && front !== start}
        onclick={() => goRow(start)}>{backLabel}</button
      >
    {/if}
    <span class="now" aria-live="polite"
      >{ready && frontRow ? `${frontRow.month} ${frontRow.year}` : ''}</span
    >
  </div>
</div>
