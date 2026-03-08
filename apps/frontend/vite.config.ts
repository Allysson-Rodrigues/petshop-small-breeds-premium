import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

const apiProxyTarget = process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:3000';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
      }
    }
  },
  preview: {
    proxy: {
      '/api': {
        target: apiProxyTarget,
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
