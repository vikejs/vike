export { loadDistEntries }
export { setDistEntries }

import { assert, assertUsage } from '../../utils'
import { loadDistEntries as loadDistEntries_ } from 'vite-plugin-dist-importer/loadDistEntries'

let distEntries: DistEntries = null

type DistEntries = null | {
  pageFiles: () => Promise<Record<string, unknown>>
  clientManifest: () => Promise<Record<string, unknown>>
  serverManifest: () => Promise<Record<string, unknown>>
  pluginManifest: () => Promise<Record<string, unknown>>
}

function setDistEntries(distEntries_: DistEntries) {
  distEntries = distEntries_
}

async function loadDistEntries() {
  if (!distEntries) {
    loadDistEntries_({ assert, assertUsage, importBuildDocLink: 'https://vite-plugin-ssr.com/importBuild' })
    assert(distEntries)
  }

  const [pageFiles, clientManifest, serverManifest, pluginManifest] = await Promise.all([
    distEntries.pageFiles(),
    distEntries.clientManifest(),
    distEntries.serverManifest(),
    distEntries.pluginManifest(),
  ])
  return { pageFiles, clientManifest, serverManifest, pluginManifest }
}
