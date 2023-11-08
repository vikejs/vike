import type { Config } from 'vike/types'

export default {
  onRenderClient: 'import:./onRenderClient.tsx:onRenderClient',
  onRenderHtml: 'import:./onRenderHtml.jsx',
  passToClient: ['pageProps'],
  hydrationCanBeAborted: true
} satisfies Config
