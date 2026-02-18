import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'
import { node } from '@universal-deploy/node/vite'

export default {
  plugins: [react(), vike(), node()],
  build: {
    rollupOptions: {
      output: {
        // TODO fix in UD (with also Vite@8 support)
        manualChunks(id) {
          if (id.includes('srvx')) {
            return 'srvx'
          }

          return null
        },
      },
    },
  },
} satisfies UserConfig
