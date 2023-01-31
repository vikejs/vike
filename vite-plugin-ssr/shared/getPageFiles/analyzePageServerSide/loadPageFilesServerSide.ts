export { loadPageFilesServerSide }

import { getPageFilesServerSide } from '../getAllPageIdFiles'
import { getExports } from '../getExports'
import type { PageFile } from '../getPageFileObject'
import type { PageConfig } from '../../page-configs/PageConfig'
import { loadPageCode } from '../../page-configs/loadPageCode'

async function loadPageFilesServerSide(pageFilesAll: PageFile[], pageConfig: null | PageConfig, pageId: string) {
  const pageFilesServerSide = getPageFilesServerSide(pageFilesAll, pageId)
  const pageConfigLoaded = !pageConfig ? null : await loadPageCode(pageConfig)
  await Promise.all(pageFilesServerSide.map((p) => p.loadFile?.()))
  const { exports, exportsAll, pageExports } = getExports(pageFilesServerSide, pageConfigLoaded)
  return {
    exports,
    exportsAll,
    pageExports,
    pageFilesLoaded: pageFilesServerSide,
    pageConfigLoaded
  }
}
