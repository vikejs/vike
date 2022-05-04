export { loadPageFiles }

import { determinePageFilesToLoad } from './determinePageFilesToLoad'
import { getExports } from './getExports'
import type { PageFile } from './types'

async function loadPageFiles(pageFilesAll: PageFile[], pageId: string, isForClientSide: boolean) {
  const pageFiles = determinePageFilesToLoad(pageFilesAll, pageId, isForClientSide)
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
