import type { ViteDevServer } from 'vite'

// @ts-expect-error
export const globalStore = (globalThis.__vikeNode ||= {
  isPluginLoaded: false
}) as {
  isPluginLoaded: boolean
  viteDevServer?: ViteDevServer
}
