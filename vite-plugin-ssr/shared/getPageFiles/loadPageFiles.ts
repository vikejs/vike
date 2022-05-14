export { loadPageFilesClientSide }
export { loadPageFilesServerSide }

import { getExports } from './getExports'
import { getRelevantPageFiles } from './getRelevantPageFiles'
import type { PageFile } from './types'

async function loadPageFiles(pageFilesAll: PageFile[], pageId: string, isForClientSide: boolean) {
  const { pageFilesClientSide, pageFilesServerSide } = getRelevantPageFiles(pageFilesAll, pageId)
  const pageFilesLoaded = isForClientSide ? pageFilesClientSide : pageFilesServerSide
  await Promise.all(pageFilesLoaded.map((p) => p.loadFile?.()))
  const { exports, exportsAll, pageExports } = getExports(pageFilesLoaded)
  return {
    exports,
    exportsAll,
    pageExports,
    pageFilesLoaded,
  }
}

async function loadPageFilesServerSide(pageFilesAll: PageFile[], pageId: string) {
  return loadPageFiles(pageFilesAll, pageId, false)
}
async function loadPageFilesClientSide(pageFilesAll: PageFile[], pageId: string) {
  return loadPageFiles(pageFilesAll, pageId, true)
}
