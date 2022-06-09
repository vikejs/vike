export { loadDistEntries }
export { setDistEntries }

import { assert, assertUsage } from '../../utils'
import { loadDistEntries as loadDistEntries_ } from 'vite-plugin-dist-importer/loadDistEntries'

let distEntries: DistEntries = null

type DistEntries = null | {
  pageFiles: () => Promise<Record<string, unknown>>
  clientManifest: () => Promise<Record<string, unknown>>
  pluginManifest: () => Promise<Record<string, unknown>>
}

function setDistEntries(distEntries_: DistEntries) {
  distEntries = distEntries_
}

async function loadDistEntries() {
  if (!distEntries) {
    const { success, entryFile, importBuildFileName } = await loadDistEntries_()
    assert(importBuildFileName)
    assertUsage(
      success,
      `Cannot find production build. Make sure to import \`${importBuildFileName}\`, see https://vite-plugin-ssr.com/importBuild.cjs`,
    )
    assert(distEntries, { entryFile })
  }

  const [pageFiles, clientManifest, pluginManifest] = await Promise.all([
    distEntries.pageFiles(),
    distEntries.clientManifest(),
    distEntries.pluginManifest(),
  ])
  return { pageFiles, clientManifest, pluginManifest }
}
