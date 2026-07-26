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

        // Split the vendor code that used to sit in one ~1.1 MB chunk. React
        // and motion are needed for first paint; Supabase is only touched once
        // the user signs in or submits a form, so it should not block the hero.
        advancedChunks: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'motion', test: /node_modules[\\/](motion|framer-motion)[\\/]/ },
            { name: 'supabase', test: /node_modules[\\/]@supabase[\\/]/ },
            { name: 'icons', test: /node_modules[\\/]lucide-react[\\/]/ },
          ],
        },
      },
    },
  },

  server: { port: 3000 },
  preview: { port: 3000 },
})
