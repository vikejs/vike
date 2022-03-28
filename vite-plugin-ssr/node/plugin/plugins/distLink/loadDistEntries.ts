export { loadDistEntries }

import { assert } from '../../utils'

async function loadDistEntries() {
  // We make sure to load `distEntries` after the file was generated
  const { distEntries } = require('./distEntries')

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
