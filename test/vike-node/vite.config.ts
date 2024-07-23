import react from '@vitejs/plugin-react'
import { telefunc } from 'telefunc/vite'
import vike from 'vike/plugin'
import vikeNode from 'vike-node/plugin'

const FRAMEWORK = process.env.VIKE_NODE_FRAMEWORK || 'hono'

export default {
  plugins: [
    react(),
    vike(),
    vikeNode({ entry: { index: `./server/index-${FRAMEWORK}.ts`, worker: './server/worker.mjs' }, standalone: true }),
    telefunc()
  ]
}
