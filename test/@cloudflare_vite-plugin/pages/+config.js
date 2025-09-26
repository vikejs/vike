export { config }

import vikeReact from 'vike-react/config'
import { Layout } from './Layout'

const config = {
  passToClient: ['someEnvVar'],
  Layout: Layout,
  extends: vikeReact,
  vite6BuilderApp: true,
}
