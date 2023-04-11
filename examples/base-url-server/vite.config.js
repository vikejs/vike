import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import { baseServer, baseAssets } from './base.js'

export default {
  plugins: [
    react(),
    ssr({
      baseAssets,
      baseServer
    })
  ]
}
