export { config }

import vikeReact from 'vike-react/config'
import { Layout } from './Layout'

const config = {
  passToClient: ['someEnvVar'],
  // https://vike.dev/Layout
  Layout: Layout,
  // https://vike.dev/extends
  extends: vikeReact,
  vite6BuilderApp: true,
}
