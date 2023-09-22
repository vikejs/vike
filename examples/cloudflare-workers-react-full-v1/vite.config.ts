import react from '@vitejs/plugin-react'
import ssr from 'vike/plugin'
import type { UserConfig } from 'vite'

export default {
  plugins: [react(), ssr()],
  resolve: {
    // Only needed for this example
    // TODO: check if still needed
    preserveSymlinks: true
  },
  // We manually add a list of dependencies to be pre-bundled, in order to avoid a page reload at dev start which breaks vike's CI
  optimizeDeps: { include: ['react-streaming'] }
} as UserConfig
