import { createRequire } from 'node:module';
import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
const require = createRequire(import.meta.url);

const bufferPolyfill = (() => {
    try {
        return require.resolve('buffer/index.js');
    } catch {
        throw new Error(
            "The 'buffer' package is not installed. @blindflare/fortress needs it in the browser and does not declare it; without it Vite silently stubs the module and session key negotiation fails at runtime. Re-run the install step.",
        );
    }
})();

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'favicon.png', 'apple-touch-icon.png', 'robots.txt'],
            manifest: {
                name: '1337',
                short_name: '1337',
                description:
                    'Create and use clean, disposable email aliases that keep your real address hidden — with no content logs, no IP logs, and nothing to correlate you.',
                theme_color: '#0a0a0a',
                icons: [
                    {
                        src: 'favicon-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'favicon.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: 'maskable-icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
        }),
    ],
    optimizeDeps: {
        include: ['buffer'],
    },
    resolve: {
        alias: {
            buffer: bufferPolyfill,
            '@Features': path.resolve(__dirname, './src/features'),
            '@Components': path.resolve(__dirname, './src/components'),
            '@Assets': path.resolve(__dirname, './src/assets'),
            '@Services': path.resolve(__dirname, './src/services'),
            '@Pages': path.resolve(__dirname, './src/pages'),
            '@': path.resolve(__dirname, './src'),
        },
    },
});
