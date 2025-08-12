import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'

export default {
  passToClient: [{ prop: 'userFullName', once: true }],
  extends: vikeReact,
} satisfies Config
