import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { baseServer, baseAssets } from './base.js'

export default {
  plugins: [
    react(),
    vike({
      baseAssets,
      baseServer,
    }),
  ],
}
