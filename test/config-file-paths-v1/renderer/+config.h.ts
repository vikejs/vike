import type { Config } from 'vike/types'

export default {
  onRenderClient: 'import:./onRenderClient.jsx',
  onRenderHtml: 'import:./onRenderHtml.jsx'
} satisfies Config
