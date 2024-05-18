import type { Config } from 'vike/types'

export default {
  Page: 'import:./Page.jsx',
  ['document.title']: 'Some title set by nested config'
} satisfies Config
