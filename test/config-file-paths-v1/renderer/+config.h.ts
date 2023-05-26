import type { ConfigNonHeaderFile } from 'vite-plugin-ssr/types'

export default {
  onRenderClient: 'import:./onRenderClient.jsx',
  onRenderHtml: 'import:./onRenderHtml.jsx'
} satisfies ConfigNonHeaderFile
