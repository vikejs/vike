import react from '@vitejs/plugin-react'
import { telefunc } from 'telefunc/vite'
import vike from 'vike/plugin'
import vikeNode from 'vike-node/plugin'

export default {
  plugins: [
    react(),
    vike(),
    vikeNode({ entry: { index: './server/index-express.ts', worker: './server/worker.mjs' }, standalone: true }),
    telefunc()
  ]
}
