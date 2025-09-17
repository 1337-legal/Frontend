import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.png', 'robots.txt'],
    manifest: {
      name: '1337',
      short_name: '1337',
      description: 'Create and use clean, disposable email aliases that keep your real address hidden — with no content logs, no IP logs, and nothing to correlate you.',
      theme_color: '#0a0a0a',
      icons: [
        {
          src: 'favicon.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'favicon.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'favicon.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        }
      ]
    }
  })],
  resolve: {
    alias: {
      "@Features": path.resolve(__dirname, "./src/features"),
      "@Components": path.resolve(__dirname, "./src/components"),
      "@Assets": path.resolve(__dirname, "./src/assets"),
      "@Services": path.resolve(__dirname, "./src/services"),
      "@Pages": path.resolve(__dirname, "./src/pages"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
})