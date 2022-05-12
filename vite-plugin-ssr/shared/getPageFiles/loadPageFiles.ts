export { loadPageFiles }

import { getExports } from './getExports'
import { getRelevantPageFiles } from './getRelevantPageFiles'
import type { PageFile } from './types'

async function loadPageFiles(pageFilesAll: PageFile[], pageId: string, isForClientSide: boolean) {
  const { pageFilesClientSide, pageFilesServerSide } = getRelevantPageFiles(pageFilesAll, pageId)
  const pageFiles = isForClientSide ? pageFilesClientSide : pageFilesServerSide
  await Promise.all(pageFiles.map((p) => p.loadFile?.()))
  const { exports, exportsAll, pageExports } = getExports(pageFiles)
  const pageContextAddendum = {
    exports,
    exportsAll,
    pageExports,
    _loadedPageFiles: pageFiles.map((p) => p.filePath),
  }
  return pageContextAddendum
}
