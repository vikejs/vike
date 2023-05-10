import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'

export default {
  plugins: [react(), ssr()],
  // TODO: why is this needed?
  optimizeDeps: { include: ['vike-react-simple/onRenderClient'] }
}
