export { loadImportBuild }
export { setImportBuildGetters }

import { importServerProductionEntry } from '@brillout/vite-plugin-server-entry/runtime'
import { assert } from '../utils.js'

const buildGetters = (globalThis.__vike_buildGetters = globalThis.__vike_buildGetters || {
  getters: null
})

type BuildGetters = null | {
  pageFiles: Record<string, unknown>
  assetsManifest: Record<string, unknown>
  pluginManifest: Record<string, unknown>
}

function setImportBuildGetters(getters: BuildGetters) {
  buildGetters.getters = getters
}

async function loadImportBuild(outDir?: string) {
  if (!buildGetters.getters) {
    await importServerProductionEntry({ outDir })
    assert(buildGetters.getters)
  }

  const { pageFiles, assetsManifest, pluginManifest } = buildGetters.getters

  const buildEntries = { pageFiles, assetsManifest, pluginManifest }
  return buildEntries
}

declare global {
  var __vike_buildGetters:
    | undefined
    | {
        getters: BuildGetters
      }
}
