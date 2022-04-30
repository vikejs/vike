import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import type { UserConfig } from 'vite'

export default {
  plugins: [react(), ssr()],
  resolve: {
    // Only needed for this example
    // TODO: check if still needed
    preserveSymlinks: true,
  },
} as UserConfig
