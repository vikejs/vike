import type { ViteDevServer } from 'vite'

export { getIsPluginLoaded }

//@ts-ignore
export const store = (globalThis.__vikeNode ||= {
  isPluginLoaded: false,
  viteDevServer: undefined as ViteDevServer | undefined
})

function getIsPluginLoaded() {
  return store.isPluginLoaded
}
