import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'

export default {
  plugins: [react(), vike()],
  optimizeDeps: {
    include: ['vike'],
    // exclude: ['vike-react-zustand', 'vike-react', '@brillout/picocolors', '@brillout/json-serializer']
  },
} satisfies UserConfig
