export { config }

import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'
import vikeReactZustand from 'vike-react-zustand/config'

const config = {
  title: 'My Vike + React App',
  extends: [vikeReact, vikeReactZustand],
} satisfies Config
