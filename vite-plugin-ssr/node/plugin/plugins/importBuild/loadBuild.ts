export { loadBuild }
export { setLoaders }

import { assert, assertUsage } from '../../utils'
import { loadBuild as loadBuild_, importBuildFileName } from '@brillout/vite-plugin-import-build/loadBuild'

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
    const { success, entryFile } = await loadBuild_()
    assertUsage(
      success,
      `Cannot find production build. Did you run \`$ vite build\`? If you did, then you may need to use \`${importBuildFileName}\`, see https://vite-plugin-ssr.com/importBuild.cjs`
    )
    assert(buildGetters.getters, { entryFile })
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
