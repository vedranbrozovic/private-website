import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

const SPA_STATIC_ROUTES = [
  'vibecoding',
  'vibecoding/crotopia',
  'reading',
  'education',
  'work',
  'nonprofit',
  'ballislife',
  'blog',
  'film',
  'old',
];

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'generate-spa-static-routes',
        closeBundle() {
          const distDir = path.resolve(__dirname, 'dist');
          const indexHtml = path.join(distDir, 'index.html');
          if (!fs.existsSync(indexHtml)) return;

          fs.copyFileSync(indexHtml, path.join(distDir, '404.html'));

          for (const route of SPA_STATIC_ROUTES) {
            const routeDir = path.join(distDir, route);
            fs.mkdirSync(routeDir, { recursive: true });
            fs.copyFileSync(indexHtml, path.join(routeDir, 'index.html'));
          }
        },
      },
    ],
    base: '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
