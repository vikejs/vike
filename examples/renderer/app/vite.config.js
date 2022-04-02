import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'

export default {
  plugins: [
    react(),
    ssr({
      pageFiles: {
        include: ['renderer'],
      },
    }),
  ],
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}
