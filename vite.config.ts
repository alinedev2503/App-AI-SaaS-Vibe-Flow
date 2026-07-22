import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import Sitemap from 'vite-plugin-sitemap';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isAnalyze = process.env.ANALYZE === 'true';
  const appUrl = env.APP_URL || 'https://vibeflow.ai';
  const gaId = env.VITE_GA_ID || '';
  const googleVerification = env.VITE_GOOGLE_VERIFICATION || '';
  const base = env.GH_PAGES === 'true' ? '/-AI-SaaS-Vibe-Flow/' : '/';

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      Sitemap({
        hostname: appUrl,
        dynamicRoutes: [
          '/', '/login', '/dashboard', '/command', '/agents',
          '/mcp', '/approvals', '/audit', '/settings', '/branding',
        ],
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date(),
      }),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          const metas: string[] = [];
          if (googleVerification) {
            metas.push(`<meta name="google-site-verification" content="${googleVerification}" />`);
          }
          const ga = gaId
            ? `
<script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');
</script>`
            : '';
          return html
            .replace('</head>', `${metas.join('\n')}${ga}\n</head>`);
        },
      },
      isAnalyze && visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-icons': ['lucide-react'],
            'vendor-gemini': ['@google/genai'],
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
