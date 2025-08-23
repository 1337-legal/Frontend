import path from 'path';
import { defineConfig } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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