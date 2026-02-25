import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'
import { node } from '@universal-deploy/node/vite'

export default {
  // TODO remove node adapter
  plugins: [react(), vike(), node()],
} satisfies UserConfig
