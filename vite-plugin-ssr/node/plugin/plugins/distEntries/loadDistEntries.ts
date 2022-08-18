export { loadDistEntries }
export { setDistEntries }

import { assert, assertUsage } from '../../utils'
import { loadDistEntries as loadDistEntries_ } from 'vite-plugin-dist-importer/loadDistEntries'

const distEntries = (globalThis.__vite_plugin_ssr__distEntries = globalThis.__vite_plugin_ssr__distEntries || {
  value: null,
})

type DistEntries = null | {
  pageFiles: () => Promise<Record<string, unknown>>
  clientManifest: () => Promise<Record<string, unknown>>
  pluginManifest: () => Promise<Record<string, unknown>>
}

function setDistEntries(distEntries_: DistEntries) {
  distEntries.value = distEntries_
}

async function loadDistEntries() {
  if (!distEntries.value) {
    const { success, entryFile, importBuildFileName } = await loadDistEntries_()
    assert(importBuildFileName)
    assertUsage(
      success,
      `Cannot find production build. Did you to run \`$ vite build\`? If you did, then you may need to use \`${importBuildFileName}\`, see https://vite-plugin-ssr.com/importBuild.cjs`,
    )
    assert(distEntries.value, { entryFile })
  }

  const [pageFiles, clientManifest, pluginManifest] = await Promise.all([
    distEntries.value.pageFiles(),
    distEntries.value.clientManifest(),
    distEntries.value.pluginManifest(),
  ])
  return { pageFiles, clientManifest, pluginManifest }
}

declare global {
  var __vite_plugin_ssr__distEntries:
    | undefined
    | {
        value: DistEntries
      }
}
