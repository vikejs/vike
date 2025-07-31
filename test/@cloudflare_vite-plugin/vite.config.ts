import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    cloudflare({
      // Remove this line depending on the outcome of https://github.com/cloudflare/workers-sdk/issues/10120
      viteEnvironment: { name: 'ssr' },
    }),
    vike(),
  ],
})
