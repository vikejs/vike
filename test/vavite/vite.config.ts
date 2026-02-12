import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { defineConfig } from 'vite'
import { vavite } from 'vavite'

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
