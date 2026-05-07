import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, type PluginOption } from 'vite';

const apiProxyTarget = process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:3000';
const sentryOrg = process.env.SENTRY_ORG;
const sentryProject = process.env.SENTRY_FRONTEND_PROJECT ?? process.env.SENTRY_PROJECT;
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
const sentryRelease = process.env.SENTRY_RELEASE ?? process.env.GITHUB_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA;
const sentryBuildPlugin =
  sentryOrg && sentryProject && sentryAuthToken
    ? sentryVitePlugin({
        org: sentryOrg,
        project: sentryProject,
        authToken: sentryAuthToken,
        ...(sentryRelease ? { release: { name: sentryRelease } } : {}),
        sourcemaps: {
          assets: './dist/assets/**',
        },
        telemetry: false,
      })
    : null;
const plugins: PluginOption[] = [
  react(),
  tailwindcss(),
];

if (sentryBuildPlugin) {
  plugins.push(sentryBuildPlugin);
}

// https://vite.dev/config/
export default defineConfig({
  plugins,
  define: {
    __APP_RELEASE__: JSON.stringify(sentryRelease ?? 'development'),
  },
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
    sourcemap: sentryBuildPlugin ? 'hidden' : false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom')) {
            return 'vendor-react-dom';
          }

          if (id.includes('node_modules/react-router')) {
            return 'vendor-react-router';
          }

          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-framer-motion';
          }

          return undefined;
        },
      },
    }
  }
})
