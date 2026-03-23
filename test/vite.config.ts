import { defineConfig, loadEnv } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const rootEnv = loadEnv(mode, resolve(currentDir, '..'), '');
  const testEnv = loadEnv(mode, currentDir, '');
  Object.assign(process.env, rootEnv, testEnv);

  return {
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    root: currentDir,
    server: {
    port: 4180,
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
