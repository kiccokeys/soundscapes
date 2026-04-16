import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  integrations: [
    react(),
    AstroPWA({
      manifest: {
        background_color: '#0e2030',
        description: 'Benessere audio guidato per corpo e mente.',
        display: 'standalone',
        icons: [
          ...[72, 128, 144, 152, 192, 256, 512].map(size => ({
            sizes: `${size}x${size}`,
            src: `/assets/pwa/${size}.png`,
            type: 'image/png',
          })),
        ],
        name: 'FeelbetterLab',
        orientation: 'any',
        scope: '/',
        short_name: 'FeelbetterLab',
        start_url: '/',
        theme_color: '#0e2030',
      },
      registerType: 'prompt',
      workbox: {
        globPatterns: ['**/*'],
        maximumFileSizeToCacheInBytes: Number.MAX_SAFE_INTEGER,
        navigateFallback: '/',
      },
    }),
  ],
});
