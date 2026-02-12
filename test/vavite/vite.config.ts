import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { defineConfig } from 'vite'
import { vavite } from 'vavite'

// Copied from https://github.com/cyco130/vavite/blob/8b7d7cc9563c6b3ca3ff5a6f27fabaaeb1495811/examples/vike/vite.config.ts

export default defineConfig({
  buildSteps: [
    { name: 'client' },
    {
      name: 'server',
      config: {
        build: { ssr: true },
      },
    },
  ],
  plugins: [
    react(),
    vike(),
    vavite({
      handlerEntry: '/server/index.ts',
      serveClientAssetsInDev: true,
    }),
  ],
})
