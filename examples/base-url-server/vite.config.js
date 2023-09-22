import react from '@vitejs/plugin-react'
import ssr from 'vike/plugin'
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
