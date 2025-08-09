import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

export default {
  plugins: [react(), vike()],
  build: {
    rollupOptions: {
      external: ['cloudflare:workers'],
    },
  },
}
