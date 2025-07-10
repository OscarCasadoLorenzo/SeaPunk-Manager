import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env.renderer for frontend
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@ui/*': '/src/ui/*',
        '@drizzle/*': path.resolve(__dirname, 'drizzle'),
      },
    },
    define: {
      'process.env': env,
    },
  };
});
