// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { SITE } from './src/config/site';

// The user site of the GitHub account: served from the root of the domain,
// beside every project site at /<Repo>/. Project pages therefore live under
// /p/ so that no route here can shadow a repository's own address.
export default defineConfig({
  site: SITE.url,
  trailingSlash: 'always',

  // Older addresses that now belong to the personal site. Static hosting
  // cannot send HTTP redirects, so each becomes a small page that forwards
  // the visitor and names the new address as canonical.
  redirects: {
    '/about': SITE.personalSite,
    '/pages': SITE.personalSite,
  },

  integrations: [svelte(), sitemap()],

  // Self-hosted at build time: no request leaves for a font service at runtime.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Bodoni Moda',
      cssVariable: '--font-bodoni',
      weights: ['400 600'],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Didot', 'Georgia', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Cormorant Garamond',
      cssVariable: '--font-cormorant',
      weights: ['300', '400'],
      styles: ['italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Manrope',
      cssVariable: '--font-manrope',
      weights: ['400 600'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
    // three.js and the stage form one chunk, fetched only by pages with the stage
    build: { chunkSizeWarningLimit: 800 },
  },
});
