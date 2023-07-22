import type { Config } from 'vike-react/types'
import Layout from '../layouts/LayoutDefault'
import vikeReact from 'vike-react'

export default {
  Layout,
  passToClient: [
    'userFullName',
    // https://github.com/vikejs/vike-react/issues/4
    'pageProps',
    'title'
  ],
  extends: vikeReact
} satisfies Config
