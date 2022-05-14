export { analyzePageClientSide }
export { analyzePageClientSideInit }

import { analyzeExports } from './analyzePageClientSide/analyzeExports'
import { determineClientEntry } from './analyzePageClientSide/determineClientEntry'
import { getPageFilesClientSide } from './analyzePageClientSide/getPageFilesClientSide'
import { getPageFilesServerSide } from './analyzePageServerSide/getPageFilesServerSide'
import type { PageFile } from './types'
import { assert } from '../utils'
import { getExportNames } from './analyzePageClientSide/getExportNames'

function analyzePageClientSide(pageFilesAll: PageFile[], pageId: string) {
  let pageFilesClientSide = getPageFilesClientSide(pageFilesAll, pageId)
  const pageFilesServerSide = getPageFilesServerSide(pageFilesAll, pageId)
  const { isHtmlOnly, isClientRouting } = analyzeExports({ pageFilesClientSide, pageFilesServerSide, pageId })

  if (isHtmlOnly) {
    // HTML-only pages do not need any client-side `render()` hook. For apps that have both HTML-only and SSR/SPA pages, we skip the `.page.client.js` file that defines `render()` for HTML-only pages.
    pageFilesClientSide = pageFilesClientSide.filter(
      (p) => p.fileType === '.page.client' && !getExportNames(p).includes('render'),
    )
  }

  const { clientEntries, clientDependencies } = determineClientEntry({
    pageFilesClientSide,
    pageFilesServerSide,
    isHtmlOnly,
    isClientRouting,
  })
  return { isHtmlOnly, isClientRouting, clientEntries, clientDependencies, pageFilesClientSide, pageFilesServerSide }
}

async function analyzePageClientSideInit(
  pageFilesAll: PageFile[],
  pageId: string,
  { sharedPageFilesAlreadyLoaded }: { sharedPageFilesAlreadyLoaded: boolean },
) {
  const pageFilesClientSide = getPageFilesClientSide(pageFilesAll, pageId)

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
