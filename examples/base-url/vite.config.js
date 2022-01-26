import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'

const base = process.env.BASE_URL
export default {
  plugins: [react(), ssr()],
  base,
}
