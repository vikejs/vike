import type { Config } from 'vike/types'
import passToClient from './passToClient'

export default {
  onRenderClient: 'import:./onRenderClient.tsx:onRenderClient',
  onRenderHtml: 'import:./onRenderHtml.jsx',
  passToClient,
  hydrationCanBeAborted: true
} satisfies Config
