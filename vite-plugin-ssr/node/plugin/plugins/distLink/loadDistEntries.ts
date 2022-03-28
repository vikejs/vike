export { loadDistEntries }

import { distEntries } from './distEntries'
import { assert } from '../../utils'

async function loadDistEntries() {
  // There is no `dist/` in development
  if (!distEntries) {
    assert(distEntries === null)
    return null
  }
  const [pageFiles, clientManifest, serverManifest, pluginManifest] = await Promise.all([
    distEntries.pageFiles(),
    distEntries.clientManifest(),
    distEntries.serverManifest(),
    distEntries.pluginManifest(),
  ])
  return { pageFiles, clientManifest, serverManifest, pluginManifest }
}
