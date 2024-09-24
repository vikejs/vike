export { config }

import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'

// Default configs (can be overridden by pages)
const config = {
  // <title>
  title: 'My Vike + React App',
  // https://vike.dev/stream
  stream: true,
  // https://vike.dev/ssr - this line can be removed since `true` is the default
  ssr: true,
  bodyAttributes: { class: 'dark' },
  viewport: 999,
  // https://vike.dev/extends
  extends: vikeReact
} satisfies Config
