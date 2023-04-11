import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'

export default {
  plugins: [
    react(),
    ssr({
      baseAssets: 'http://localhost:8080/cdn/'
    })
  ]
}
