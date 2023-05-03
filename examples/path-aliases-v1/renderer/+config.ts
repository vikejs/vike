import type { Config } from 'vite-plugin-ssr/types'
import onRenderClient from './onRenderClient'
import onRenderHtml from './onRenderHtml'

export default {
  onRenderClient,
  onRenderHtml
} satisfies Config
