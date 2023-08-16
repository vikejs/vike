export { loadImportBuild }
export { setImportBuildGetters }

import { loadServerBuild } from '@brillout/vite-plugin-import-build/loadServerBuild.js'
import { assert, autoRetry } from '../utils.js'

const buildGetters = (globalThis.__vite_plugin_ssr__buildGetters = globalThis.__vite_plugin_ssr__buildGetters || {
  getters: null
})

type BuildGetters = null | {
  pageFiles: () => Promise<Record<string, unknown>>
  clientManifest: () => Promise<Record<string, unknown>>
  pluginManifest: () => Promise<Record<string, unknown>>
}

function setImportBuildGetters(getters: BuildGetters) {
  buildGetters.getters = getters
}

async function loadImportBuild(outDir?: string) {
  if (!buildGetters.getters) {
    await loadServerBuild(outDir)
    // Await dist/server/importBuild.cjs
    await autoRetry(() => {
      assert(buildGetters.getters)
    }, 2000)
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
