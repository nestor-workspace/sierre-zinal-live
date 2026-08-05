import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/sierre-zinal-live/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'data/sierre-zinal-2026.gpx', 'data/plan-effort-estelle.pdf'],
      manifest: {
        name: 'Estelle · Sierre-Zinal 2026',
        short_name: 'Sierre-Zinal',
        description: 'Tableau de bord de suivi de course et logistique spectateur.',
        theme_color: '#16231f',
        background_color: '#f4f0e7',
        display: 'standalone',
        start_url: '/sierre-zinal-live/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,gpx,pdf}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/tile\.openstreetmap\.org\//,
            handler: 'CacheFirst',
            options: { cacheName: 'osm-tiles', expiration: { maxEntries: 160, maxAgeSeconds: 604800 } },
          },
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\//,
            handler: 'NetworkFirst',
            options: { cacheName: 'race-weather', networkTimeoutSeconds: 4, expiration: { maxEntries: 8, maxAgeSeconds: 3600 } },
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
