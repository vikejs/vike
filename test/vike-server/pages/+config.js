export { config }

import vikeReact from 'vike-react/config'
import { Layout } from './Layout'
import vikeServer from 'vike-server/config'

const config = {
  Layout: Layout,
  server: 'server/index.js',
  extends: [vikeReact, vikeServer]
}
