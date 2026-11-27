import tailwindcss from '@tailwindcss/vite';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  appType: 'mpa',
  base: './',

  plugins: [
    tailwindcss(),

    {
      name: 'offline-compatible-build',
      apply: 'build',
      enforce: 'post',

      async writeBundle(options, bundle) {
        for (const file of Object.keys(bundle)) {
          if (!file.endsWith('.html')) continue;

          const path = resolve(options.dir || 'dist', file);
          let html = await readFile(path, 'utf8');

          // Remove crossorigin from scripts and stylesheets
          html = html.replace(
            /<(?:script|link)\b[^>]*>/gi,
            (tag) =>
              tag.replace(
                /\s+crossorigin(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi,
                ''
              )
          );

          // Convert module scripts to classic scripts
          html = html.replace(
            /<script\b[^>]*>/gi,
            (tag) =>
              tag.replace(
                /\btype=["']module["']/gi,
                'defer'
              )
          );

          await writeFile(path, html, 'utf8');
        }
      },
    },
  ],

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    modulePreload: false,

    rolldownOptions: {
      output: {
        format: 'iife',
        codeSplitting: false,

        entryFileNames: 'assets/script.js',

        assetFileNames: ({ names }) =>
          names.some((name) => name.endsWith('.css'))
            ? 'assets/styles.css'
            : 'assets/[name]-[hash][extname]',
      },
    },
  },
});
