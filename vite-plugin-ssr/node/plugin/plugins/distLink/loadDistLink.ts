import { distEntries } from './generatedFile'
import { setViteManifest } from '../../../getViteManifest'
import { setDistLinkStatus } from '../../../globalContext'
import { setPageFilesServerSide } from '../../../../shared/getPageFiles'
import { assert } from '../../utils'

loadDistLink()

function loadDistLink() {
  // There is no `dist/` in development
  if (!distEntries) {
    assert(distEntries === null)
    setDistLinkStatus(false)
    return
  }
  setDistLinkStatus(true)
  const { pageFiles, clientManifest, serverManifest, pluginManifest } = distEntries
  setPageFilesServerSide(pageFiles)
  setViteManifest({ clientManifest, serverManifest, pluginManifest })
}
