import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'

export default {
  plugins: [react(), ssr()],
  // Only needed for the vite-plugin-ssr CI
  optimizeDeps: { include: ['react', 'react-dom/client', 'react-redux', 'redux'] },
}
