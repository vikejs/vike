export { loadBuild }
export { setLoaders }

import { assert } from '../../utils'
import { loadServerBuild } from '@brillout/vite-plugin-import-build/loadServerBuild'

const buildGetters = (globalThis.__vite_plugin_ssr__buildGetters = globalThis.__vite_plugin_ssr__buildGetters || {
  getters: null
})

type BuildGetters = null | {
  pageFiles: () => Promise<Record<string, unknown>>
  clientManifest: () => Promise<Record<string, unknown>>
  pluginManifest: () => Promise<Record<string, unknown>>
}

function setLoaders(getters: BuildGetters) {
  buildGetters.getters = getters
}

async function loadBuild() {
  if (!buildGetters.getters) {
    await loadServerBuild()
    assert(buildGetters.getters)
  }

  const [pageFiles, clientManifest, pluginManifest] = await Promise.all([
    buildGetters.getters.pageFiles(),
    buildGetters.getters.clientManifest(),
    buildGetters.getters.pluginManifest()
  ])

  const buildEntries = { pageFiles, clientManifest, pluginManifest }
  return buildEntries
}

declare global {
  var __vite_plugin_ssr__buildGetters:
    | undefined
    | {
        getters: BuildGetters
      }
}
