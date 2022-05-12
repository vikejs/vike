export { analyzePageClientSide }

import type { PageFile } from './types'
import { getRelevantPageFiles } from './getRelevantPageFiles'
import { analyzeExports } from './analyzePageClientSide/analyzeExports'
import { determineClientEntry } from './analyzePageClientSide/determineClientEntry'

function analyzePageClientSide(pageFilesAll: PageFile[], pageId: string) {
  const { pageFilesClientSide, pageFilesServerSide } = getRelevantPageFiles(pageFilesAll, pageId)
  const { isHtmlOnly, isClientRouting } = analyzeExports({ pageFilesClientSide, pageFilesServerSide, pageId })
  const { clientEntry, clientDependencies } = determineClientEntry({
    pageFilesClientSide,
    pageFilesServerSide,
    isHtmlOnly,
    isClientRouting,
  })
  return { isHtmlOnly, isClientRouting, clientEntry, clientDependencies }
}
