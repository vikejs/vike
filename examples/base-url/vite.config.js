import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import { base } from './server/base.js'

export default {
  plugins: [react(), ssr()],
  base,
}
