import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@localization': path.resolve(__dirname, './src/localization'),
      '@helpers': path.resolve(__dirname, './src/helpers'),
    },
  },
});
