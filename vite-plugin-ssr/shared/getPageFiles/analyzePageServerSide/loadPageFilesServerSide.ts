export { loadPageFilesServerSide }

import { getPageFilesServerSide } from '../getAllPageIdFiles'
import { getExports } from '../getExports'
import type { PageConfig } from '../getPageConfigsFromGlob'
import type { PageFile } from '../getPageFileObject'

async function loadPageFilesServerSide(pageFilesAll: PageFile[], pageConfigs: PageConfig[], pageId: string) {
  const pageFilesServerSide = getPageFilesServerSide(pageFilesAll, pageId)
  await Promise.all(pageFilesServerSide.map((p) => p.loadFile?.()))
  const { exports, exportsAll, pageExports } = getExports(pageFilesServerSide, pageConfigs)
  return {
    exports,
    exportsAll,
    pageExports,
    pageFilesLoaded: pageFilesServerSide
  }
}
