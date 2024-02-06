import type { Config } from 'vike/types'
import Layout from '../layouts/LayoutDefault'
import vikeReact from 'vike-react/config'

export default {
  Layout,
  passToClient: ['userFullName'],
  extends: vikeReact
} satisfies Config
