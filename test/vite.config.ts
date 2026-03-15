import { defineConfig, loadEnv } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const rootEnv = loadEnv(mode, resolve(currentDir, '..'), '');
  const testEnv = loadEnv(mode, currentDir, '');
  Object.assign(process.env, rootEnv, testEnv);

  return {
    root: currentDir,
    server: {
    port: 4176,
    fs: {
      allow: [resolve(currentDir, '..')],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@test': resolve(currentDir, 'src'),
    },
  },
  };
});
