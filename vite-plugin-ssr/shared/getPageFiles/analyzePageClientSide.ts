export { analyzePageClientSide }
export { analyzePageClientSideInit }

import type { PageFile } from './types'
import { getRelevantPageFiles } from './getRelevantPageFiles'
import { analyzeExports } from './analyzePageClientSide/analyzeExports'
import { determineClientEntry } from './analyzePageClientSide/determineClientEntry'
import { assert } from '../utils'

function analyzePageClientSide(pageFilesAll: PageFile[], pageId: string) {
  const { pageFilesClientSide, pageFilesServerSide } = getRelevantPageFiles(pageFilesAll, pageId)
  const { isHtmlOnly, isClientRouting } = analyzeExports({ pageFilesClientSide, pageFilesServerSide, pageId })
  const { clientEntry, clientDependencies } = determineClientEntry({
    pageFilesClientSide,
    pageFilesServerSide,
    isHtmlOnly,
    isClientRouting,
  })
  return { isHtmlOnly, isClientRouting, clientEntry, clientDependencies, pageFilesClientSide, pageFilesServerSide }
}

async function analyzePageClientSideInit(
  pageFilesAll: PageFile[],
  pageId: string,
  { sharedPageFilesAlreadyLoaded }: { sharedPageFilesAlreadyLoaded: boolean },
) {
  const { pageFilesClientSide } = getRelevantPageFiles(pageFilesAll, pageId)

  await Promise.all(
    pageFilesClientSide.map(async (p) => {
      assert(p.fileType === '.page' || p.fileType === '.page.client')
      if (sharedPageFilesAlreadyLoaded && p.fileType === '.page') {
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
