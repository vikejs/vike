import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'

export default {
  passToClient: ['userFullName'],
  extends: vikeReact,
} satisfies Config
