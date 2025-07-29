export { config }

import vikeReact from 'vike-react/config'
import { Layout } from './Layout'

const config = {
  // https://vike.dev/Layout
  Layout: Layout,
  // https://vike.dev/extends
  extends: vikeReact,
  // TODO/now: why is this needed?
  vite6BuilderApp: true,
}
