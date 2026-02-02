import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';

export default defineConfig({
  integrations: [
    tailwind(),
    react(),
    svelte({
      compatibility: {
        componentApi: 4,
      },
    }),
  ],
  site: 'https://www.highlinefinancialcoaching.com', // Update with real domain
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
