import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: 'vuetify-extended/lib/esm/css/index.css',
        replacement: resolve(__dirname, '../src/css/index.css'),
      },
      {
        find: /^vuetify-extended$/,
        replacement: resolve(__dirname, '../src/index.ts'),
      },
    ],
    dedupe: ['vue', 'vuetify'],
  },
  esbuild: {
    target: 'esnext',
  },
  optimizeDeps: {
    exclude: ['vuetify-extended'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
  },
});
