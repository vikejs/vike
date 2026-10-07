export { config }

import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'
import { Layout } from './Layout'

const config = {
  // https://vike.dev/Layout
  Layout: Layout,
  // https://vike.dev/extends
  extends: [vikeReact],
  // +server.ts is the server entry as-is (manual integration via renderPage())
  server: { custom: true },
} satisfies Config
