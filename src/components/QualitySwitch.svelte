<script lang="ts">
  // The visitor's choice of room: the Atelier, or the lighter void. The stage
  // reports its tier with a `kfa:tier` event and takes a `kfa:set-tier` one.
  import { onMount } from 'svelte';

  type Tier = 'high' | 'mid' | 'low';
  let tier = $state<Tier | null>(null);

  onMount(() => {
    const read = () => (tier = (document.documentElement.dataset.tier as Tier | undefined) ?? null);
    read();
    const on = (e: Event) => (tier = (e as CustomEvent<Tier>).detail);
    addEventListener('kfa:tier', on);
    return () => removeEventListener('kfa:tier', on);
  });

  const choose = (t: Tier) => dispatchEvent(new CustomEvent('kfa:set-tier', { detail: t }));
</script>

{#if tier}
  <span class="quality" role="group" aria-label="Room">
    <button type="button" aria-pressed={tier !== 'low'} onclick={() => choose('high')}
      >Atelier</button
    >
    <button type="button" aria-pressed={tier === 'low'} onclick={() => choose('low')}>Void</button>
  </span>
{/if}
