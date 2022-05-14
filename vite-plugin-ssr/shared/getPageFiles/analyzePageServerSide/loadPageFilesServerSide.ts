export { loadPageFilesServerSide }

import { getPageFilesServerSide } from './getPageFilesServerSide'
import { getExports } from '../getExports'
import type { PageFile } from '../types'

async function loadPageFilesServerSide(pageFilesAll: PageFile[], pageId: string) {
  const pageFilesServerSide = getPageFilesServerSide(pageFilesAll, pageId)
  await Promise.all(pageFilesServerSide.map((p) => p.loadFile?.()))
  const { exports, exportsAll, pageExports } = getExports(pageFilesServerSide)
  return {
    exports,
    exportsAll,
    pageExports,
    pageFilesLoaded: pageFilesServerSide,
  }
}
