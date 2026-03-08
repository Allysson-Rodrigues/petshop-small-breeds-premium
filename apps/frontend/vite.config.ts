import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          const packagePath = id.split('node_modules/')[1];
          if (!packagePath) {
            return 'vendor-misc';
          }

          const segments = packagePath.split('/');
          const packageName = segments[0]?.startsWith('@')
            ? `${segments[0]}-${segments[1]}`
            : segments[0];

          return `vendor-${packageName?.replace('@', '') ?? 'misc'}`;
        },
      },
    }
  }
})
