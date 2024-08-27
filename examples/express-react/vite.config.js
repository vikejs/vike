import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import vikeNode from 'vike-node/plugin'

export default {
  plugins: [react(), vike(), vikeNode('server/index.js')]
}
