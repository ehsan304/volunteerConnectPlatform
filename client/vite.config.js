import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // This should be correct
  build: {
    outDir: 'dist',
    assetsDir: 'assets', // Explicitly set assets directory
    sourcemap: false // Disable sourcemaps for production
  },
  server: {
    port: 3000
  }
})