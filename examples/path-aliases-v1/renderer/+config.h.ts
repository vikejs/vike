import type { Config } from 'vite-plugin-ssr/types'
import onRenderClient from '#root/renderer/onRenderClient'
import onRenderHtml from '#root/renderer/onRenderHtml'

export default {
  onRenderClient,
  onRenderHtml
} satisfies Config
