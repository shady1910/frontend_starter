import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  appType: 'mpa',
  base: './',
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    modulePreload: { polyfill: false },
  },
});
