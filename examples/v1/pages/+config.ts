import onRenderHtml from './+config/onRenderHtml'
import onRenderClient from './+config/onRenderClient'
import type { Config } from 'vite-plugin-ssr'

export default {
  onRenderClient,
  onRenderHtml,
  passToClient: ['pageProps']
} satisfies Config
