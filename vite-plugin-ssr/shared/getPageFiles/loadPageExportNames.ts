export { loadPageExportNames }

import type { PageFile } from './types'
import { assert } from '../utils'
import { getRelevantPageFiles } from './getRelevantPageFiles'

async function loadPageExportNames(pageFilesAll: PageFile[], pageId: string, { skipPageSharedFiles }: { skipPageSharedFiles : boolean }) {
  const { pageFilesClientSide} = getRelevantPageFiles(pageFilesAll, pageId)

  await Promise.all(
    pageFilesClientSide.map(async (p) => {
      assert(p.fileType === '.page' || p.fileType === '.page.client')
      if( skipPageSharedFiles  && p.fileType==='.page' ) {
        return
      }
      // TODO:
      //  - Is `loadExportNames()` cached ?
      //  - Does it use filesExports if possible?
      //  - HMR?
      await p.loadExportNames?.()
      /*
      if (pageFile.exportNames) {
        return pageFile.exportNames.includes(clientRouting)
      }
      if (pageFile.fileExports) {
        return Object.keys(pageFile.fileExports).includes(clientRouting)
      }
      */
    }),
  )
}
