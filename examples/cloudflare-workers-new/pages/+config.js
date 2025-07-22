export { config }

import vikeReact from 'vike-react/config'
import { Layout } from './Layout'

const config = {
  vite6BuilderApp: true,
  // https://vike.dev/Layout
  Layout: Layout,
  // https://vike.dev/extends
  extends: vikeReact,
}
