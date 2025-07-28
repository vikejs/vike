import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    cloudflare({
      // TODO/now: create GitHub issue to track progress on this
      viteEnvironment: { name: 'ssr' },
    }),
    vike(),
  ],
  ssr: {
    optimizeDeps: {
      exclude: ['@brillout/vite-plugin-server-entry'],
    },
  },
})
