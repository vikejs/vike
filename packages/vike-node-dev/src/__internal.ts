import type { IncomingMessage } from 'http'
import type { ViteDevServer } from 'vite'

// @ts-expect-error
export const globalObject = (globalThis.__vikeNode ||= {
  isPluginLoaded: false,
  // This is overridden in devServerPlugin
  // in production it's a no-op
  setupHMRProxy: () => {}
}) as {
  isPluginLoaded: boolean
  viteDevServer?: ViteDevServer
  setupHMRProxy: (req: IncomingMessage) => void
}
