import type { Config } from 'vike/types'
import { onRenderClient } from '#root/renderer/onRenderClient'
import { onRenderHtml } from '#root/renderer/onRenderHtml'

export default {
  prerender: true,
  onRenderClient,
  onRenderHtml,
} satisfies Config
