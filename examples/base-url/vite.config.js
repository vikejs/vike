import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'

export default {
  base: '/some/base-url/',
  plugins: [react(), ssr({ prerender: true })],
}
