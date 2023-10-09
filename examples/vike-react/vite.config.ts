import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

export default {
  plugins: [react(), vike()],
  optimizeDeps: { include: ['cross-fetch', 'react/jsx-runtime'] }
} satisfies UserConfig
