export { config }

import vikePhoton from 'vike-photon/config'
import vikeReact from 'vike-react/config'
import { Layout } from './Layout'

const config = {
  // https://vike.dev/Layout
  Layout: Layout,
  // https://vike.dev/extends
  extends: [vikePhoton, vikeReact],
}
