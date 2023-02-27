import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000
  },
  plugins: [
    react(),
    ssr({
      prerender: {
        disableAutoRun: true,
        partial: true
      },
      includeAssetsImportedByServer: true
    })
  ]
})
