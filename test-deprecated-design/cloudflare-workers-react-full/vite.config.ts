import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'

export default {
  plugins: [react(), vike()],
  resolve: {
    // Only needed for this example
    // TODO: check if still needed
    preserveSymlinks: true
  }
} as UserConfig
