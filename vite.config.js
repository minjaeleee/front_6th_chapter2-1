import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  // 개발 모드에서는 '/', 프로덕션 빌드에서는 GitHub Pages 경로
  base: command === 'serve' ? '/' : '/front_6th_chapter2-1/',

  plugins: [react()],

  // 빌드 설정
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.advanced.html',
      },
    },
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/advanced', import.meta.url)),
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
  },
}));
