import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],

  base: '/',

  resolve: {
    // Keep in sync with the "paths" entry in tsconfig.json
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

  build: {
    // 2026 baseline: every browser that gets security updates supports es2022
    target: 'es2022',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    emptyOutDir: true,

    // Vite 8 bundles with rolldown, so this is `rolldownOptions`, not the old
    // `rollupOptions`. Minification defaults to oxc — faster than esbuild and
    // no longer needs configuring here.
    rolldownOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',

        // Split the vendor code that used to sit in one ~1.1 MB chunk. React,
        // motion and the icons are needed for first paint.
        //
        // There is deliberately NO `supabase` group. There used to be, and it
        // backfired: `@supabase/supabase-js` is now reached only through the
        // lazily-loaded #admin route, but forcing it into a named group made
        // rolldown fold the module-preload helper into that same chunk. The
        // entry needs the helper, so the entry statically imported the chunk —
        // and every visitor downloaded 202 KB of auth SDK to render a CV.
        // Ungrouped, it rides along in the admin chunk where it belongs.
        advancedChunks: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'motion', test: /node_modules[\\/](motion|framer-motion)[\\/]/ },
            { name: 'icons', test: /node_modules[\\/]lucide-react[\\/]/ },
          ],
        },
      },
    },
  },

  server: { port: 3000 },
  preview: { port: 3000 },
})
