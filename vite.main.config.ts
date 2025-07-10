import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@drizzle': path.resolve(__dirname, './drizzle'),
    },
  },
  build: {
    rollupOptions: {
      external: ['pg-native'],
    },
  },
});
