import vikeSolid from 'vike-solid/config'
import type { Config } from 'vike/types'

// Default config (can be overridden by pages)
export default {
  title: 'My Vike + Solid App', // <title>
  description: 'Demo showcasing Vike + Solid', // <meta name="description">
  bodyAttributes: {
    class: 'dark'
  },
  extends: vikeSolid
} satisfies Config
