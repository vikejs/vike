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
  ],
  // Make test more interesting: avoid vite-plugin-server-entry from [finding the server entry by searching for the dist/ directory](https://github.com/brillout/vite-plugin-server-entry/blob/240f59b4849a3fdfd84448117a3aaf4fbe95a8a0/src/runtime/crawlServerEntry.ts)
  build: { outDir: 'build' }
}
