import { getExports } from '../getExports'
import type { PageFile } from '../types'
import { getPageFilesClientSide } from './getPageFilesClientSide'

export { loadPageFilesClientSide }

async function loadPageFilesClientSide(pageFilesAll: PageFile[], pageId: string) {
  const pageFilesClientSide = getPageFilesClientSide(pageFilesAll, pageId)
  await Promise.all(pageFilesClientSide.map((p) => p.loadFile?.()))
  const { exports, exportsAll, pageExports } = getExports(pageFilesClientSide)
  return {
    exports,
    exportsAll,
    pageExports,
    pageFilesLoaded: pageFilesClientSide,
  }
}
