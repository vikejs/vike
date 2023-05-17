import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'

export default {
  plugins: [react(), ssr()],
  // TODO: remove need for this
  optimizeDeps: { include: ['vike-react-simple/onRenderClient'] }
}
