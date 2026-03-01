import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { configDefaults, defineConfig } from 'vitest/config';

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
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/setupTests.ts'],
    exclude: [...configDefaults.exclude, 'tests/**'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separando dependências de node_modules em chunks menores sem causar ciclos
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('lucide') || id.includes('@remix-run') || id.includes('recharts')) {
              return 'vendor-ui';
            }
            return 'vendor-core';
          }
        }
      }
    }
  }
})
