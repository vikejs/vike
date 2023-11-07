import type { Config } from 'vike/types'

export default {
  onRenderClient: 'import:./onRenderClient.tsx:onRenderClient',
  onRenderHtml: 'import:./onRenderHtml.jsx',
  passToClient: ['pageProps'],
  clientRouting: true,
  hydrationCanBeAborted: true
} satisfies Config
