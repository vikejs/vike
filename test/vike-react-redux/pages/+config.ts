import Layout from '../layouts/LayoutDefault'
import vikeReact from 'vike-react/config'
import vikeReactRedux from 'vike-react-redux/config'
import type { Config } from 'vike/types'

export default {
  Layout,
  extends: [vikeReact, vikeReactRedux],
} satisfies Config
