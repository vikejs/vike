export { loadDistEntries }

import { distEntries } from './distEntries'
import { setViteManifest } from '../../../getViteManifest'
import { setPageFilesServerSide } from '../../../../shared/getPageFiles'
import { assert } from '../../utils'

async function loadDistEntries() {
  // There is no `dist/` in development
  if (!distEntries) {
    assert(distEntries === null)
    return
  }
  const [pageFiles, clientManifest, serverManifest, pluginManifest] = await Promise.all([
    distEntries.pageFiles(),
    distEntries.clientManifest(),
    distEntries.serverManifest(),
    distEntries.pluginManifest(),
  ])
  setPageFilesServerSide(pageFiles)
  setViteManifest({ clientManifest, serverManifest, pluginManifest })
}
