import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

export default {
  plugins: [react(), vike()],
  build: {
    rollupOptions: {
      // TODO/now why is it needed?
      external: ['cloudflare:workers'],
    },
  },
  ssr: {
    external: ['cloudflare:workers'],
  },
}
