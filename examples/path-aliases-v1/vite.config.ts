import react from '@vitejs/plugin-react'
import ssr from 'vike/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  resolve: {
    alias: {
      '#root': __dirname
    }
  },
  plugins: [
    react(),
    ssr({
      prerender: true
    })
  ],
  optimizeDeps: {
    include: ['react-dom/client']
  }
}

export default config
